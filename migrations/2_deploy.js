// migrations/2_deploy.js

//require('dotenv').config()

const fs = require('fs');

const LuckyDrawController = artifacts.require('LuckyDrawController');

module.exports = async function (deployer, network, accounts) {

  await deployer.deploy(LuckyDrawController);
  let deployed = await LuckyDrawController.deployed();
  fs.writeFileSync('./build/contracts/LuckyDrawController.address', JSON.stringify(deployed.address));  

  const contract = JSON.parse(fs.readFileSync('./build/contracts/LuckyDrawController.json', 'utf8'));
  fs.writeFileSync('./build/contracts/LuckyDrawController.abi', JSON.stringify(contract.abi));

  js = "const developmentAddress = " + JSON.stringify(deployed.address) + ";\n";
  js += "const developmentABI = " + JSON.stringify(contract.abi) + ";\n";

  if (network == "development") {
    js = "const developmentAddress = " + JSON.stringify(deployed.address) + ";\n";
    js += "const developmentABI = " + JSON.stringify(contract.abi) + ";\n";  
    fs.writeFileSync('./client/development.js', js);
  } else if (network == "ropsten") {
    js = "const ropstenAddress = " + JSON.stringify(deployed.address) + ";\n";
    js += "const ropstenABI = " + JSON.stringify(contract.abi) + ";\n";      
    fs.writeFileSync('./client/ropsten.js', js);

    fs.writeFileSync('./deployed_address.txt', deployed.address);
  }

  console.log("LuckyDrawController deployed at " + deployed.address);
};