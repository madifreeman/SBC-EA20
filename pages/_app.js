import "tailwindcss/tailwind.css";
import "../styles/globals.css";
import Layout from "@/components/Layout";

function MyApp({ Component, pageProps, router }) {
    return (
      <>
        <Layout pathname={router.pathname}>
          <Component {...pageProps} />
        </Layout>
      </>
    );
  // }
}

export default MyApp;
