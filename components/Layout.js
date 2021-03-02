import React from "react";
import Footer from "@/components/Footer";
import {StandardHeader, HomeHeader} from "@/components/Header";
import Header from "@/components/OldHeader"

const Layout = ({ children, pathname }) => {
  let header = <StandardHeader />
  if (pathname === "/") {
    header = <HomeHeader />
  }
  return ( 
    <>
      {/* <Header height={36}/> */}
      {header}
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
