import React from 'react';
import './Home.css'; // Assuming your CSS rules are defined in this file

const Home = () => {
    return (
        <div className="home">
            <header className="header">
                <h1>Welcome to Kryptona</h1>
            </header>
            <nav className="navigation">
                <ul>
                    <li><a href="#kryptona">Kryptona</a></li>
                    <li><a href="#treasury">Treasury</a></li>
                    <li><a href="#roles">Roles</a></li>
                    <li><a href="#artifacts">Artifacts</a></li>
                    <li><a href="#subsidiary">Subsidiary</a></li>
                    <li><a href="#orchestrator">Orchestrator</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </nav>
            <section id="kryptona" className="home-content">
                <h2>What is Kryptona?</h2>
                <p>
                    Kryptona is a decentralized autonomous organization (DAO) that serves as a platform for the development of 
                    artificial intelligence models and agents. The organization is responsible for the development of smart contracts 
                    required to tokenize artificial intelligence artifacts and facilitate the transactions of them.                 
                </p>
                <p>
                    As the parent DAO, Kryptona provides the template of smart contracts so that users can develop child DAO’s to 
                    meet their unique needs. Kryptona also serves as the governing entity to oversee the child DAO’s. Its functionality includes 
                    recognizing ownership of artifacts, facilitating and validating transactions of digital assets and their derivatives, and 
                    coordinating collaborations between subsidiary DAOs.
                </p>
            </section>
            <section id="treasury" className="home-content">
                <h2>Treasury</h2>
                <p>
                    Kryptona supports purchasing tokens with USDC, the exchange rate will be determined dynamically. By contributing AI artifacts to 
                    the DAO’s, the contributors will also receive a certain number of tokens. 
                    If their artifacts are transacted, then they will also receive the tokens as their income.      
                </p>
                <p>
                    Funds can be withdrawn from the Kryptona Treasury through two methods. Firstly, a Kryptona member may opt to burn Kryptona governance 
                    tokens to receive a corresponding percentage of each asset in the Kryptona Treasury. The share of each asset acquired is proportional 
                    to the quantity of tokens burned in relation to the total tokens in circulation at the time of burning, offering a financial incentive 
                    to participants within the Kryptona ecosystem. Secondly, the creation of a withdrawal proposal allows for the transfer of funds to a new 
                    wallet address. The process for withdrawal proposals is detailed further in the governance section.
                </p>
            </section>
            <section id="roles" className="home-content">
                <h2>Roles</h2>
                <p>
                    Within the parent DAO, there are two roles: members and proposers: 
                </p>
                <ul>
                    <li>
                        <strong>Members: </strong>Any wallet that holds the governance token Kryptona. Holding the governance token allows the members to vote on proposals. 
                        The amount of voting power is correlated with the amount of governance tokens held by the member wallet address. To ensure decentralization, 
                        the governance token will be readily available via purchase by fiat currency or swap with another digital asset through both centralized and 
                        decentralized exchanges.
                    </li>
                    <li>
                        <strong>Proposers: </strong>Able to make proposals. Everyone is able to make ideas, but only proposers can formalize them as proposals. If a member frequently makes
                        valuable ideas, they may be nominated for promotion to a proposer through a status proposal. Alternatively, if a proposer is not effectively collaborating 
                        or is making unconstructive proposals, a proposal can be made to demote them to a member role.
                    </li>
                </ul>
            </section>
            <section id="subsidiary" className="home-content">
                <h2>Subsidiary DAO Structure</h2>
                <p>
                    There will be different types of subsidiary DAOs, and each type of subsidiary DAO will have its own role structure. The base subsidiary DAO will have the same structure
                    as Kryptona where there are two roles: members and proposers. The primary difference is the governance token of a subsidiary DAO does not need to be transferable or readily
                    available. 
                </p>
                <p>
                    Subsidiary DAOs will maintain ownership of artificial intelligence (AI) artifacts, dictating their visibility and interaction permissions. Visibility and interaction permissions are 
                    analogous to the read and execute permissions of ACL’s (we leave out the write permission because NFT’s are immutable). Visibility permission determines who can see the contents, and 
                    interaction permission determines who can utilize the artifact and under what agreement. 
                </p>
                <p>
                    The ownership of artifacts enables the owner subsidiary DAO to charge for the usage. This is the primary incentive for participation. 
                </p>
            </section>
            <section id="artifacts" className="home-content">
                <h2>Artificial Intelligence Artifacts</h2>
                <p>Artificial intelligence artifacts are essential tools in AI development, categorized into four types:</p>
                <ul>
                    <li><strong>Data:</strong> The input needed for training and evaluating models. It can be numbers, texts, images or audios. </li>
                    <li><strong>Architecture:</strong> They can be any kind of components that make up models or agents. Broadly speaking, it can be any data
                     processing functions, such as data cleaning functions, model activation functions or output forwarding functions.</li>
                    <li><strong>Models:</strong> Operational units of AI. They are entities performing predictions and generating text / image responses. 
                    Users can also use them to train or fine tune for their own weights.</li>
                    <li><strong>Agents:</strong> Incorporate additional logic to make them able to interact with users. For example,
                     LLM agents can serve in the same way as ChatGPT</li>
                </ul>
            </section>
            <section id="orchestrator" className="home-content">
                <h2>Orchestrator</h2>
                <p>
                    The role of the Kryptona Orchestrator is coordinating the process of different computer programs. Orchestrator is Kryptona’s foundation of providing computing services to DAO members. 
                    The computing service here includes a variety of activities, such as model training, inferencing, agents building and deploying. Orchestrator makes Kryptona different from digital asset trading 
                    platforms because users are able to use the AI artifacts they purchase or rent. 
                </p>
                <p>
                    When a designer submits a proposal of workflow, the orchestrator regards the workflow as a data processing pipeline which defines the flow path of data. The orchestrator is responsible for executing 
                    the process of data flow. For example, if a designer proposes to deploy an AI agent, the orchestrator is responsible for joining up the components like auxiliary programs consuming users’ input, forwarding 
                    the inputs to the AI model, and exporting the outputs to a designated location.
                </p>
            </section>
            <section id="contact" className="home-content">
                <h2>Contact Us</h2>
                <p>
                    Christian Hollar (christian.hollar@duke.edu)
                </p>
                <p>
                    Yibo Liu (yibo.liu@duke.edu)
                </p>
            </section>
            <footer className="footer">
                <p>&copy; {new Date().getFullYear()} Kryptona DAO. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
