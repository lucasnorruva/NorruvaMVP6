import { ethers, upgrades } from "hardhat";

async function main() {
  const NORUToken = await ethers.getContractFactory("NORUToken");
  const noruToken = await upgrades.deployProxy(
    NORUToken,
    ["NORU Governance Token", "NORU"],
    {
      initializer: "initialize",
    },
  );

  await noruToken.waitForDeployment();

  console.log("NORUToken deployed to:", await noruToken.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
