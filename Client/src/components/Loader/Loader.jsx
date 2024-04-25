import React from "react";
import { Container } from "@mui/material";
import LoadingIcon from "../../assets/Loading.svg";

function Loader() {
  return (
    <Container
      sx={{
        height: "100vh",
        "& svg": {
          marginTop: "40vh !important",
        },
      }}
    >
      <img src={LoadingIcon} style={{ textAlign: "center" }} />
    </Container>
  );
}

export default Loader;
