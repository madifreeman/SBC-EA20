import React from "react";
import Footer from "@/components/Footer";
import { StandardHeader, HomeHeader } from "@/components/Header";

const Layout = ({ children, pathname }) => {
  let header = <StandardHeader />;
  if (pathname === "/") {
    header = <HomeHeader />;
  }

  return (
    <>
      {header}
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
