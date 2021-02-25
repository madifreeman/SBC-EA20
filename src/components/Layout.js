import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children, headerHeight }) => {
    console.log(headerHeight)
  return (
    <>
      <Header height={headerHeight}/>
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
