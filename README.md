# Krytona 

## Overview
### Introduction

In the rapidly evolving field of blockchain technology and artificial intelligence, Kryptona stands out as a groundbreaking decentralized autonomous organization (DAO). Designed to harness the collective power of AI development, Kryptona enables innovative governance structures and a robust platform for AI model transaction and development. This project aims not only to showcase the technical capabilities of integrating AI with blockchain but also to explore new paradigms of decentralized collaboration.

### Welcome to Kryptona

Kryptona is a decentralized autonomous organization (DAO) that facilitates the development, tokenization, and transaction of artificial intelligence (AI) models and agents.

### What is Kryptona?

Kryptona serves as a platform for developing and governing subsidiary DAOs, each tailored for specific AI functions. As the parent DAO, it provides smart contract templates, governs child DAOs, and manages the ownership and transactions of AI artifacts.

### Treasury

The Kryptona Treasury supports transactions using USDC. Contributors of AI artifacts to the DAO receive tokens as both contribution rewards and transaction income. Treasury funds can be accessed either by burning governance tokens for a proportional share of each asset or through withdrawal proposals to transfer funds to a new wallet.

### Roles

- **Members**: Holders of Kryptona governance tokens, entitled to vote on proposals. The voting power correlates with the number of tokens held.
- **Proposers**: Individuals who can formalize ideas into proposals. Members can be promoted to proposers through a status proposal, reflecting their contribution of valuable ideas.

### Subsidiary DAO Structure

Subsidiary DAOs operate under similar role structures as Kryptona but manage their own specific AI artifacts, which dictate visibility and interaction permissions. These DAOs can monetize the use of their AI artifacts, incentivizing participation.

### Artificial Intelligence Artifacts

AI artifacts are categorized into:
- **Data**: Inputs for training and evaluating models.
- **Architecture**: Components of models or agents, including data processing functions.
- **Models**: Operational units for predictions and generating responses.
- **Agents**: Enhanced with logic to interact with users, similar to LLM agents like ChatGPT.

### Orchestrator

The Orchestrator coordinates computing services for DAO members, such as model training and AI agent deployment. It manages data processing pipelines proposed by designers, ensuring seamless execution of data flows.

### Contact Us

For more information or inquiries, contact:
- Christian Hollar (christian.hollar@duke.edu)
- Yibo Liu (yibo.liu@duke.edu)

## How to Set Up Project on Localhost

### Initial Setup
1. Install project dependencies:
   ```bash
   npm install
   ```
2. Start the Hardhat local development node:
   ```bash
   npx hardhat node
   ```
3. Run the setup script on localhost:
   ```bash
   npx hardhat run scripts/setup.py --network localhost
   ```

### Start the Frontend
Open a new terminal window, navigate to the frontend directory, and start the frontend server:
   ```bash
   cd ./frontend
   npm run start
   ```

### How to Use the Faucet
To use the faucet script to get test tokens:
```bash
npx hardhat --network localhost faucet <walletaddress>
```

## Hardhat Tips

### Starting Local Node
To start a local Hardhat node:
```bash
npx hardhat node
```

### Running Hardhat Tests

#### Run an individual test:
Specify the test file to run:
```bash
npx hardhat test tests/<name_of_test>.js
```

#### Run all tests:
Execute all test files:
```bash
npx hardhat test
```

### Running Tasks
To execute a specific Hardhat task on localhost:
```bash
npx hardhat --network localhost <name_of_task>
```

### Running Hardhat Scripts
To run a specific Hardhat script:
```bash
npx hardhat run scripts/<name_of_script>.js
```

## Hardhat Respository Structure
```
├── README.md                                <- Description of the project and how to set up and run it.
├── .gitattributes                           <- Git attributes file.
├── .gitignore                               <- Git ignore file.
├── hardhat.config.js                        <- Configuration file for Hardhat.
├── LICENSE                                  <- License file for the project.
├── package-lock.json                        <- Lock file for npm dependencies.
├── package.json                             <- NPM package file.
├── artifacts                                <- Directory for build artifacts.
│   ├── @openzeppelin/contracts              <- OpenZeppelin contracts used for secure smart contract development.
│   ├── build-info                           <- Contains metadata about the build process.
│   ├── contracts                            <- Compiled contract files.
│   └── hardhat                              <- Hardhat specific build files.
├── contracts                                <- Directory for smart contracts.
│   ├── DAOKryptona.sol                      <- Main DAO contract for Kryptona.
│   ├── DAOKryptonaChild.sol                 <- Contract for child DAOs within the Kryptona ecosystem.
│   ├── DAOKryptonaChildTreasury.sol         <- Treasury contract for child DAOs.
│   ├── DAOKryptonaTreasury.sol              <- Treasury contract for the main Kryptona DAO.
│   ├── Kryptona.sol                         <- ERC20 token contract for Kryptona.
│   ├── Model.sol                            <- AI model stored as an ERC721 token.
│   ├── ProposalAbstract.sol                 <- Abstract contract for proposals.
│   ├── ProposalBase.sol                     <- Base contract for handling proposals.
│   ├── ProposalKryptonaChildMember.sol      <- Proposal for adding new members to child DAOs.
│   ├── ProposalKryptonaChildModel.sol       <- Proposal for deploying new AI artifacts in child DAOs.
│   ├── ProposalKryptonaChildTreasury.sol    <- Proposal for treasury withdrawals in child DAOs.
│   ├── ProposalKryptonaMember.sol           <- Proposal for adding new members to the Kryptona DAO.
│   └── ProposalKryptonaTreasury.sol         <- Proposal for treasury withdrawals in the Kryptona DAO.
├── ipfs                                     <- Directory for IPFS files.
├── models                                   <- Directory for machine learning models.
├── node_modules                             <- Directory for npm packages.
├── scripts                                  <- Directory for deployment and interaction scripts.
│   ├── deploy_daokryptona.js                <- Deploys the Kryptona DAO.
│   ├── deploy_daokryptonatreasury.js        <- Deploys the Kryptona DAO Treasury.
│   ├── deploy_kryptona.js                   <- Deploys the Kryptona token.
│   ├── deploy_proposalkryptonamember.js     <- Deploys the Kryptona member proposal contract.
│   ├── evmAdvanceTimeWeek.js                <- Advances the EVM time by one week.
│   ├── setup.js                             <- Runs all deploy scripts and advances time a week.
│   └── utilities.js                         <- Utility scripts.
├── tasks                                    <- Directory for Hardhat tasks.
│   └── faucet.js                            <- Kryptona token faucet.
├── test                                     <- Directory for Hardhat tests.
└── tokenURI                                 <- Directory for token URI data.
```

## Frontend Repository Structure
```
├── frontend                               <- Directory for frontend code.
│   ├── .gitignore                         <- Specifies intentionally untracked files to ignore.
│   ├── package-lock.json                  <- Automatically generated file for any operations where npm modifies the node_modules tree.
│   ├── package.json                       <- Lists the project dependencies and other metadata.
│   ├── README.md                          <- Describes the project and provides setup instructions.
│   ├── node_modules                       <- Directory for npm packages.
│   ├── public                             <- Public assets and HTML files.
│   ├── src                                <- Source files for the frontend application.
│   │   ├── components                     <- Reusable React components.
│   │   ├── contracts                      <- ABI files and contract addresses for blockchain interactions.
│   │   ├── pages                          <- React components representing pages.
│   │   │   ├── Apply.css                  <- Styles for the membership application page.
│   │   │   ├── Apply.js                   <- Implements membership application functionality.
│   │   │   ├── Explore.css                <- Styles for the DAO exploration page.
│   │   │   ├── Explore.js                 <- Allows users to explore child DAOs.
│   │   │   ├── Help.css                   <- Styles for the help page.
│   │   │   ├── Help.js                    <- Provides help functions for testing.
│   │   │   ├── Home.css                   <- Styles for the homepage.
│   │   │   ├── Home.js                    <- Describes the Kryptona DAO structure on the homepage.
│   │   │   ├── OrchestratorDemoDAO.css    <- Styles for the child DAO demo page.
│   │   │   ├── OrchestratorDemoDAO.js     <- Implements functionality for the child DAO demo.
│   │   │   ├── Propose.css                <- Styles for the proposal creation page.
│   │   │   ├── Propose.js                 <- Allows users to create proposals for Kryptona DAO.
│   │   │   ├── Vote.css                   <- Styles for the voting page.
│   │   │   └── Vote.js                    <- Handles voting on Kryptona DAO proposals.
│   │   ├── App.css                        <- Global styles for the application.
│   │   ├── Index.js                       <- Entry point for the React application.
│   │   ├── Banner.js                      <- Component for displaying the banner.
│   │   └── WalletContext.js               <- Context for managing wallet connections.
```