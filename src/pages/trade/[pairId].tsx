import { Box, Flex, Tag, Text, useColorMode } from '@chakra-ui/react';
import { Header } from '../../components/Header';
import GraphPanel from '../../components/trade/GraphPanel';
import TokensPanel from '../../components/trade/TokensPanel/TokensPanel';
import OrdersPanel from '../../components/trade/Orders/OrdersPanel';
import TitlePanel from '../../components/trade/TitlePanel';
import Swap from '../../components/trade/Limit';
import { useContext } from 'react';
import { DataContext } from '../../context/DataProvider';
import { useRouter } from 'next/router';
import PlacedOrders from '../../components/trade/UserOrders';
import { useEffect, useState } from 'react';
import Exchange from '../../components/trade/Exchange';
import { WalletContext } from '../../context/Wallet';
import Head from 'next/head';
import { useAccount } from 'wagmi';

const Trade = () => {
	const { pairs } = useContext(DataContext);
	const { isConnected } = useContext(WalletContext);

	const { isConnected: isEvmConnected } = useAccount();

	const router = useRouter();
	const { pairId } = router.query;
	const [pair, setPair] = useState(null);

	// pairId = USD_ETH

	useEffect(() => {
		if (pairs.length > 0) {
			let _pair = pairs.find(
				(pair) =>
					pair.tokens[0].symbol + '_' + pair.tokens[1].symbol ===
					pairId
			);
			setPair(_pair);
			if(!_pair) router.push('/trade/' + pairs[0].tokens[0].symbol + '_' + pairs[0].tokens[1].symbol)
		}
	});

	return (
		<>
			<Head>
				<title>
					{pair?.exchangeRate / 10 ** pair?.exchangeRateDecimals}{' '}
					{pair?.tokens[1].symbol}/{pair?.tokens[0].symbol} | ZEXE |
					Buy & Sell Crypto on TRON
				</title>
				<link rel="icon" type="image/x-icon" href="/favicon.png"></link>
			</Head>
			<Box>
				<Flex
					flexDir={{ sm: 'column', md: 'row' }}
					justifyItems={'stretch'}
					gap={2}
					mt={2}>
					<Box
						order={{ sm: 1, md: 0 }}
						bgColor={'gray.1100'}
						width={{ sm: '100%', md: '20%', lg: '20%', xl: '15%' }}
						mb={{ sm: '2', md: 2, lg: 0 }}>
						<TokensPanel />
					</Box>
					<Box
						order={{ sm: 0, md: 1 }}
						width={{ sm: '100%', md: '60%', lg: '60%', xl: '55%' }}
						mb={{ sm: '2', md: 2, lg: 0 }}>
						<TitlePanel pair={pair} />
						<GraphPanel pair={pair} />
						<Exchange pair={pair} />
					</Box>
					<Flex
						order={{ sm: 1, md: 2 }}
						flexDir={'column'}
						width={{ sm: '100%', md: '20%', lg: '20%', xl: '30%' }}>
						<OrdersPanel pair={pair} />
					</Flex>
				</Flex>
				{(isConnected || isEvmConnected) && (
					<Box bgColor={'gray.1100'} my={2} width="100%">
						<PlacedOrders pair={pair} />
					</Box>
				)}
			</Box>
		</>
	);
};

export default Trade;
