import { ArrowUpIcon } from '@chakra-ui/icons';
import { Box, Flex, Spacer, Text, Divider } from '@chakra-ui/react';
import React from 'react';
import { useContext } from 'react';
import { DataContext } from '../../../context/DataProvider';
import {useEffect, useState} from 'react';

const Order = ({ order, index, total, pair, orderType }) => {

	const {tokenFormatter} = useContext(DataContext);

	return (
		<Flex
			key={index}
			justify="space-between"
			color={orderType == 'BUY' ? 'green' : 'red'}
			// bgSize={(order.amount / total) * 100 + '% auto'}
			bgColor="gray.1100"
			width="100%"
			rounded={2}
			my={0.5}
			py={'1px'}
			textAlign="right"
			px={4}
			_hover={{ bgColor: 'gray.800' }}>
			<Text fontSize={'xs'} color={'gray.300'}>
				{tokenFormatter.format(order.amount/(10**pair.tokens[0].decimals))}
			</Text>
			<Text fontSize={'xs'} color={'gray.300'}>
				{tokenFormatter.format((order.amount/(10**(pair.tokens[0].decimals)))*(order.exchangeRate/(10**pair.exchangeRateDecimals)))}
			</Text>
			<Text fontSize="xs" fontWeight={'bold'}>
				{tokenFormatter.format(order.exchangeRate/(10**pair.exchangeRateDecimals))} 
			</Text>
		</Flex>
	);
};

export default function OrderBook({ pair }) {
	const {orders} = useContext(DataContext);
	const [buyOrders, setBuyOrders] = useState([]);
	const [sellOrders, setSellOrders] = useState([]);
	const [totalBuy, setTotalBuy] = useState(0);
	const [totalSell, setTotalSell] = useState(0);
	const {tokenFormatter} = useContext(DataContext);

	// const totalSell = orders.sellOrders.reduce((acc, order) => acc + order.amount, 0);
	// const totalBuy = orders.buyOrders.reduce((acc, order) => acc + order.amount, 0);

	useEffect(() => {
		if(orders[pair?.id]){
			setBuyOrders(orders[pair.id].buyOrders);
			setSellOrders(orders[pair.id].sellOrders);
			setTotalBuy(orders[pair.id].totalBuy);
			setTotalSell(orders[pair.id].totalSell);
		}
	})
	return (
		<Flex flexDir={'column'}>
			<Flex justify={'space-between'} px={4} color='gray.400' py={1} mb={1} mt={-2} bgColor='gray.900'>
				<Text fontSize={'xs'}>Amount {pair?.tokens[0].symbol} </Text>
				<Text fontSize={'xs'}>Amount {pair?.tokens[1].symbol}</Text>
				<Text fontSize={'xs'}>Price {pair?.tokens[1].symbol}</Text>
			</Flex>
			{sellOrders.map((order: any, index: number) => {
				return (
					<Order
						order={order}
						index={index}
						total={totalSell}
						pair={pair}
						key={index}
						orderType={'SELL'}
					/>
				);
			})}
			<Divider mt={2} bgColor="transparent" />
			<Flex py={2} align="end" gap={2} color={'green'} justify="end">
				<Flex textAlign={'right'} mb={1.5} mr={-1}>
				<ArrowUpIcon width={3}/>
				<Text fontSize="xs">
					0.12
				</Text>
				</Flex>
				<Text
					fontSize={'2xl'}
					fontWeight="bold"
					textAlign={'right'}
					mr={4}>
					{tokenFormatter.format(pair?.exchangeRate / (10**pair?.exchangeRateDecimals))}
				</Text>
			</Flex>
			<Divider mb={2} bgColor="transparent" />
			{buyOrders.map((order: any, index: number) => {
				return (
					<Order
						order={order}
						index={index}
						total={totalBuy}
						pair={pair}
						key={index}
						orderType={'BUY'}
					/>
				);
			})}
		</Flex>
	);
}
