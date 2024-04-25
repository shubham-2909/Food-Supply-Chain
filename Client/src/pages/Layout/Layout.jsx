import React from "react";
import Navbar from "../../components/NavBar/NavBar";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default Layout;
