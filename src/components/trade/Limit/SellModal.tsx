import {
	Alert,
	AlertIcon,
	Box,
	Button,
	Flex,
	Text,
	useDisclosure,
} from '@chakra-ui/react';
import React, { useContext } from 'react';
const Big = require('big.js');

const MIN_T0_ORDER = '10000000000000000';
import axios from 'axios';
import { getABI, getAddress, getContract, send } from '../../../utils/contract';

import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
} from '@chakra-ui/react';

import { DataContext } from '../../../context/DataProvider';
import Link from 'next/link';
import { AiOutlineLoading } from 'react-icons/ai';
import { CheckIcon } from '@chakra-ui/icons';
import { tokenFormatter } from '../../../utils/formatters';
import { WalletContext } from '../../../context/Wallet';
import { ChainID } from '../../../utils/chains';
import { useAccount } from 'wagmi';
import { Endpoints } from '../../../utils/const';

export default function SellModal({
	pair,
	token1,
	token0,
	token1Amount,
	amount,
	price,
}) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [loading, setLoading] = React.useState(false);
	const [response, setResponse] = React.useState(null);
	const [hash, setHash] = React.useState(null);
	const [confirmed, setConfirmed] = React.useState(false);
	const [orders, setOrders] = React.useState([]);
	const [orderToPlace, setOrderToPlace] = React.useState(0);
	const [expectedOutput, setExpectedOutput] = React.useState(0);
	const [offsetAmount, setOffsetAmount] = React.useState(0);
	const { address: evmAddress, isConnected: isEvmConnected } = useAccount();

	const { isConnected } = useContext(WalletContext);
	const { chain, explorer } = useContext(DataContext);

	const sell = async () => {
		setLoading(true);
		let _amount = Big(amount)
			.times(10 ** token0.decimals)
			.minus(offsetAmount)
			.toFixed(0);

		let exchange = await getContract('Exchange', chain);

		send(
			exchange,
			'executeAndPlaceOrder',
			[
				pair.tokens[0].id,
				pair.tokens[1].id,
				_amount,
				(Number(price) * 10 ** pair.exchangeRateDecimals).toFixed(0),
				0,
				orders.map((order) => order.id),
			],
			chain
		)
			.then(async (res: any) => {
				setLoading(false);
				setResponse('Transaction sent! Waiting for confirmation...');
				if (chain == ChainID.NILE) {
					setHash(res);
					checkResponse(res);
				} else {
					setHash(res.hash);
					await res.wait(1);
					setConfirmed(true);
					setResponse('Transaction Successful!');
				}
			})
			.catch((err: any) => {
				console.log(err)
				setLoading(false);
				setConfirmed(true);
				setResponse('Transaction failed. Please try again!');
			});
	};

	// check response in intervals
	const checkResponse = (tx_id: string) => {
		axios
			.get(
				'https://nile.trongrid.io/wallet/gettransactionbyid?value=' +
					tx_id
			)
			.then((res) => {
				if (!res.data.ret) {
					setTimeout(() => {
						checkResponse(tx_id);
					}, 2000);
				} else {
					setConfirmed(true);
					if (res.data.ret[0].contractRet == 'SUCCESS') {
						setResponse('Transaction Successful!');
					} else {
						setResponse('Transaction Failed. Please try again.');
					}
				}
			});
	};

	const _onOpen = () => {
		onOpen();
		let _amount = Big(amount)
			.times(10 ** token0.decimals)
			.toFixed(0);

		axios
			.get(Endpoints[chain]+'matchedorders/' + pair.id, {
				params: {
					amount: _amount,
					exchange_rate: Big(price).times(
						10 ** pair.exchangeRateDecimals
					),
					order_type: 0,
				},
			})
			.then((resp) => {
				let orders = resp.data.data;
				let ordersToExecute = [];
				let _orderToPlace = amount * 10 ** token0.decimals;
				let _expectedOutput = Big(0);
				for (let i in orders) {
					let execAmount = Math.min(_orderToPlace, orders[i].amount);
					orders[i].amount = execAmount;
					ordersToExecute.push(orders[i]);
					_orderToPlace = Big(_orderToPlace)
						.minus(execAmount)
						.toFixed(0);
					_expectedOutput = _expectedOutput.plus(
						Big(execAmount)
							.div(orders[i].exchangeRate)
							.times(10 ** pair.exchangeRateDecimals)
					);
				}
				_expectedOutput = _expectedOutput.plus(
					Big(_orderToPlace).div(price)
				);
				if (Number(_orderToPlace) < Number(pair?.minToken0Order)) {
					setOffsetAmount(Number(_orderToPlace));
				}
				setOrderToPlace(
					Number(_orderToPlace) > Number(pair?.minToken0Order)
						? _orderToPlace
						: 0
				);
				setOrders(ordersToExecute);
				setExpectedOutput(_expectedOutput.toFixed(0));
			});
	};

	const _onClose = () => {
		setOrderToPlace(0);
		setLoading(false);
		setResponse(null);
		setOrders([]);
		setOffsetAmount(0);
		onClose();
	};

	const amountExceedsBalance = () => {
		if (amount == '0' || amount == '' || !token0 || !token1) return false;
		if (Number(amount) && token0.tradingBalance && token1.decimals)
			return Big(amount).gt(
				Big(token0.tradingBalance).div(10 ** token1.decimals)
			);
	};

	const amountExceedsMin = () => {
		if (amount == '0' || amount == '' || !pair || !token0) return false;
		if (Number(amount) && pair?.minToken0Order && token0.decimals)
			return Big(amount).lt(
				Big(pair?.minToken0Order).div(10 ** token0.decimals)
			);
	};

	return (
		<>
			<Button
				width={'100%'}
				mt="2"
				bgColor={'red'}
				onClick={_onOpen}
				disabled={
					!(isConnected || isEvmConnected) ||
					loading ||
					Number(amount) <= 0 ||
					amountExceedsBalance() ||
					amountExceedsMin() ||
					price == '' ||
					Number(price) <= 0
				}>
				{!(isConnected || isEvmConnected)
					? 'Connect Wallet'
					: amountExceedsMin()
					? 'Amount is too less'
					: amountExceedsBalance()
					? 'Insufficient Trading Balance'
					: 'Limit Sell'}
			</Button>
			<Modal
				isOpen={isOpen}
				onClose={_onClose}
				isCentered
				size={'xl'}
				scrollBehavior="inside">
				<ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
				<ModalOverlay />
				<ModalContent bgColor={'gray.1000'}>
					<ModalHeader>Review</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Text>Executing Orders</Text>
						{orders.map((o) => {
							if (o.amount > 0)
								return (
									<Box
										py={2}
										my={2}
										bgColor="gray.900"
										px={2}>
										{/* <Text textTransform={'uppercase'} fontSize='md'>Order ID</Text> */}
										<Text fontSize={'xs'}>ID: {o.id}</Text>

										<Text>
											{tokenFormatter(null).format(
												o.amount /
													10 **
														pair.tokens[0].decimals
											)}{' '}
											{pair.tokens[0].symbol} @{' '}
											{tokenFormatter(null).format(
												o.exchangeRate /
													10 **
														pair.exchangeRateDecimals
											)}{' '}
											{pair.tokens[1].symbol}
										</Text>
									</Box>
								);
							else return null;
						})}
						{orders.length == 0 && (
							<Text mb={2} color="gray" fontSize={'sm'}>
								No orders to execute
							</Text>
						)}
						<Text>Placing Orders</Text>
						{orderToPlace > 0 ? (
							<Box py={2} my={2} bgColor="gray.900" px={2}>
								<Text fontSize={'xs'}>OrderType: SELL</Text>
								<Text>
									{orderToPlace / 10 ** token0?.decimals}{' '}
									{token0?.symbol} @ {price} {token1?.symbol}
								</Text>
							</Box>
						) : (
							<Text mb={2} color="gray" fontSize={'sm'}>
								No limit order to place
							</Text>
						)}

						<Text>
							Estimated Output: {amount} {token0?.symbol}
						</Text>
						<Text>
							Total Amount: {token1Amount} {token1?.symbol}
						</Text>
					</ModalBody>

					<ModalFooter>
						<Flex flexDir={'column'} width={'100%'}>
							{response ? (
								<Box mb={2}>
									<Box width={'100%'} mb={2}>
										<Alert
											status={
												response.includes('confirm')
													? 'info'
													: confirmed &&
													  response.includes(
															'Success'
													  )
													? 'success'
													: 'error'
											}
											variant="subtle">
											<AlertIcon />
											<Box>
												<Text fontSize="md" mb={0}>
													{response}
												</Text>
												{hash && <Link
													href={explorer() + hash}
													target="_blank">
													<Text fontSize={'sm'}>
														View on TronScan
													</Text>
												</Link>}
											</Box>
										</Alert>
									</Box>
									<Button onClick={_onClose} width="100%">
										Close
									</Button>
								</Box>
							) : (
								<>
									<Button
										bgColor="red"
										mr={3}
										width="100%"
										onClick={sell}
										loadingText="Sign the transaction in your wallet"
										isLoading={loading}>
										Confirm Sell
									</Button>
									<Button onClick={onClose} mt={2}>
										Cancel
									</Button>{' '}
								</>
							)}
						</Flex>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
