import { Box, Flex, Spacer, Text } from '@chakra-ui/react';
import React from 'react';
import { useContext } from 'react';
import { DataContext } from '../../../context/DataProvider';

const orders = [
	{
		price: 1.70,
		amount: 600,
		type: 'SELL',
	},
	{
		price: 1.78,
		amount: 500,
		type: 'SELL',
	},
    {
		price: 1.80,
		amount: 900,
		type: 'SELL',
	},
    {
		price: 1.70,
		amount: 600,
		type: 'SELL',
	},
	{
		price: 1.78,
		amount: 500,
		type: 'SELL',
	},
    {
		price: 1.80,
		amount: 900,
		type: 'SELL',
	},
    {
		price: 1.70,
		amount: 600,
		type: 'SELL',
	},
	{
		price: 1.78,
		amount: 500,
		type: 'SELL',
	},
    {
		price: 1.80,
		amount: 900,
		type: 'SELL',
	},
    {
		price: 1.25,
		amount: 800,
		type: 'BUY',
	},
    {
		price: 1.85,
		amount: 1600,
		type: 'SELL',
	},
	{
		price: 1.871,
		amount: 200,
		type: 'SELL',
	},
	{
		price: 1.90,
		amount: 800,
		type: 'SELL',
	},
	{
		price: 2.00,
		amount: 900,
		type: 'SELL',
	},
	{
		price: 2.01,
		amount: 100,
		type: 'SELL',
	},
	{
		price: 2.05,
		amount: 1500,
		type: 'SELL',
	},
    {
        price: 1.20,
        amount: 2500,
        type: 'BUY',
    },
    {
        price: 1.21,
		amount: 300,
		type: 'BUY',
	},
    {
        price: 1.24,
		amount: 1000,
		type: 'BUY',
	},
    {
        price: 2.10,
        amount: 10000,
        type: 'SELL',
    },
	{
		price: 1.30,
		amount: 200,
		type: 'BUY',
	},
	{
		price: 1.40,
		amount: 300,
		type: 'BUY',
	},
	{
		price: 1.50,
		amount: 400,
		type: 'BUY',
	},
	{
		price: 1.60,
		amount: 500,
		type: 'BUY',
	},
];

const Order = ({ order, pair, index }) => {
	const {tokenFormatter} = useContext(DataContext);

	return (
		<Flex justify={'space-between'} width="100%"
            color={order.orderType == '1' ? 'green' : 'red'}
            bgColor="gray.1100"
            my={0.5}
        >
			<Text fontSize={'xs'}>
				{tokenFormatter.format(order.fillAmount/(10**pair?.tokens[0].decimals))} 
			</Text>
			<Text fontSize={'xs'}>
				{tokenFormatter.format(order.fillAmount*(order.exchangeRate/(10**pair.exchangeRateDecimals))/(10**pair?.tokens[0].decimals))} 
			</Text>
			<Text fontSize="xs">
				{tokenFormatter.format(order.exchangeRate/(10**pair.exchangeRateDecimals))}
			</Text>
		</Flex>
	);
};

export default function OrderHistory({pair}) {
	const {pairExecutedData} = useContext(DataContext);

	return (
		<Box px={2}>
			<Flex justify={'space-between'} py={1} mb={1} mt={0} mx={-4} px={4}  bgColor='gray.900' gap={2}>
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
