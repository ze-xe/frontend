import { Box, Flex, Tag, Text, useColorMode } from '@chakra-ui/react';
import { Header } from '../components/Header';
import GraphPanel from '../components/trade/GraphPanel';
import TokensPanel from '../components/trade/TokensPanel';
import OrdersPanel from '../components/trade/OrdersPanel';
import TitlePanel from '../components/trade/TitlePanel';
import Swap from '../components/trade/Swap';

const Trade = () => {
	return (
		<>
			<Header />
			<Box p={6}>
				<Flex>
					<Box height={'100%'} width="20%">
						<TokensPanel />
					</Box>
					<Box height={'100%'} width="60%">
                        <TitlePanel />
                        <GraphPanel />
                        <Swap />
					</Box>
                    <Flex height={'100%'} flexDir={"column"} justify="center" width={"20%"}>
                        <OrdersPanel/>
                    </Flex>
				</Flex>
			</Box>
		</>
	);
};

export default Trade;
