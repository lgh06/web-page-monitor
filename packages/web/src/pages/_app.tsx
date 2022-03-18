import '../helpers/i18n';
import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import Layout from '../components/layout'


// https://nextjs.org/docs/basic-features/layouts
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout {...pageProps}>
      <Component {...pageProps}  />
    </Layout>
  )
}

export default MyApp
