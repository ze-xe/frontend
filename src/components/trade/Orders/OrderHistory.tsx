import { Box, Flex, Spacer, Text } from '@chakra-ui/react';
import React from 'react';

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

const Order = ({ order, index }) => {
	return (
		<Flex justify={'space-between'} width="100%"
            color={order.type == 'BUY' ? 'green' : 'red'}
            bgColor="gray.1100"
            my={0.5}
        >
			<Text fontSize={'sm'}>
				{order.amount} T0
			</Text>
			<Box
				key={index}
				my={0.5}
				textAlign="right"
				>
				<Text fontSize="sm" fontWeight={"bold"}>
					{order.exchangeRate?.toFixed(4)} T1
				</Text>
			</Box>
		</Flex>
	);
};

export default function OrderHistory() {
	return (
		<Flex flexDir={'column'} justify="flex-end" align={'end'}>
			{orders.map((order: any, index: number) => {
				return <Order order={order} index={index} key={index} />;
			})}
		</Flex>
	);
}
