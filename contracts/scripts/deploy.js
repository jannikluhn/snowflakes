const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const gasPrice = 35 * 1000000000
  console.log("Deployer address:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
  console.log("Gas price:", gasPrice)

  console.log("\ndeploying snowflake contract")
  const Snowflake = await hre.ethers.getContractFactory("Snowflake");
  const snowflake = await Snowflake.deploy({gasPrice: gasPrice});
  console.log("tx hash:", snowflake.deployTransaction.hash)
  console.log("gas:", snowflake.deployTransaction.gasLimit.toString())
  await snowflake.deployTransaction.wait()
  console.log("Snowflake deployed to:", snowflake.address);

  console.log("\ndeploying water contract")
  const Water = await hre.ethers.getContractFactory("Water");
  const water = await Water.deploy({gasPrice: gasPrice})
  console.log("tx hash:", water.deployTransaction.hash)
  console.log("gas:", water.deployTransaction.gasLimit.toString())
  await water.deployTransaction.wait({gasPrice: gasPrice})
  console.log("Water deployed to:", water.address)

  console.log("\nsetting water address")
  await snowflake.setWater(water.address, {gasPrice: gasPrice})
  console.log("Water address set to:", await snowflake.meltWater())

  console.log("\ntransferring ownership")
  await water.transferOwnership(snowflake.address, {gasPrice: gasPrice})
  console.log("Water owner set to:", await water.owner())
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
