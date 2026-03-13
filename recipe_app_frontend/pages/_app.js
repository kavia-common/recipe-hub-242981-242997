import "../styles/globals.css";

/**
 * @param {{ Component: any, pageProps: any }} props
 * @return {JSX.Element}
 */
export default function App({Component, pageProps}) {
    return <Component {...pageProps} />;
}
