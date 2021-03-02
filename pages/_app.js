import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import Layout from "@/components/Layout";

function MyApp({ Component, pageProps, router }) {
  let headerHeight = 36
  if (router.pathname === '/') {
    headerHeight = "screen"
  }
  return (
    <>
      <Layout pathname={router.pathname}>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
