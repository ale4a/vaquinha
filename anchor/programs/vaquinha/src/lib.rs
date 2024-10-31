use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("Hau5pBj6xZ9WHBe9uF9rL92tHJPaHihwDG9SigRfUvxd");

#[program]
pub mod vaquinha {
    use super::*;

    pub fn initialize_round(
        ctx: Context<InitializeRound>,
        round_id: String,
        payment_amount: u64,
        number_of_players: u8,
        frequency_of_turns: i64,
        position: u8
    ) -> Result<()> {
        let round = &mut ctx.accounts.round;
        round.round_id = round_id;
        round.bump = ctx.bumps.round;
        round.payment_amount = payment_amount;
        round.number_of_players = number_of_players;
        round.total_amount_locked = 0;
        round.available_slots = number_of_players;
        round.frequency_of_turns = frequency_of_turns;
        round.status = RoundStatus::Pending;
        round.token_mint = ctx.accounts.token_mint.key();
        round.withdrawn_collateral = vec![false; number_of_players as usize];
        round.turn_accumulations = vec![0; number_of_players as usize];
        round.paid_turns = vec![0; number_of_players as usize];
        round.withdrawn_turns = vec![false; number_of_players as usize];
        round.withdrawn_interest = vec![false; number_of_players as usize];

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
        round.positions.push(position);
        round.total_amount_locked += amount_to_lock;
        round.available_slots -= 1;

        Ok(())
    }

    pub fn add_player(ctx: Context<AddPlayer>, position: u8) -> Result<()> {
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
        round.positions.push(position);
        round.total_amount_locked += amount_to_lock;
        round.available_slots -= 1;

        // If this was the last player, activate the round
        if round.available_slots == 0 {
            round.status = RoundStatus::Active;
            round.start_timestamp = Clock::get()?.unix_timestamp;
        }

        Ok(())
    }

    pub fn pay_turn(ctx: Context<PayTurn>, turn: u8) -> Result<()> {
        let round = &mut ctx.accounts.round;
        let recipient_index = round.positions.iter().position(|&p| p == turn).ok_or(ErrorCode::InvalidTurn)?;
        require!(round.status == RoundStatus::Active, ErrorCode::RoundNotActive);

        let player_index = round.players.iter().position(|&p| p == ctx.accounts.player.key())
            .ok_or(ErrorCode::PlayerNotInRound)?;

        // Check that the player is not paying for their own turn
        require!(player_index as u8 != recipient_index as u8, ErrorCode::CannotPayOwnTurn);

        require!((round.paid_turns[player_index] & (1 << recipient_index)) == 0, ErrorCode::TurnAlreadyPaid);

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

        round.turn_accumulations[recipient_index as usize] += round.payment_amount;
        round.paid_turns[player_index] |= 1 << recipient_index;

        // Check if all turns are completed
        if round.turn_accumulations.iter().all(|&amount| amount == round.payment_amount * (round.number_of_players as u64 - 1)) {
            round.status = RoundStatus::Completed;
            round.end_timestamp = Clock::get()?.unix_timestamp;
        }

        Ok(())
    }

    pub fn withdraw_turn(ctx: Context<WithdrawTurn>) -> Result<()> {
        let round = &ctx.accounts.round;
        require!(round.status == RoundStatus::Active || round.status == RoundStatus::Completed, ErrorCode::RoundNotActive);

        let player_index = round.players.iter().position(|&p| p == ctx.accounts.player.key())
            .ok_or(ErrorCode::PlayerNotInRound)?;

        // let turn = player_index as u8;
        require!((player_index as u8) < round.number_of_players, ErrorCode::InvalidTurn);

        // Check if the turn has already been withdrawn
        require!(!round.withdrawn_turns[player_index as usize], ErrorCode::TurnAlreadyWithdrawn);

        let expected_amount = round.payment_amount * ((round.players.len() as u64) - 1);
        require!(round.turn_accumulations[player_index as usize] == expected_amount, ErrorCode::InsufficientFunds);

        let transfer_amount = expected_amount;
        let round_seeds = &[
            b"round",
            round.round_id.as_bytes(),
            &[ctx.bumps.round]
        ];

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
        round.withdrawn_turns[player_index] = true;

        msg!("Player {} withdrew {} tokens for turn {}", ctx.accounts.player.key(), transfer_amount, player_index);

        Ok(())
    }

    pub fn withdraw_collateral(ctx: Context<WithdrawCollateral>) -> Result<()> {
        let round = &ctx.accounts.round;
        require!(round.status == RoundStatus::Completed, ErrorCode::RoundNotCompleted);

        let player_index = round.players.iter().position(|&p| p == ctx.accounts.player.key())
            .ok_or(ErrorCode::PlayerNotInRound)?;

        require!(!round.withdrawn_collateral[player_index], ErrorCode::CollateralAlreadyWithdrawn);

        let withdraw_amount = round.payment_amount * (round.number_of_players as u64);

        let round_seeds = &[
            b"round",
            round.round_id.as_bytes(),
            &[ctx.bumps.round]
        ];

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
            withdraw_amount,
        )?;

        let round = &mut ctx.accounts.round;
        round.withdrawn_collateral[player_index] = true;

        msg!("Player {} withdrew collateral of {} tokens", ctx.accounts.player.key(), withdraw_amount);

        Ok(())
    }

    pub fn withdraw_interest(ctx: Context<WithdrawInterest>) -> Result<()> {
        let round = &ctx.accounts.round;
        require!(round.status == RoundStatus::Completed, ErrorCode::RoundNotCompleted);

        let player_index = round.players.iter().position(|&p| p == ctx.accounts.player.key())
            .ok_or(ErrorCode::PlayerNotInRound)?;

        require!(!round.withdrawn_interest[player_index], ErrorCode::InterestAlreadyWithdrawn);

        let position = round.positions[player_index] as f64;
        let apy = 0.12;
        let seconds_per_day = 86400;
        let seconds_per_year = seconds_per_day * 365;
        let seconds_played = round.start_timestamp.max(round.end_timestamp) - round.start_timestamp;
        let calc_interest = seconds_played as f64 / seconds_per_year as f64;
        let base_interest_of_round = round.total_amount_locked as f64 * (apy/2.0) * calc_interest as f64;
        let base_interest_of_player = base_interest_of_round / round.number_of_players as f64;
        let number_of_positions = (round.number_of_players as f64 * (round.number_of_players as f64 - 1.0)) / 2.0;
        let variable_interest_of_player = base_interest_of_round * (position / number_of_positions);
        let interest_amount = base_interest_of_player + variable_interest_of_player;

        let round_seeds = &[
            b"round",
            round.round_id.as_bytes(),
            &[ctx.bumps.round]
        ];

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
            interest_amount as u64,
        )?;

        let round = &mut ctx.accounts.round;
        round.withdrawn_interest[player_index] = true;

        msg!("Player {} withdrew interest of {} tokens", ctx.accounts.player.key(), interest_amount);

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
    pub total_amount_locked: u64,
    pub available_slots: u8,
    pub frequency_of_turns: i64,
    pub status: RoundStatus,
    pub withdrawn_collateral: Vec<bool>,
    pub turn_accumulations: Vec<u64>,
    pub paid_turns: Vec<u64>,
    pub withdrawn_turns: Vec<bool>,
    pub positions: Vec<u8>,
    pub withdrawn_interest: Vec<bool>,
    pub start_timestamp: i64,
    pub end_timestamp: i64,
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
                8 + // total_amount_locked
                1 + // available_slots
                8 + // frequency_of_turns
                1 + // status
                50 + // withdrawn_collateral (assuming max 50 players)
                (8 * 50) + // turn_accumulations (assuming max 50 players)
                (8 * 50) + // paid_turns (assuming max 50 players)
                50 + // withdrawn_turns (assuming max 50 players)
                50 + // position (assuming max 50 players)
                50 + // withdrawn_interest (assuming max 50 players)
                8 + // start_timestamp
                8 + // end_timestamp
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

#[derive(Accounts)]
pub struct WithdrawCollateral<'info> {
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

#[derive(Accounts)]
pub struct WithdrawInterest<'info> {
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
    TurnAlreadyPaid,
    #[msg("The round is not completed")]
    RoundNotCompleted,
    #[msg("Player is not part of this round")]
    PlayerNotInRound,
    #[msg("Invalid turn")]
    InvalidTurn,
    #[msg("Turn has already been withdrawn")]
    TurnAlreadyWithdrawn,
    #[msg("Collateral has already been withdrawn")]
    CollateralAlreadyWithdrawn,
    #[msg("Players cannot pay for their own turn")]
    CannotPayOwnTurn,
    #[msg("Interest has already been withdrawn")]
    InterestAlreadyWithdrawn,
}
