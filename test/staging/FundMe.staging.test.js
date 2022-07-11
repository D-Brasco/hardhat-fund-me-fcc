const { assert } = require("chai");
const { network, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

// let variable = true
// let someVar = variable ? "yes" : "no"
// if (variable) {someVar = "yes"} else {someVar ="no"}
developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe Staging Tests", async function () {
          let fundMe;
          let deployer;
          const sendValue = ethers.utils.parseEther("0.1");
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer;
              fundMe = await ethers.getContract("FundMe", deployer);
          });

          it("allows people to fund and withdraw", async function () {
              await fundMe.fund({ value: sendValue });
              const transactionResponse = await fundMe.withdraw({
                  gasLimit: 100000,
              });
              await transactionResponse.wait(1);

              const endingBalance = await fundMe.provider.getBalance(
                  fundMe.address
              );
              assert.equal(endingBalance.toString(), "0");
          });
      });
