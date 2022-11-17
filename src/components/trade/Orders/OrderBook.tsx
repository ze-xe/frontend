import { ArrowDownIcon, ArrowUpIcon } from '@chakra-ui/icons';
import { Box, Flex, Spacer, Text, Divider } from '@chakra-ui/react';
import React from 'react';
import { useContext } from 'react';
import { DataContext } from '../../../context/DataProvider';
import {useEffect, useState} from 'react';
import { tokenFormatter } from '../../../utils/formatters';

const Order = ({ order, index, total, pair, orderType }) => {

	return (
		<Flex
			key={index}
			justify="space-between"
			color={orderType == 'BUY' ? 'green2' : 'red2'}
			// bgSize={(order.amount / total) * 100 + '% auto'}
			bgColor="background2"
			width="100%"
			rounded={2}
			my={0.5}
			py={'1px'}
			textAlign="right"
			px={4}
			_hover={{ bgColor: 'gray.800' }}>
			<Text fontSize={'xs'}>
				{tokenFormatter(null).format(order.amount/(10**pair?.tokens[0].decimals))}
			</Text>
			<Text fontSize={'xs'}>
				{tokenFormatter(null).format((order.amount/(10**(pair?.tokens[0].decimals)))*(order.exchangeRate/(10**pair?.exchangeRateDecimals)))}
			</Text>
			<Text fontSize="xs" fontWeight={'bold'}>
				{tokenFormatter(pair?.exchangeRateDecimals).format(order.exchangeRate/(10**pair?.exchangeRateDecimals))} 
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
			<Flex justify={'space-between'} px={4} py={1} mb={1} mt={0} bgColor='gray.900' gap={2}>
				<Text fontSize={'xs'} fontWeight='bold'>Amount {pair?.tokens[0].symbol} </Text>
				<Text fontSize={'xs'} fontWeight='bold'>Amount {pair?.tokens[1].symbol}</Text>
				<Text fontSize={'xs'} fontWeight='bold'>Price {pair?.tokens[1].symbol}</Text>
			</Flex>
			{[...sellOrders].reverse().map((order: any, index: number) => {
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
			<Flex py={2} align="end" gap={2} color={pair?.priceDiff < 0 ? 'red2' : 'green2'} justify="end">
				<Flex textAlign={'right'} mb={1.5} mr={-1}>
				
				{pair?.priceDiff < 0 ? <ArrowDownIcon width={3}/> : <ArrowUpIcon width={3}/>}
				<Text fontSize={'xs'} mt={-0.5}>{pair?.priceDiff/ (10**pair?.exchangeRateDecimals)}</Text>

				</Flex>
				<Text
					fontSize={'2xl'}
					fontWeight="bold"
					textAlign={'right'}
					mr={4}>
					{tokenFormatter(pair?.exchangeRateDecimals).format(pair?.exchangeRate / (10**pair?.exchangeRateDecimals))}
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
