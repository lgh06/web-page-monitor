import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import '../helpers/i18n';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
