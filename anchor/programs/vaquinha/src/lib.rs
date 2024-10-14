use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("qjRm9YEVnGNoY2vCn4LsroiYixVnkn4Fwrta2qgxa1f");

#[program]
pub mod vaquinha {
    use super::*;

    pub fn initialize_round(
      ctx: Context<InitializeRound>,
      round_id: String,
      payment_amount: u64,
      number_of_players: u8,
      frequency_of_turns: i64,
    ) -> Result<()> {
        let round = &mut ctx.accounts.round;
        round.round_id = round_id;
        round.bump = ctx.bumps.round;
        round.payment_amount = payment_amount;
        round.number_of_players = number_of_players;
        round.current_index_of_player = 0;
        round.current_turn_paid_amount = 0;
        round.total_amount_locked = 0;
        round.available_slots = number_of_players;
        round.frequency_of_turns = frequency_of_turns;
        round.status = RoundStatus::Pending;
        round.token_mint = ctx.accounts.token_mint.key();

        // Lock tokens for the initializer
        let amount_to_lock = payment_amount * (number_of_players as u64);
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.initializer_token_account.to_account_info(),
                    to: ctx.accounts.round_token_account.to_account_info(),
                    authority: ctx.accounts.initializer.to_account_info(),
                },
            ),
            amount_to_lock,
        )?;

        // Update round state
        round.players.push(ctx.accounts.initializer.key());
        round.total_amount_locked += amount_to_lock;
        round.available_slots -= 1;

        Ok(())
    }

    pub fn add_player(ctx: Context<AddPlayer>) -> Result<()> {
        let round = &mut ctx.accounts.round;
        require!(round.status == RoundStatus::Pending, ErrorCode::RoundNotPending);
        require!(round.available_slots > 0, ErrorCode::RoundFull);

        // Lock tokens
        let amount_to_lock = round.payment_amount * (round.number_of_players as u64);
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.player_token_account.to_account_info(),
                    to: ctx.accounts.round_token_account.to_account_info(),
                    authority: ctx.accounts.player.to_account_info(),
                },
            ),
            amount_to_lock,
        )?;

        // Update round state
        round.players.push(ctx.accounts.player.key());
        round.total_amount_locked += amount_to_lock;
        round.available_slots -= 1;

        // If this was the last player, activate the round
        if round.available_slots == 0 {
            round.status = RoundStatus::Active;
        }

        Ok(())
    }

    pub fn pay_turn(ctx: Context<PayTurn>) -> Result<()> {
        let round = &mut ctx.accounts.round;
        require!(round.status == RoundStatus::Active, ErrorCode::RoundNotActive);

        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.player_token_account.to_account_info(),
                    to: ctx.accounts.round_token_account.to_account_info(),
                    authority: ctx.accounts.player.to_account_info(),
                },
            ),
            round.payment_amount,
        )?;

        round.current_turn_paid_amount += round.payment_amount;

        Ok(())
    }

    pub fn withdraw_turn(ctx: Context<WithdrawTurn>) -> Result<()> {
        msg!("Round Token Account owner: {:?}", ctx.accounts.round_token_account.owner);
        msg!("Round PDA: {:?}", ctx.accounts.round.key());
        let round = &ctx.accounts.round;
        require!(round.status == RoundStatus::Active, ErrorCode::RoundNotActive);
    
        // Check if it's the current player's turn
        let current_player = round.players[round.current_index_of_player as usize];
        require!(current_player == ctx.accounts.player.key(), ErrorCode::NotPlayersTurn);
    
        // Check if all other players have paid
        let expected_amount = round.payment_amount * ((round.players.len() as u64) - 1);
        require!(round.current_turn_paid_amount == expected_amount, ErrorCode::InsufficientFunds);
    
        // Transfer the funds to the player
        let transfer_amount = round.current_turn_paid_amount;
        let round_seeds = &[
            b"round",
            round.round_id.as_bytes(),
            &[ctx.bumps.round]
        ];
        msg!("Round Seeds: {:?}", round_seeds);
    
        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.round_token_account.to_account_info(),
                    to: ctx.accounts.player_token_account.to_account_info(),
                    authority: ctx.accounts.round.to_account_info(),
                },
                &[round_seeds]
            ),
            transfer_amount,
        )?;
    
        // Update round state
        let round = &mut ctx.accounts.round;
        round.current_turn_paid_amount = 0;
        round.current_index_of_player += 1;
    
        if round.current_index_of_player as usize == round.players.len() {
            round.status = RoundStatus::Completed;
        }
    
        Ok(())
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum RoundStatus {
    Pending,
    Active,
    Completed,
}

#[account]
pub struct Round {
    pub bump: u8,
    pub round_id: String,
    pub payment_amount: u64,
    pub token_mint: Pubkey,
    pub number_of_players: u8,
    pub players: Vec<Pubkey>,
    pub current_index_of_player: u8,
    pub current_turn_paid_amount: u64,
    pub total_amount_locked: u64,
    pub available_slots: u8,
    pub frequency_of_turns: i64,
    pub status: RoundStatus,
}

#[derive(Accounts)]
#[instruction(round_id: String)]
pub struct InitializeRound<'info> {
    #[account(
        init, 
        payer = initializer, 
        space = 8 + // discriminator
                8 + // payment_amount
                32 +
                32 + // token_mint
                1 + // number_of_players
                (32 * 50) + // players (assuming max 50 players)
                1 + // current_index_of_player
                8 + // current_turn_paid_amount
                8 + // total_amount_locked
                1 + // available_slots
                8 + // frequency_of_turns
                1 + // status
                50,  // some extra space for future use
        seeds = [b"round".as_ref(), round_id.as_bytes()],
        bump
    )]
    pub round: Account<'info, Round>,
    #[account(mut)]
    pub initializer: Signer<'info>,
    pub token_mint: Account<'info, token::Mint>,
    #[account(mut)]
    pub initializer_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub round_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddPlayer<'info> {
    #[account(mut)]
    pub round: Account<'info, Round>,
    pub player: Signer<'info>,
    #[account(mut)]
    pub player_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub round_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct PayTurn<'info> {
    #[account(mut)]
    pub round: Account<'info, Round>,
    pub player: Signer<'info>,
    #[account(mut)]
    pub player_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub round_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct WithdrawTurn<'info> {
    #[account(
        mut,
        seeds = [b"round", round.round_id.as_bytes()],
        bump
    )]
    pub round: Account<'info, Round>,
    pub player: Signer<'info>,
    #[account(mut)]
    pub player_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub round_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("The round is not in pending status")]
    RoundNotPending,
    #[msg("The round is full")]
    RoundFull,
    #[msg("The round is not active")]
    RoundNotActive,
    #[msg("It's not this player's turn to pay")]
    NotPlayersTurn,
    #[msg("Insufficient funds for withdrawal")]
    InsufficientFunds,
    #[msg("Turn already paid")]
    TurnAlreadyPaid
}