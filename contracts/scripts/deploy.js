const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Snowflake = await hre.ethers.getContractFactory("Snowflake");
  const snowflake = await Snowflake.deploy();
  await snowflake.deployTransaction.wait()
  console.log("Snowflake deployed to:", snowflake.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
