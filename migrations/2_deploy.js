// migrations/2_deploy.js

const fs = require('fs');

const LuckyDrawController = artifacts.require('LuckyDrawController');

module.exports = async function (deployer, network, accounts) {

  await deployer.deploy(LuckyDrawController);
  let deployed = await LuckyDrawController.deployed();
  fs.writeFileSync('./build/contracts/LuckyDrawController.address', JSON.stringify(deployed.address));  

  const contract = JSON.parse(fs.readFileSync('./build/contracts/LuckyDrawController.json', 'utf8'));
  fs.writeFileSync('./build/contracts/LuckyDrawController.abi', JSON.stringify(contract.abi));

  if (network == "development") {
    js = "const developmentAddress = " + JSON.stringify(deployed.address) + ";\n";
    js += "const developmentABI = " + JSON.stringify(contract.abi) + ";\n";
    fs.writeFileSync('./client/development.js', js);
  }
  console.log("LuckyDrawController deployed at " + deployed.address);
};