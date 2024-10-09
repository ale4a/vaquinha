# Protocol Vaquinha

![Texto alternativo](/vaquina.png)

Protocol Vaquinha is a community savings protocol inspired by the traditional Andean savings system known as Pasanaku. This protocol leverages blockchain technology to solve trust issues, allowing users to organize and participate in group savings systems with complete transparency and security. Vaquinha Protocol scales these traditional systems to the digital world, providing global access to communities that need reliable shared savings solutions.

You can view the demo (under construction) [vaquinha-seven.vercel.app.com](https://vaquinha-seven.vercel.app/groups?tab=usdt)

This project is generated with the [create-solana-dapp](https://vaquinha-seven.vercel.app/) generator.

## Useful links:

1. Description: Vaquita is a protocol for rotating savings based on informal and traditional savings systems used in various countries, including Bolivia (Pasanaku), Argentina (Vaquita), Peru (Junta), and others. [Pitch Deck](https://www.canva.com/design/DAGTBA2Xyd0/dPTy43Ze_Q4nlW3oXM7yjA/edit?utm_content=DAGTBA2Xyd0&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

2. In this folder, you will find videos showcasing the functionality of our project. These videos provide an overview of key features and demonstrate how the project operates in practice. [Drive](https://drive.google.com/drive/folders/1LzhAUhjTEN72tB0uCMhH9dTVydrg0A7C)

3. Soon, we will share more detailed information about the functionality of our project here. In the meantime, you can follow us on Twitter to stay updated with the latest news. [@VaquitaProtocol](https://x.com/VaquitaProtocol)


## Getting Started

### Prerequisites

- Node v18.18.0 or higher

- Rust v1.77.2 or higher
- Anchor CLI 0.30.1 or higher
- Solana CLI 1.18.17 or higher

### Installation

#### Clone the repo

```shell
git clone <repo-url>
cd <repo-name>
```

#### Install Dependencies

```shell
npm install
```

#### Start the web app

```
npm run dev
```

## Apps

### anchor

This is a Solana program written in Rust using the Anchor framework.

#### Commands

You can use any normal anchor commands. Either move to the `anchor` directory and run the `anchor` command or prefix the command with `npm run`, eg: `npm run anchor`.

#### Sync the program id:

Running this command will create a new keypair in the `anchor/target/deploy` directory and save the address to the Anchor config file and update the `declare_id!` macro in the `./src/lib.rs` file of the program.

You will manually need to update the constant in `anchor/lib/counter-exports.ts` to match the new program id.

```shell
npm run anchor keys sync
```

#### Build the program:

```shell
npm run anchor-build
```

#### Start the test validator with the program deployed:

```shell
npm run anchor-localnet
```

#### Run the tests

```shell
npm run anchor-test
```

#### Deploy to Devnet

```shell
npm run anchor deploy --provider.cluster devnet
```

### web

This is a React app that uses the Anchor generated client to interact with the Solana program.

#### Commands

Start the web app

```shell
npm run dev
```

Build the web app

```shell
npm run build
```

Test round initialization

```shell
npm run play
```