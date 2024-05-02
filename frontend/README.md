# Frontend for Kryptona DAO

Welcome to the frontend repository for Kryptona, a decentralized autonomous organization (DAO) focused on artificial intelligence (AI) development and governance. This repository contains the React-based user interface that interacts with the Kryptona smart contracts and blockchain backend.

## Getting Started

### Prerequisites

Before you start, ensure you have the following installed:
- Node.js (v14.x or later)
- npm (v6.x or later)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

This will run the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will reload if you make edits. You will also see any lint errors in the console.

## Repository Structure

The structure of the frontend repository is outlined below:

```
├── .gitignore                         <- Specifies intentionally untracked files to ignore.
├── package-lock.json                  <- Automatically generated file for any operations where npm modifies the node_modules tree.
├── package.json                       <- Lists the project dependencies and other metadata.
├── README.md                          <- Describes the project and provides setup instructions.
├── node_modules                       <- Directory for npm packages.
├── public                             <- Public assets and HTML files.
├── src                                <- Source files for the frontend application.
│   ├── components                     <- Reusable React components.
│   ├── contracts                      <- ABI files and contract addresses for blockchain interactions.
│   ├── pages                          <- React components representing pages.
│   │   ├── Apply.css                  <- Styles for the membership application page.
│   │   ├── Apply.js                   <- Implements membership application functionality.
│   │   ├── Explore.css                <- Styles for the DAO exploration page.
│   │   ├── Explore.js                 <- Allows users to explore child DAOs.
│   │   ├── Help.css                   <- Styles for the help page.
│   │   ├── Help.js                    <- Provides help functions for testing.
│   │   ├── Home.css                   <- Styles for the homepage.
│   │   ├── Home.js                    <- Describes the Kryptona DAO structure on the homepage.
│   │   ├── OrchestratorDemoDAO.css    <- Styles for the child DAO demo page.
│   │   ├── OrchestratorDemoDAO.js     <- Implements functionality for the child DAO demo.
│   │   ├── Propose.css                <- Styles for the proposal creation page.
│   │   ├── Propose.js                 <- Allows users to create proposals for Kryptona DAO.
│   │   ├── Vote.css                   <- Styles for the voting page.
│   │   └── Vote.js                    <- Handles voting on Kryptona DAO proposals.
│   ├── App.css                        <- Global styles for the application.
│   ├── Index.js                       <- Entry point for the React application.
│   ├── Banner.js                      <- Component for displaying the banner.
│   └── WalletContext.js               <- Context for managing wallet connections.
```

## Contributing

We welcome contributions to the Kryptona frontend! Please read our contributing guidelines and submit pull requests to our repository.

## Troubleshooting

If you encounter any issues while setting up or running the frontend, please check the following:
- Ensure all dependencies are installed correctly.
- Verify that the blockchain backend is running and accessible.
- Check the console for any errors or warnings that might indicate what went wrong.

## Contact Us

If you need further assistance or have any inquiries, feel free to reach out to our development team at:
- [Christian Hollar](mailto:christian.hollar@duke.edu)
- [Yibo Liu](mailto:yibo.liu@duke.edu)
