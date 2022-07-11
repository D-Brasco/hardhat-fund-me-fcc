// async function deployFunc(hre) {
//  console.log("Hi!");
// }
// module.exports.default = deployFunc;

//module.exports = async(hre) => {
// const { getNamedAccounts, deployments } = hre;
//}

// const helperConfig = require("../helper-hardhat-config");
// const networkConfig = helperConfig.networkConfig;
const {
    networkConfig,
    developmentChains,
} = require("../helper-hardhat-config");
const { network } = require("hardhat");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log, get } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    // if chainId is X use address Y
    // if chainId is Z use address A
    let ethUsdPriceFeedAddress;
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await get("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    }

    // if the contract doesn't exist, we deploy a minimal version of
    // for our local testing

    // when going for a localhost or hardhat network we want to use a mock
    const args = [ethUsdPriceFeedAddress];
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args,
        log: true, // put price feed address
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    // verify if not on hardhat/localhost
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, args);
    }
    log("-----------------------------------------------------------");
};
module.exports.tags = ["all", "fundme"];
