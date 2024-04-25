// const Main = artifacts.require("Main");
const FoodChain = artifacts.require("FoodChain");

// module.exports = function (deployer) {
//   deployer.deploy(ConvertLib);
//   deployer.link(ConvertLib, MetaCoin);
//   deployer.deploy(MetaCoin);
// };

module.exports = async function (deployer) {
  await deployer.deploy(FoodChain);
};
