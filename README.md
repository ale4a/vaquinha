# Protocol Vaquita

![Texto alternativo](/vaquina.png)

Protocol Vaquita is a community savings protocol inspired by the traditional Andean savings system known as Pasanaku. This protocol leverages blockchain technology to solve trust issues, allowing users to organize and participate in group savings systems with complete transparency and security. Vaquita Protocol scales these traditional systems to the digital world, providing global access to communities that need reliable shared savings solutions.

## 🌐 Resources

- 🚀 **Demo:** Check out the live demo of the project [here](https://vaquinha-seven.vercel.app/groups)
- 🎥 **Pitch Deck:** This is the pitch deck for the project, providing a concise overview of its key elements. It helps to understand the problem, solution, business model, and overall impact more clearly. [Watch the Pitch Deck](https://www.loom.com/share/7a54b3ddaea740f597c0d814a34cd45a?sid=ace57d15-6671-4d06-9139-15d29a708d1b)
- 💻 **Devnet Program ID:** `qjRm9YEVnGNoY2vCn4LsroiYixVnkn4Fwrta2qgxa1f` — View the [Vaquita Program](https://explorer.solana.com/address/qjRm9YEVnGNoY2vCn4LsroiYixVnkn4Fwrta2qgxa1f?cluster=devnet) on Solana Explorer.

  **Methods:**

  - 🏁 `initializeRound`: Creates a new Round and adds collateral.
  - 🙋‍♂️ `addPlayer`: Adds a player to the round and their collateral.
  - 💰 `payTurn`: Pays the current turn in the round.

- 📁 **Additional Resources:** Access more resources in the [Google Drive folder](https://drive.google.com/drive/folders/1LzhAUhjTEN72tB0uCMhH9dTVydrg0A7C)

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
