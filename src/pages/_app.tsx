import { ChakraProvider, extendTheme } from '@chakra-ui/react';

import theme from '../theme'
import { AppProps } from 'next/app'
import { DataProvider } from '../context/DataProvider';
import { AppDataProvider } from '../context/AppData';
import { Header } from '../components/Header';
import { WalletProvider } from '../context/Wallet';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <DataProvider>
        <AppDataProvider>
          <WalletProvider>
          <Header/>
          <Component {...pageProps} />
          </WalletProvider>
        </AppDataProvider>
      </DataProvider>
    </ChakraProvider>
  )
}

export default MyApp
