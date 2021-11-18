// migrations/2_deploy.js

const fs = require('fs');

const LuckyDrawController = artifacts.require('LuckyDrawController');

module.exports = async function (deployer) {
  await deployer.deploy(LuckyDrawController);
  let deployed = await LuckyDrawController.deployed();
  fs.writeFileSync('./build/contracts/LuckyDrawController.address', JSON.stringify(deployed.address));  

  const contract = JSON.parse(fs.readFileSync('./build/contracts/LuckyDrawController.json', 'utf8'));
  fs.writeFileSync('./build/contracts/LuckyDrawController.abi', JSON.stringify(contract.abi));

  js = "const ldcAddress = " + JSON.stringify(deployed.address) + ";\n";
  js += "const ldcABI = " + JSON.stringify(contract.abi) + ";\n";
  fs.writeFileSync('./client/LuckyDrawController.js', js);
  console.log("LuckyDrawController deployed at " + deployed.address);
};