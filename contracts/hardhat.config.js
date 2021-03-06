require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.7.3",
    settings: {
      optimizer: {
        enabled: true,
        runs: 100,
      },
    },
  },
  networks: {
    goerli: {
      url: "https://goerli.infura.io/v3/e802ad1893784509abeb7d885e24cba4",
      // accounts: [""],
    },
    mainnet: {
      url: "https://mainnet.infura.io/v3/e802ad1893784509abeb7d885e24cba4",
      // accounts: [""],
    },
  }
};

