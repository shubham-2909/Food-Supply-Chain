import React from "react";
import GetContract, { web3 } from "../utils/GetContract";
import Connect from "../utils/Connect";
import Constants from "../Constants";
import { AuthContext } from "../context/AuthContext";

export const ContractContext = React.createContext();

function ContractContextProvider(props) {
  const { account, updateAuth } = React.useContext(AuthContext);

  const [state, setState] = React.useState({
    FoodChain: null,
  });

  const updateContract = (data) => {
    setState({ ...state, ...data });
  };

  console.log(account, "account");

  const Services = {
    registerManufacturer: async (_name) => {
      try {
        if (!state.FoodChain) return { success: true, data: {} };

        const manufacturerRegistrationResponse = await state.FoodChain.methods
          .addManufacturer(_name)
          .send({
            from: account,
            gas: Constants.GAS,
          });
        return {
          success: true,
          data: { manufacturer: manufacturerRegistrationResponse },
        };
      } catch (err) {
        console.log("Error in registering manufacturer: ", err);
        return { success: false, message: err.message };
      }
    },

    registerRetailer: async (_name) => {
      try {
        if (!state.FoodChain) return { success: true, data: {} };

        const retailerRegistrationResponse = await state.FoodChain.methods
          .addRetailer(_name)
          .send({
            from: account,
            gas: Constants.GAS,
          });

        console.log("retailer Resp", retailerRegistrationResponse);
        return {
          success: true,
          data: {
            retailer:
              retailerRegistrationResponse.events.RetailerRegistered
                .returnValues,
          },
        };
      } catch (err) {
        console.log("Error in registering retailer: ", err);
        return { success: false, message: err.message };
      }
    },

    registerCustomer: async (_name) => {
      try {
        if (!state.FoodChain) return { success: true, data: {} };

        const customerRegistrationResponse = await state.FoodChain.methods
          .addCustomer(_name)
          .send({
            from: account,
            gas: Constants.GAS,
          });
        console.log("registration here", customerRegistrationResponse);
        return {
          success: true,
          data: { customer: customerRegistrationResponse },
        };
      } catch (err) {
        console.log("Error in registering customer: ", err);
        return { success: false, message: err.message };
      }
    },

    getManufacturer: async (_address) => {
      try {
        if (!state.FoodChain) return { success: true, data: {} };

        const manufacturer = await state.FoodChain.methods
          .getManufacturerDetails(_address)
          .call();
        return { success: true, data: { manufacturer } };
      } catch (err) {
        console.log("Error in getting manufacturer: ", err);
        return { success: false, message: err.message };
      }
    },

    getRetailer: async (_address) => {
      try {
        if (!state.FoodChain) return { success: true, data: {} };

        const retailer = await state.FoodChain.methods
          .getRetailerDetails(_address)
          .call();
        console.log("Retailer got", retailer);
        return { success: true, data: { retailer } };
      } catch (err) {
        console.log("Error in getting retailer: ", err);
        return { success: false, message: err.message };
      }
    },

    getCustomer: async (_address) => {
      try {
        if (!state.FoodChain) return { success: true, data: {} };

        const customer = await state.FoodChain.methods
          .getCustomerDetails(_address)
          .call();
        return { success: true, data: { customer } };
      } catch (err) {
        console.log("Error in getting customer: ", err);
        return { success: false, message: err.message };
      }
    },
    getUserType: async (_address) => {
      try {
        if (!state.FoodChain) return { success: true, data: {} };

        const userType = await state.FoodChain.methods
          .getUserType(_address)
          .call();
        return { success: true, data: { type: Constants.ROLE[userType] } };
      } catch (err) {
        console.log("Error in getting user type: ", err);
        return { success: false, message: err.message };
      }
    },
    getManufacturerInventory: async (_address) => {
      try {
        if (!state.FoodChain) return { success: true, data: {} };

        const productIDList = await state.FoodChain.methods
          .getManufacturerInventory(_address)
          .call();

        let products = [];
        for await (let id of productIDList) {
          const product = await state.FoodChain.methods
            .products(parseInt(id))
            .call();
          products.push(product);
        }

        return { success: true, data: { products } };
      } catch (err) {
        console.log("Error in getting manufacturer inventory: ", err);
        return { success: false, message: err.message };
      }
    },

    getRetailerInventory: async (_address) => {
      try {
        if (!state.FoodChain) return { success: true, data: {} };

        const productIDList = await state.FoodChain.methods
          .getRetailerInventory(_address)
          .call();

        let products = [];
        for await (let id of productIDList) {
          const product = await state.FoodChain.methods
            .products(parseInt(id))
            .call();
          products.push(product);
        }

        return { success: true, data: { products } };
      } catch (err) {
        console.log("Error in getting retailer inventory: ", err);
        return { success: false, message: err.message };
      }
    },
    addProduct: async (_name, _price, _ipfs_hash) => {
      try {
        if (!state.FoodChain) return { success: true, data: {} };
        const date = Date.now();
        const addProductResponse = await state.FoodChain.methods
          .addProduct(
            _name,
            web3.utils.toWei(parseFloat(_price), "ether"),
            _ipfs_hash,
            date
          )
          .send({
            from: account,
            gas: Constants.GAS,
          });
        return { success: true, data: { product: addProductResponse } };
      } catch (err) {
        console.log("Error in adding product: ", err);
        return { success: false, message: err.message };
      }
    },
    getProduct: async (_productId) => {
      try {
        if (!state.FoodChain) return { success: true, data: {} };

        const productResponse = await state.FoodChain.methods
          .getProductDetails(_productId)
          .call();
        productResponse[0].price = web3.utils.fromWei(
          productResponse[0].price,
          "ether"
        );
        return {
          success: true,
          data: {
            details: productResponse[0],
            retailers: productResponse[1],
            manufacturer: productResponse[2],
            customer: productResponse[3],
          },
        };
      } catch (err) {
        console.log("Error in getting product: ", err);
        return { success: false, message: err.message };
      }
    },
    getProductHistory: async (_productId) => {
      try {
        if (!state.FoodChain) return { success: true, data: {} };

        const allEvents = await state.FoodChain.getPastEvents("allEvents", {
          fromBlock: 0,
          toBlock: "latest",
        });

        const history = allEvents.filter(
          (event) => event.returnValues._productId == _productId
        );

        return { success: true, data: { history } };
      } catch (err) {
        console.log("Error in getting product history: ", err);
        return { success: false, message: err.message };
      }
    },
    getAllProducts: async () => {
      try {
        if (!state.FoodChain) return { success: true, data: {} };
        const allProducts = await state.FoodChain.methods.getProducts().call();
        const products = allProducts.filter(
          (product) =>
            product.currentOwner.toLowerCase() != account.toLowerCase()
        );
        return { success: true, data: { products } };
      } catch (err) {
        console.log("Error in getting all products: ", err);
        return { success: false, message: err.message };
      }
    },
    getCustomerOrders: async (_address) => {
      try {
        if (!state.FoodChain) return { success: true, data: {} };

        const productIDList = await state.FoodChain.methods
          .getCustomerOrders(_address)
          .call();

        let products = [];
        for await (let id of productIDList) {
          const product = await state.FoodChain.methods
            .products(parseInt(id))
            .call();
          products.push(product);
        }

        return { success: true, data: { products } };
      } catch (err) {
        console.log("Error in getting customer inventory: ", err);
        return { success: false, message: err.message };
      }
    },
    releaseProduct: async (_productId) => {
      try {
        if (!state.FoodChain) return { success: true, data: {} };
        const date = Date.now();
        const product = await state.FoodChain.methods
          .products(_productId)
          .call();
        console.log("pro", product);

        console.log("product price from resp", product.price.toString());
        const transactionResponse = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: account,
              to: product.manufacturer,
              value: product.price.toString(16),
            },
          ],
        });
        const releaseProductResponse = await state.FoodChain.methods
          .releaseProduct(_productId, date)
          .send({
            from: account,
            gas: Constants.GAS,
          });
        return {
          success: true,
          data: { releaseProductResponse, transactionResponse },
        };
      } catch (err) {
        console.log(`Error in releasing product :`, err);
        return { success: false, message: err.message };
      }
    },
    getProductsOfStage: async (_stage) => {
      try {
        if (!state.FoodChain) return { success: true, data: {} };
        const allProducts = await state.FoodChain.methods.getProducts().call();

        const products = allProducts.filter(
          (product) => product.stage == _stage
        );
        return { success: true, data: { products } };
      } catch (err) {
        console.log(`Error in getting products of stage ${_stage}: `, err);
        return { success: false, message: err.message };
      }
    },

    getProductsOfName: async (_name) => {
      try {
        if (!state.FoodChain) return { success: true, data: {} };
        const allProducts = await state.FoodChain.methods.getProducts().call();

        const products = allProducts.filter((product) => product.name == _name);
        return { success: true, data: { products } };
      } catch (err) {
        console.log(`Error in getting products of name ${_name}: `, err);
        return { success: false, message: err.message };
      }
    },

    buyProduct: async (_productId) => {
      try {
        if (!state.FoodChain) return { success: true, data: {} };
        const date = Date.now();

        const product = await state.FoodChain.methods
          .products(_productId)
          .call();
        // const retailers = await state.FoodChain.methods
        //   .Product_Retailers(_productId)
        //   .call();
        // console.log(currentRetailerAddress);
        // const currentRetailerAddress = retailers[retailers.length - 1];
        const transactionResponse = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: account,
              to: "0xA009d84Cc9CBAa52a72C1e63da3305ACE25037Dc",
              value: product.price.toString(16),
            },
          ],
        });
        const buyProductResponse = await state.FoodChain.methods
          .buyProduct(_productId, date)
          .send({
            from: account,
            gas: Constants.GAS,
          });

        return {
          success: true,
          data: { buyProductResponse, transactionResponse },
        };
      } catch (err) {
        console.log(`Error in buying product :`, err);
        return { success: false, message: err.message };
      }
    },
  };

  React.useEffect(() => {
    (async () => {
      //Get the info from the contracts
      const contractResult = GetContract();
      updateContract(contractResult.data);

      // Get the account of the user
      const accountResponse = await Connect();
      updateAuth({ account: accountResponse.data.account });
    })();
  }, [account]);

  React.useEffect(() => {
    (async () => {
      if (!account) return;
      const userTypeResponse = await Services.getUserType(account);
      console.log(userTypeResponse, "line 257");
      if (
        userTypeResponse.success &&
        userTypeResponse.data.type != Constants.ROLE[3]
      ) {
        let userResponse;
        switch (userTypeResponse.data.type) {
          case Constants.ROLE[0]:
            userResponse = await Services.getManufacturer(account);
            updateAuth({
              authenticated: true,
              name: userResponse.data.manufacturer.name,
              account: account,
              role: userTypeResponse.data.type,
            });
            break;
          case Constants.ROLE[1]:
            userResponse = await Services.getRetailer(account);
            updateAuth({
              authenticated: true,
              name: userResponse.data.retailer.name,
              account: account,
              role: userTypeResponse.data.type,
            });
            break;
          case Constants.ROLE[2]:
            userResponse = await Services.getCustomer(account);
            updateAuth({
              authenticated: true,
              name: userResponse.data.customer.name,
              account: account,
              role: userTypeResponse.data.type,
            });
            break;
          default:
            if (window.location.pathname !== "/") window.location.href = "/";
        }
      } else {
        if (window.location.pathname !== "/") window.location.href = "/";
      }
    })();
  }, [account]);

  return (
    <ContractContext.Provider
      value={{
        ...state,
        ...{
          updateContract,
          Services,
        },
      }}
    >
      {props.children}
    </ContractContext.Provider>
  );
}

export default ContractContextProvider;
