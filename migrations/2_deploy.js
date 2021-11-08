// migrations/2_deploy.js
const LuckyDrawController = artifacts.require('LuckyDrawController');

module.exports = async function (deployer) {
  await deployer.deploy(LuckyDrawController);
};