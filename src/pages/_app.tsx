import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import '@rainbow-me/rainbowkit/styles.css';
import '../styles/globals.css'
import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';


import theme from '../theme'
import { AppProps } from 'next/app'
import { DataProvider } from '../context/DataProvider';
import { AppDataProvider } from '../context/AppData';
import { Header } from '../components/Header';
import { WalletProvider } from '../context/Wallet';
import { LeverDataProvider } from '../context/LeverDataProvider';

const { chains, provider } = configureChains(
  [{
    ...chain.arbitrumGoerli,
    iconUrl: 'https://arbitrum.io/wp-content/uploads/2021/01/Arbitrum_Symbol-Full-color-White-background.png',
  },
  chain.goerli
],
  [
    alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={darkTheme()}>
    <ChakraProvider theme={theme}>
      <DataProvider>
        <LeverDataProvider>
        <AppDataProvider>
          <WalletProvider>
          <Header/>
          <Component {...pageProps} />
          </WalletProvider>
        </AppDataProvider>
        </LeverDataProvider>
      </DataProvider>
    </ChakraProvider>
    </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default MyApp