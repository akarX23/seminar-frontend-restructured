import React from "react";
import Header from "../Components/Header/header";
import Footer from "../Components/Footer/footer";

const Layout = (props) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100%",
      }}
    >
      <Header />
      {props.children}
      <Footer />
    </div>
  );
};

export default Layout;
