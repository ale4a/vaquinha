use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("qjRm9YEVnGNoY2vCn4LsroiYixVnkn4Fwrta2qgxa1f");

#[program]
pub mod vaquinha {
    use super::*;

    pub fn initialize_round(
      ctx: Context<InitializeRound>,
      payment_amount: u64,
      number_of_players: u8,
      frequency_of_turns: i64,
    ) -> Result<()> {
        msg!("stg0");
        let round = &mut ctx.accounts.round;
        round.payment_amount = payment_amount;
        round.number_of_players = number_of_players;
        round.current_index_of_player = 0;
        round.total_amount_locked = 0;
        round.available_slots = number_of_players;
        round.frequency_of_turns = frequency_of_turns;
        round.status = RoundStatus::Pending;
        round.token_mint = ctx.accounts.token_mint.key();
        msg!("stg1");

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

        msg!("stg2");

        // Update round state
        round.players.push(ctx.accounts.initializer.key());
        round.order_of_turns.push(ctx.accounts.initializer.key());
        round.total_amount_locked += amount_to_lock;
        round.available_slots -= 1;

        msg!("stg3");
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
        round.order_of_turns.push(ctx.accounts.player.key());
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

        // Ensure the current player is paying
        require!(
            ctx.accounts.player.key() == round.players[round.current_index_of_player as usize],
            ErrorCode::NotPlayersTurn
        );

        // Transfer payment to the current turn's player
        let current_turn_player = round.order_of_turns[round.current_index_of_player as usize];
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.round_token_account.to_account_info(),
                    to: ctx.accounts.recipient_token_account.to_account_info(),
                    authority: round.to_account_info(),
                },
            ),
            round.payment_amount,
        )?;

        // Update round state
        round.current_index_of_player += 1;
        if round.current_index_of_player as usize == round.players.len() {
            round.status = RoundStatus::Completed;
            // Here you'd implement logic to release remaining funds to players
        }

        Ok(())
    }

    // Additional methods would be implemented here
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum RoundStatus {
    Pending,
    Active,
    Completed,
}

#[account]
pub struct Round {
    pub payment_amount: u64,
    pub token_mint: Pubkey,
    pub number_of_players: u8,
    pub players: Vec<Pubkey>,
    pub current_index_of_player: u8,
    pub order_of_turns: Vec<Pubkey>,
    pub total_amount_locked: u64,
    pub available_slots: u8,
    pub frequency_of_turns: i64,
    pub status: RoundStatus,
}

#[derive(Accounts)]
pub struct InitializeRound<'info> {
    #[account(init, payer = initializer, space = 8 + 32 + 32 + 1 + 32 * 50 + 1 + 32 * 50 + 8 + 1 + 8 + 1)]
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
    pub round_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub recipient_token_account: Account<'info, TokenAccount>,
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
}