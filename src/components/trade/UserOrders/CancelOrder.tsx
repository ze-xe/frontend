import {
	Alert,
	AlertIcon,
	Box,
	Button,
	Flex,
	IconButton,
	Input,
	Text,
	useDisclosure,
} from '@chakra-ui/react';
import React, { useContext } from 'react';
const Big = require('big.js');

const MIN_T0_ORDER = '10000000000000000';
import axios from 'axios';
import { getABI, getAddress } from '../../../utils/contract';

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
import { MdCancel, MdEdit } from 'react-icons/md';
import { useEffect } from 'react';

export default function CancelOrder({
	pair,
	token1,
	token0,
	price,
    order
}) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [loading, setLoading] = React.useState(false);
	const [response, setResponse] = React.useState(null);
	const [hash, setHash] = React.useState(null);
    const [token0Amount, setToken0Amount] = React.useState('0');
    const [maxAmount, setMaxAmount] = React.useState('0');
	const [confirmed, setConfirmed] = React.useState(false);
	const [orders, setOrders] = React.useState([]);
	const [orderToPlace, setOrderToPlace] = React.useState(0);
	const [expectedOutput, setExpectedOutput] = React.useState(0);

	const { tokenFormatter, placedOrders } = useContext(DataContext);
    
    useEffect(() => {
        if(order.orderType == '0'){
            setMaxAmount((token0.tradingBalance/(10**token0.decimals)).toString())
        } else {
            setMaxAmount((token1.tradingBalance/(10**token1.decimals)).toString())
        }
    })

	const amountExceedsBalance = () => {
		if (token0Amount == '0' || token0Amount == '' || !token1.tradingBalance) return false;
		if (Number(token0Amount))
			return Big(token0Amount).gt(
				Big(maxAmount).div(10 ** token1.decimals)
			);
	};

	const amountExceedsMin = () => {
		if (token0Amount == '0' || token0Amount == '') return false;
		if (Number(token0Amount))
			return Big(token0Amount).lt(
				Big(MIN_T0_ORDER).div(10 ** token0.decimals)
			);
	};

	// const buy = () => {
	// 	setLoading(true);
	// 	setConfirmed(false);
	// 	setHash(null);
	// 	setResponse('');
	// 	let _amount = Big(token0Amount)
	// 		.times(10 ** token0.decimals)
	// 		.toFixed(0);

	// 	(window as any).tronWeb
	// 		.contract(getABI('Exchange'), getAddress('Exchange'))
	// 		.methods.executeAndPlaceOrder(
	// 			pair.tokens[0].id,
	// 			pair.tokens[1].id,
	// 			_amount,
	// 			(Number(price) * 10 ** pair.exchangeRateDecimals).toFixed(0),
	// 			1,
	// 			orders.map((o) => '0x' + o.id)
	// 		)
	// 		.send({
	// 			feeLimit: 1000000000,
	// 		})
	// 		.then((res: any) => {
	// 			setHash(res);
	// 			setLoading(false);
	// 			checkResponse(res);
	// 			setResponse('Transaction sent! Waiting for confirmation...');
	// 		});
	// };

	// // check response in intervals
	// const checkResponse = (tx_id: string) => {
	// 	axios
	// 		.get(
	// 			'https://nile.trongrid.io/wallet/gettransactionbyid?value=' +
	// 				tx_id
	// 		)
	// 		.then((res) => {
	// 			if (!res.data.ret) {
	// 				setTimeout(() => {
	// 					checkResponse(tx_id);
	// 				}, 2000);
	// 			} else {
	// 				setConfirmed(true);
	// 				if (res.data.ret[0].contractRet == 'SUCCESS') {
	// 					setResponse('Transaction Successful!');
	// 				} else {
	// 					setResponse('Transaction Failed. Please try again.');
	// 				}
	// 			}
	// 		});
	// };

	const _onOpen = () => {
		onOpen();
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
			<IconButton
                size={'xs'}
                variant='ghost'
                p={0}
                icon={<MdEdit/>}
                onClick={_onOpen}
                aria-label={''}>
			</IconButton>
            
			<Modal isOpen={isOpen} onClose={_onClose} isCentered size={'xl'}>
				<ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
				<ModalOverlay />
				<ModalContent bgColor={'gray.1000'}>
					<ModalHeader>Review {order.orderType == '0'? 'SELL' : 'BUY'}</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
                        <Text fontSize={'sm'} mb={1} color='gray'>Previous Amount</Text>
						<Input disabled value={(order.amount/(10**token0.decimals)) + ' ' + token0.symbol} />
                        <Text fontSize={'sm'} my={1} color='gray'>New Amount</Text>
						<Input placeholder='Enter Amount' onChange={(e) => setToken0Amount(e.target.value)}/>

						<Text mt={4}>
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
												<Link
													href={
														'https://nile.tronscan.org/#/transaction/' +
														hash
													}
													target="_blank">
													{' '}
													<Text fontSize={'sm'}>
														View on TronScan
													</Text>
												</Link>
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
										bgColor="orange"
										mr={3}
										width="100%"
										// onClick={update}
										loadingText="Sign the transaction in your wallet"
										isLoading={loading}
                                        disabled={amountExceedsBalance() || !Number(token0Amount) || token0Amount == '0' || amountExceedsMin()}>
                                        
										Confirm Update
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
