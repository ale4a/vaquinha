#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("7a1h4J18HkFYM98bHXAG7U2uejztW4HnCnHbH5DbgQwY");

#[program]
pub mod vaquinha {
    use super::*;

  pub fn close(_ctx: Context<CloseVaquinha>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.vaquinha.count = ctx.accounts.vaquinha.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.vaquinha.count = ctx.accounts.vaquinha.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeVaquinha>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.vaquinha.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeVaquinha<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Vaquinha::INIT_SPACE,
  payer = payer
  )]
  pub vaquinha: Account<'info, Vaquinha>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseVaquinha<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub vaquinha: Account<'info, Vaquinha>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub vaquinha: Account<'info, Vaquinha>,
}

#[account]
#[derive(InitSpace)]
pub struct Vaquinha {
  count: u8,
}
