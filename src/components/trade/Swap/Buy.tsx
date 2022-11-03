import {
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
} from '@chakra-ui/react';

import {
	Slider,
	SliderTrack,
	SliderFilledTrack,
	SliderThumb,
	SliderMark,
} from '@chakra-ui/react';

import { Box, Button, Flex, Heading, Input, Text } from '@chakra-ui/react';
import React from 'react';
import { useContext } from 'react';
import { DataContext } from '../../../context/DataProvider';
import { useEffect } from 'react';
import axios from 'axios';
import { getABI, getAddress } from '../../../utils/contract';
const Big = require('big.js');

const MIN_T0_ORDER = '10000000000000000';

export default function BuyModule({ pair }) {
	const [amount, setAmount] = React.useState('0');
	const [token0Amount, settoken0Amount] = React.useState('0');
	const [loading, setLoading] = React.useState(false);

	const [price, setPrice] = React.useState('0');
	const [sliderValue, setSliderValue] = React.useState(NaN);

	const [token0, setToken0] = React.useState(null);
	const [token1, setToken1] = React.useState(null);

	const { tokens } = useContext(DataContext);

	useEffect(() => {
		const _token0 = tokens.find((t) => t.id === pair?.tokens[0].id);
		const _token1 = tokens.find((t) => t.id === pair?.tokens[1].id);

		setToken0(_token0);
		setToken1(_token1);

		if (
			pair?.exchangeRate > 0 &&
			token1?.balance &&
			token0?.balance &&
			isNaN(sliderValue)
		) {
			const _price = Big(pair.exchangeRate).div(
				10 ** pair.exchangeRateDecimals
			);
			setPrice(_price.toString());
			setSliderValue(20);
			if (_price.toNumber() > 0) {
				const token1Amount = Big(30)
					.times(token1.tradingBalance)
					.div(100)
					.div(10 ** token1.decimals);

				setAmount(token1Amount.toNumber().toFixed(pair.exchangeRateDecimals));
				settoken0Amount(
					token1Amount.div(_price).toNumber().toFixed(pair.exchangeRateDecimals)
				);
			}
		}
	});

	const buy = () => {
		setLoading(true);
		let _amount = Big(token0Amount)
			.times(10 ** token0.decimals)
			.toFixed(0);
		axios
			.get('https://api.zexe.io/matchedorders/' + pair.id, {
				params: {
					amount: _amount,
					exchange_rate: Big(price).times(
						10 ** pair.exchangeRateDecimals
					),
					order_type: 1,
				},
			})
			.then((resp) => {
				let orders = resp.data.data;
				let ordersToExecute = [];
				for (let i in orders) {
					ordersToExecute.push('0x' + orders[i].id);
				}
				console.log(ordersToExecute);
				(window as any).tronWeb
					.contract(getABI('Exchange'), getAddress('Exchange'))
					.methods.executeAndPlaceOrder(
						pair.tokens[0].id,
						pair.tokens[1].id,
						_amount,
						(
							Number(price) *
							10 ** pair.exchangeRateDecimals
						).toFixed(0),
						1,
						ordersToExecute
					)
					.send({})
					.then((res: any) => {
						setLoading(true)
						console.log(res);
					});
			});
	};

	const setSlider = (e) => {
		setSliderValue(e);
		const token1Amount = Big(e)
			.times(token1?.tradingBalance ?? 0)
			.div(100)
			.div(10 ** token1?.decimals);
		setAmount(token1Amount.toString());
		if (price != '0' && price != '' && Number(price))
			if (Number(price) > 0)
				settoken0Amount(token1Amount.div(price).toString());
	};

	const updateToken1Amount = (e) => {
		setAmount(e);
		if (
			price != '0' &&
			price != '' &&
			Number(price) &&
			e != '0' &&
			e != '' &&
			Number(e)
		)
			settoken0Amount(Big(e).div(price).toString());
	};

	const updateToken0Amount = (e) => {
		settoken0Amount(e);
		if (
			price != '0' &&
			price != '' &&
			Number(price) &&
			e != '0' &&
			e != '' &&
			Number(e)
		)
			setAmount(Big(e).times(price).toString());
	};

	const onPriceChange = (e) => {
		setPrice(e);
		if (amount != '0' && amount != '' && e != '0' && e != '' && Number(e))
			settoken0Amount(Big(amount).div(e).toString());
	};

	const amountExceedsBalance = () => {
		if (amount == '0' || amount == '') return false;
		if (Number(amount))
			return Big(amount).gt(
				Big(token1.tradingBalance).div(10 ** token1.decimals)
			);
	};

	const amountExceedsMin = () => {
		if (token0Amount == '0' || token0Amount == '') return false;
		if (Number(token0Amount))
			return Big(token0Amount).lt(Big(MIN_T0_ORDER).div(10 ** token0.decimals));
	};

	const labelStyles = {
		mt: '2',
		ml: '-2.5',
		fontSize: 'xs',
		color: 'gray.500',
	};

	return (
		<Flex flexDir={'column'} gap={4} width={'50%'}>
			<Flex flexDir={'column'} gap={1}>
				<Text fontSize={'sm'}>Price ({pair?.tokens[1].symbol})</Text>
				<NumberInput
					min={0}
					precision={pair?.exchangeRateDecimals}
					value={price}
					onChange={onPriceChange}
					variant="filled"
					border={'1px'}
					borderRadius="6"
					borderColor={'gray.700'}>
					<NumberInputField />
					<NumberInputStepper>
						<NumberIncrementStepper />
						<NumberDecrementStepper />
					</NumberInputStepper>
				</NumberInput>
			</Flex>

			<Flex flexDir={'column'} gap={1}>
				<Text fontSize={'sm'}>Amount ({pair?.tokens[0].symbol})</Text>
				<NumberInput
					min={0}
					precision={pair?.exchangeRateDecimals}
					value={token0Amount}
					onChange={updateToken0Amount}
					variant="filled"
					border={'1px'}
					borderRadius="6"
					borderColor={'gray.700'}>
					<NumberInputField />
					<NumberInputStepper>
						<NumberIncrementStepper />
						<NumberDecrementStepper />
					</NumberInputStepper>
				</NumberInput>
			</Flex>

			<Flex flexDir={'column'} gap={1}>
				<Text fontSize={'sm'}>Total ({pair?.tokens[1].symbol})</Text>
				<NumberInput
					min={0}
					precision={pair?.tokens[1].decimals}
					value={amount}
					onChange={updateToken1Amount}
					variant="filled"
					border={'1px'}
					borderRadius="6"
					borderColor={'gray.700'}>
					<NumberInputField />
					<NumberInputStepper>
						<NumberIncrementStepper />
						<NumberDecrementStepper />
					</NumberInputStepper>
				</NumberInput>

				<Slider
					defaultValue={30}
					value={sliderValue}
					onChange={setSlider}
					mt={8}
					mb={3}>
					<SliderMark value={25} {...labelStyles}>
						25%
					</SliderMark>
					<SliderMark value={50} {...labelStyles}>
						50%
					</SliderMark>
					<SliderMark value={75} {...labelStyles}>
						75%
					</SliderMark>
					<SliderMark
						value={sliderValue}
						textAlign="center"
						// bg="blue.500"
						color="white"
						mt="-8"
						ml="-5"
						w="12"
						fontSize={'xs'}>
						{isNaN(sliderValue) ? 0 : sliderValue}%
					</SliderMark>
					<SliderTrack>
						<SliderFilledTrack bgColor="green.300" />
					</SliderTrack>
					<SliderThumb />
				</Slider>
			</Flex>

			<Button
				width={'100%'}
				my="2"
				bgColor={'green'}
				onClick={buy}
				disabled={
					loading ||
					Number(amount) <= 0 ||
					amountExceedsBalance() ||
					amountExceedsMin() ||
					price == '' ||
					Number(price) <= 0
				}
				loadingText='Please sign the transaction'
				isLoading={loading}>
				{amountExceedsMin()
					? 'Amount is too less'
					: amountExceedsBalance()
					? 'Insufficient Trading Balance'
					: 'Limit Buy'}
			</Button>
		</Flex>
	);
}
