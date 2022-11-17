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
import { useAccount } from 'wagmi';
import { ChainID } from '../../../utils/chains';
import { Endpoints } from '../../../utils/const';

export default function BuyModal({
	pair,
	token1,
	token0,
	token0Amount,
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

	const { isConnected } = useContext(WalletContext);
	const { isConnected: isEvmConnected } = useAccount();
	const { chain, explorer } = useContext(DataContext);

	const amountExceedsBalance = () => {
		if (amount == '0' || amount == '' || !token1?.tradingBalance)
			return false;
		if (Number(amount) && token1?.tradingBalance)
			return Big(amount).gt(
				Big(token1?.tradingBalance).div(10 ** token1?.decimals)
			);
	};

	const amountExceedsMin = () => {
		if (token0Amount == '0' || token0Amount == '' || !token0 || !pair)
			return false;
		if (Number(token0Amount) && pair?.minToken0Order && token0.decimals)
			return Big(token0Amount).lt(
				Big(pair?.minToken0Order).div(10 ** token0.decimals)
			);
	};

	const buy = async () => {
		setLoading(true);
		setConfirmed(false);
		setHash(null);
		setResponse('');
		let _amount = Big(token0Amount)
			.times(10 ** token0.decimals)
			.toFixed(0);

		let exchange = await getContract('Exchange', chain);
		send(
			exchange,
			'executeAndPlaceOrder',
			[
				pair.tokens[0].id,
				pair.tokens[1].id,
				_amount,
				Number.MAX_SAFE_INTEGER.toString(),
				1,
				orders.map((o) => (chain == ChainID.NILE ? '0x' : '') + o.id),
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
			})
			.catch((err: any) => {
				setLoading(false);
			});
	};

	const _onOpen = () => {
		onOpen();
		let _amount = Big(token0Amount)
			.times(10 ** token0.decimals)
			.toFixed(0);

		axios
			.get(Endpoints[chain] + 'market/matched/orders/' + pair.id, {
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
				let _orderToPlace = token0Amount * 10 ** token0.decimals;
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
							.times(orders[i].exchangeRate)
							.div(10 ** pair.exchangeRateDecimals)
					);
				}
				_expectedOutput = _expectedOutput.plus(
					Big(_orderToPlace).times(price)
				);

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
		onClose();
	};

	return (
		<>
			<Button
				width={'100%'}
				mt="2"
				bgColor={'green2'}
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
					: 'Market Buy'}
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
								<Text fontSize={'xs'}>OrderType: BUY</Text>
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
							Estimated Output: {token0Amount} {token0?.symbol}
						</Text>
						<Text>
							Total Amount:{' '}
							{expectedOutput / 10 ** token1?.decimals}{' '}
							{token1?.symbol}
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
													href={
														explorer() +
														hash
													}
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
										bgColor="green2"
										mr={3}
										width="100%"
										onClick={buy}
										loadingText="Sign the transaction in your wallet"
										isLoading={loading}>
										Confirm Buy
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
