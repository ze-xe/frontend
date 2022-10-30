import { Box, Flex, Spacer, Text } from '@chakra-ui/react';
import React from 'react';

const sellOrders = [
	{
		price: 1.70,
		amount: 600,
		type: 'SELL',
	},
    {
		price: 1.703,
		amount: 400,
		type: 'SELL',
	},
    {
		price: 1.705,
		amount: 600,
		type: 'SELL',
	},
    {
		price: 1.71,
		amount: 400,
		type: 'SELL',
	},
    {
		price: 1.72,
		amount: 500,
		type: 'SELL',
	},
    {
		price: 1.73,
		amount: 600,
		type: 'SELL',
	},
    {
		price: 1.76,
		amount: 100,
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
		price: 2.10,
		amount: 10000,
		type: 'SELL',
	},
];

const buyOrders = [
	{
		price: 1.095,
		amount: 2500,
		type: 'BUY',
	},
    {
		price: 1.099,
		amount: 300,
		type: 'BUY',
	},
    {
		price: 1.1001,
		amount: 1000,
		type: 'BUY',
	},
	{
		price: 1.112,
		amount: 800,
		type: 'BUY',
	},
    {
		price: 1.1223,
		amount: 2500,
		type: 'BUY',
	},
    {
		price: 1.14,
		amount: 300,
		type: 'BUY',
	},
    {
		price: 1.155,
		amount: 2500,
		type: 'BUY',
	},
    {
		price: 1.172,
		amount: 300,
		type: 'BUY',
	},
    {
		price: 1.18,
		amount: 1000,
		type: 'BUY',
	},
	{
		price: 1.20,
		amount: 800,
		type: 'BUY',
	},
    {
		price: 1.21,
		amount: 2500,
		type: 'BUY',
	},
    {
		price: 1.22,
		amount: 300,
		type: 'BUY',
	},
    {
		price: 1.24,
		amount: 1000,
		type: 'BUY',
	},
	{
		price: 1.25,
		amount: 800,
		type: 'BUY',
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

const Order = ({ order, index, total }) => {
	return (
		<Flex justify={'space-between'} px={1} width="100%" bgColor={"gray.900"} my={0.5}>
			<Text fontSize={'sm'} color="gray.100">
				{order.amount} T0
			</Text>
			<Box
				bgColor={order.type == 'BUY' ? '#B9F6CA' : '#FF8A80'}
				key={index}
				width={40 + (order.amount / total) * 60 + '%'}
				rounded={2}
				textAlign="right"
				px={1}>
				<Text color={'gray.800'} fontSize="sm" fontWeight={"bold"}>
					{order.price.toFixed(4)} T1
				</Text>
			</Box>
		</Flex>
	);
};
export default function OrderBook() {
	const totalSell = sellOrders.reduce((acc, order) => acc + order.amount, 0);
	const totalBuy = buyOrders.reduce((acc, order) => acc + order.amount, 0);
	return (

		<Flex flexDir={'column'} justify="center" align={'end'} pl={5}>
			{sellOrders.map((order: any, index: number) => {
                return <Order order={order} index={index} total={totalSell} />;
			})}

			<Box py={5}>
				<Text fontSize={'3xl'} fontWeight="bold">
					2.1201 T1
				</Text>
			</Box>

			{buyOrders.map((order: any, index: number) => {
                return <Order order={order} index={index} total={totalBuy} />;
			})}
		</Flex>
	);
}
