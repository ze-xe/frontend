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
import {useEffect, useState} from 'react';
import Exchange from '../../components/trade/Exchange';

const Trade = () => {
	const {pairs} = useContext(DataContext);
	const router = useRouter()
	const { pairId } = router.query
	const [pair, setPair] = useState(null)

	// pairId = USD_ETH
	
	useEffect(() => {
		setPair(pairs.find((pair) => pair.tokens[0].symbol + '_' + pair.tokens[1].symbol === pairId))
		// console.log(pair);
		// if (!pair) {
		// 	router.push('/trade')
		// }
	})

	return (
		<>
			<Box>
				<Flex flexDir={{'sm': 'column', md: 'row'}} justifyItems={'stretch'} gap={2} mt={2}>
					<Box order={{sm: 1, md: 0}} bgColor={'gray.1100'} width={{sm: '100%', md: "20%", lg: '20%', xl: '15%'}} mb={{sm: '2', md: 2, lg:0}}>
						<TokensPanel />
					</Box>
					<Box order={{sm: 0, md: 1}} width={{sm: '100%', md: "60%", lg: '60%', xl: '55%'}} mb={{sm: '2', md: 2, lg:0}}>
						<TitlePanel pair={pair} />
						<GraphPanel pair={pair} />
						<Exchange pair={pair}/>
					</Box>
					<Flex order={{sm: 1, md: 2}}
						flexDir={'column'}
						width={{sm: '100%', md: "20%", lg: '20%', xl: '30%'}}
						>
						<OrdersPanel pair={pair} />
					</Flex>
				</Flex>
				<Box bgColor={'gray.1100'} my={2} width='100%'>
					<PlacedOrders/>
				</Box>
			</Box>
		</>
	);
};

export default Trade;
