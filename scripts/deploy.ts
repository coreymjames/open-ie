import { ethers } from "hardhat";
import path from "path";
import fs from "fs";
import hre from 'hardhat'
import { OpenIE } from "../typechain-types";

async function main() {
  // if (hre.network.name === "hardhat") {
  //   console.warn(
  //     "You are trying to deploy a contract to the Hardhat Network, which" +
  //       "gets automatically created and destroyed every time. Use the Hardhat" +
  //       " option '--network localhost'"
  //   );
  // }

  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.provider.getBalance(await deployer.getAddress())).toString());

  const OpenIE = await ethers.getContractFactory("OpenIE");
  const openIE = await OpenIE.deploy();
  await openIE.waitForDeployment();

  console.log("Token address:", await openIE.getAddress());

  await openIE.add_project('cid1');
  console.log('projects: ', await openIE.get_projects());


  // We also save the contract's artifacts and address in the frontend directory
  await saveFrontendFiles(openIE);
}

async function saveFrontendFiles(token: OpenIE) {
  const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ Token: await token.getAddress() }, undefined, 2)
  );

  const TokenArtifact = hre.artifacts.readArtifactSync("OpenIE");

  fs.writeFileSync(
    path.join(contractsDir, "OpenIE.json"),
    JSON.stringify(TokenArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
