import * as React from "react";
import ProductListTemplate from "../ProductListTemplate/ProductListTemplate";

const productList = [
  {
    name: "Five Star",
    id: "1",
    price: 200,
    ipfsHash: "5star_cadbury_emfynn.webp",
    stage: "Sold",
    manufacturer: "0xxxx",
    retailerList: ["Oxxx1", "Oxxx2"],
    customer: "0xxx4",
  },
  {
    name: "Banana Cake",
    id: "2",
    price: 200,
    ipfsHash: "cake_cadbury_tw16tw.jpg",
    stage: "Sold",
    manufacturer: "0xxxx",
    retailerList: ["Oxxx1", "Oxxx2"],
    customer: "0xxx4",
  },
  {
    name: "Munch Choclate",
    id: "3",
    price: 200,
    ipfsHash: "munch_nestle_lrjcal.jpg",
    stage: "Sold",
    manufacturer: "0xxxx",
    retailerList: ["Oxxx1", "Oxxx2"],
    customer: "0xxx4",
  },
  {
    name: "Tomato Sauce",
    id: "4",
    price: 200,
    ipfsHash: "tomato_sauce_nestle_w1vsqg.jpg",
    stage: "Sold",
    manufacturer: "0xxxx",
    retailerList: ["Oxxx1", "Oxxx2"],
    customer: "0xxx4",
  },
];

const MyProductsList = () => {
  return (
    <ProductListTemplate title={"My Products"} productList={productList} />
  );
};

export default MyProductsList;
