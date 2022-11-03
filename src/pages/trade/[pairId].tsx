import { Box, Flex, Tag, Text, useColorMode } from '@chakra-ui/react';
import { Header } from '../../components/Header';
import GraphPanel from '../../components/trade/GraphPanel';
import TokensPanel from '../../components/trade/TokensPanel/TokensPanel';
import OrdersPanel from '../../components/trade/Orders/OrdersPanel';
import TitlePanel from '../../components/trade/TitlePanel';
import Swap from '../../components/trade/Swap/Swap';
import { useContext } from 'react';
import { DataContext } from '../../context/DataProvider';
import { useRouter } from 'next/router';
import PlacedOrders from '../../components/trade/PlacedOrders';
import {useEffect} from 'react';

const Trade = () => {
	const {pairs} = useContext(DataContext);
	const router = useRouter()
	const { pairId } = router.query

	// pairId = USD_ETH
	const pair = pairs.find((pair) => pair.tokens[0].symbol + '_' + pair.tokens[1].symbol === pairId)

	useEffect(() => {
		// console.log(pair);
		// if (!pair) {
		// 	router.push('/trade')
		// }
	})

	return (
		<>
			<Box>
				<Flex justify={'stretch'} gap={2} mt={2}>
					<Box bgColor={'gray.1100'} width="20%">
						<TokensPanel />
					</Box>
					<Box width="60%">
						<TitlePanel pair={pair} />
						<GraphPanel pair={pair} />
						<Swap pair={pair}/>
						<PlacedOrders/>
					</Box>
					<Flex
						flexDir={'column'}
						width={'20%'}
						bgColor={'gray.1100'}
						>
						<OrdersPanel pair={pair} />
					</Flex>
				</Flex>
			</Box>
		</>
	);
};

export default Trade;
