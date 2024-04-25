import Constants from "../Constants";
import Web3 from "web3";
import FOOD_CHAIN_BUILD from "../ABI/FoodChain.json";
const NETWORK_ID = "11155111";

export const web3 = new Web3(window.ethereum);

const GetContract = () => {
  const CONTRACT_ADDRESS = FOOD_CHAIN_BUILD.networks[NETWORK_ID].address;

  const FoodChain = new web3.eth.Contract(
    FOOD_CHAIN_BUILD.abi,
    CONTRACT_ADDRESS
  );
  return { success: true, data: { FoodChain } };
};

export default GetContract;
