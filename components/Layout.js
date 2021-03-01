import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Layout = ({ children, headerHeight }) => {
  return (
    <>
      <Header height={headerHeight}/>
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
