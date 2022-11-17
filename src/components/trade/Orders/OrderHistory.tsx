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
            my={0.5}
        >
			<Text fontSize={'xs'}>
				{tokenFormatter(null).format(order.fillAmount/(10**pair?.tokens[0].decimals))} 
			</Text>
			<Text fontSize={'xs'}>
				{tokenFormatter(null).format(order.fillAmount*(order.exchangeRate/(10**pair.exchangeRateDecimals))/(10**pair?.tokens[0].decimals))} 
			</Text>
			<Text fontSize="xs">
				{tokenFormatter(pair.exchangeRateDecimals).format(order.exchangeRate/(10**pair.exchangeRateDecimals))}
			</Text>
		</Flex>
	);
};

export default function OrderHistory({pair}) {
	const {pairExecutedData} = useContext(DataContext);

	return (
		<Box px={2}>
			<Flex justify={'space-between'} py={1} mb={1} mt={0} mx={-4} px={4}  bgColor='background2' gap={2}>
				<Text fontSize="xs" fontWeight={"bold"}>Amount {pair?.tokens[0].symbol}</Text>
				<Text fontSize="xs" fontWeight={"bold"}>Amount {pair?.tokens[1].symbol}</Text>
				<Text fontSize="xs" fontWeight={"bold"}>Price {pair?.tokens[1].symbol}</Text>
			</Flex>
			{(pairExecutedData[pair?.id]) && pairExecutedData[pair?.id].slice(0,53).map((order: any, index: number) => {
				return <Order order={order} pair={pair} index={index} key={index} />;
			})}
		</Box>
	);
}
