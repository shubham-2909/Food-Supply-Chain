import React, { useState } from "react";
import {
  FormControl,
  Input,
  InputLabel,
  Button,
  TextField,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
// import * as IPFS from "ipfs-core";
import { ContractContext } from "../../context/ContractContext";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/system";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import toast from "react-hot-toast";
import axios from "axios";
import Constants from "./../../Constants";

const AddProduct = () => {
  const { role } = React.useContext(AuthContext);
  const { Services } = React.useContext(ContractContext);
  const navigate = useNavigate();

  const [image, setImage] = useState();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", image);

      const resfile = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": `multipart/form-data`,
            pinata_api_key: Constants.PINATA_KEY,
            pinata_secret_api_key: Constants.PINATA_SECRET,
          },
        }
      );

      const imageURL = `https://gateway.pinata.cloud/ipfs/${resfile.data.IpfsHash}`;

      const addProductResponse = await Services.addProduct(
        name,
        price,
        imageURL || "none"
      );
      if (!addProductResponse.success)
        throw new Error(addProductResponse.message);

      toast.success("Product added successfully");
      navigate(
        `/${role}/products/${parseInt(
          addProductResponse.data.product.events.Product_Added.returnValues
            ._productId
        )}`
      );
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <Box sx={{ marginY: "50px" }}>
      <Typography variant="h3" xs={{ color: "orange" }}>
        Add Product
      </Typography>
      <FormControl fullWidth>
        <TextField
          sx={{ marginY: "8px" }}
          id="productName"
          label="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          fullWidth
        />
        <TextField
          sx={{ marginY: "8px" }}
          id="productPrice"
          label="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          fullWidth
        />
        <Button
          color="lightOrange"
          sx={{ marginY: "8px" }}
          variant="contained"
          endIcon={<UploadIcon />}
          fullWidth
        >
          Upload Image
          <input
            type="file"
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
          />
        </Button>
        <Button
          color="lightOrange"
          sx={{ marginY: "8px" }}
          variant="contained"
          type="submit"
          onClick={handleUpload}
          fullWidth
        >
          Add Product
        </Button>
      </FormControl>
    </Box>
  );
};

export default AddProduct;
