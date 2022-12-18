import { Box, Flex, Spacer, Text } from '@chakra-ui/react';
import React from 'react';
import { useContext } from 'react';
import { DataContext } from '../../../context/DataProvider';
import { tokenFormatter } from '../../../utils/formatters';

const Order = ({ order, pair, index }) => {

	return (
		<Flex justify={'space-between'} width="100%"
            color={order.orderType == '1' ? 'red2' : 'green2'}
            bgColor="background2"
			py={'3px'}
			px={4}
        >
			<Text fontSize={'xs'}>
				{tokenFormatter(null).format(order.fillAmount/(10**pair?.tokens[0].decimals))} 
			</Text>
			<Text fontSize={'xs'}>
				{tokenFormatter(null).format(order.fillAmount*(order.exchangeRate/(10**18))/(10**pair?.tokens[0].decimals))} 
			</Text>
			<Text fontSize="xs">
				{tokenFormatter(pair.exchangeRateDecimals).format(order.exchangeRate/(10**18))}
			</Text>
		</Flex>
	);
};

export default function OrderHistory({pair}) {
	const {pairExecutedData} = useContext(DataContext);

	return (
		<Box >
			<Flex justify={'space-between'} px={2} py={2} mb={1} mt={{sm: -2, md: -2, lg: -2, xl: 0}} gap={2} bgColor='background2'>
				<Text fontSize="xs">Amount {pair?.tokens[0].symbol}</Text>
				<Text fontSize="xs">Amount {pair?.tokens[1].symbol}</Text>
				<Text fontSize="xs">Price {pair?.tokens[1].symbol}</Text>
			</Flex>
			{(pairExecutedData[pair?.id]) && pairExecutedData[pair?.id].slice(0,47).map((order: any, index: number) => {
				return <Order order={order} pair={pair} index={index} key={index} />;
			})}
		</Box>
	);
}
