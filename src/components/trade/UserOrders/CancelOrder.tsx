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

import {
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    SliderMark,
  } from '@chakra-ui/react'

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
	const [confirmed, setConfirmed] = React.useState(false);


	const update = () => {
		setLoading(true);
		setConfirmed(false);
		setHash(null);
		setResponse('');

		(window as any).tronWeb
			.contract(getABI('Exchange'), getAddress('Exchange'))
			.methods.updateLimitOrder(
				'0x'+order.id,
                '0',
			)
			.send({
				feeLimit: 1000000000,
			})
			.then((res: any) => {
				setHash(res);
				setLoading(false);
				checkResponse(res);
				setResponse('Transaction sent! Waiting for confirmation...');
			});
	};

	// // check response in intervals
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
	};

	const _onClose = () => {
		setLoading(false);
		setResponse(null);
		onClose();
	};

	return (
		<>
			<IconButton
                size={'sm'}
                my={-2}
                variant='ghost'
                icon={<MdCancel />}
                onClick={_onOpen}
                aria-label={''}>
			</IconButton>
            
			<Modal isOpen={isOpen} onClose={_onClose} isCentered size={'xl'}>
				<ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
				<ModalOverlay />
				<ModalContent bgColor={'gray.1000'}>
					<ModalHeader>Review</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
                        <Text mb={4}>You are about to cancel the following order:</Text>

                        <Text>Order Amount</Text>
                        <Text mb={2}>{order.amount/(10**token0?.decimals)} {token0?.symbol}</Text>
                        <Text>Exchange Rate</Text>
                        <Text mb={2}>{order.exchangeRate/(10**pair?.exchangeRateDecimals)} {token1?.symbol}/{token0?.symbol}</Text>
                        <Text>Order Type</Text>
                        <Text mb={2}>{order.orderType == '0' ? 'Buy' : 'Sell'}</Text>
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
										bgColor="gray.700"
										mr={3}
										width="100%"
										onClick={update}
										loadingText="Sign the transaction in your wallet"
										isLoading={loading}>
										Confirm Cancel
									</Button>
									<Button onClick={onClose} mt={2}>
										Back
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
