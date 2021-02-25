import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import Layout from "../src/components/Layout";

function MyApp({ Component, pageProps, router }) {
  let headerHeight = 36
  if (router.pathname === '/') {
    headerHeight = "screen"
  }
  return (
    <>
      <Layout headerHeight={headerHeight}>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
