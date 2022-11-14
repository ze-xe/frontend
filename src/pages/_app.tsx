import { ChakraProvider, extendTheme } from '@chakra-ui/react';

import theme from '../theme'
import { AppProps } from 'next/app'
import { DataProvider } from '../context/DataProvider';
import { AppDataProvider } from '../context/AppData';
import { Header } from '../components/Header';
import { WalletProvider } from '../context/Wallet';
import '../styles/globals.css';
import { configureChains, createClient, defaultChains, WagmiConfig } from 'wagmi';
import { chains } from '../utils/chains';
import { publicProvider } from 'wagmi/providers/public'

const { provider, webSocketProvider } = configureChains(chains, [publicProvider()]);

const client = createClient({
	provider,
	webSocketProvider,
});


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
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
    </WagmiConfig>
  )
}

export default MyApp