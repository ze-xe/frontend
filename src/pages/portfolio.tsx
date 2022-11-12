import React from 'react';
import { Header } from '../components/Header';
import { useContext } from 'react';
import { WalletContext } from '../context/Wallet';
import { Avatar, Box, Button, Flex, Progress, Text } from '@chakra-ui/react';

import {
	Table,
	Thead,
	Tbody,
	Tfoot,
	Tr,
	Th,
	Td,
	TableCaption,
	TableContainer,
} from '@chakra-ui/react';
import { DataContext } from '../context/DataProvider';
import Link from 'next/link';
import {
	Stat,
	StatLabel,
	StatNumber,
	StatHelpText,
	StatArrow,
	StatGroup,
} from '@chakra-ui/react';
import { dollarFormatter, tokenFormatter } from '../utils/formatters';
import Head from 'next/head';
import Image from 'next/image';

export default function wallet() {
	const { address, isConnected } = useContext(WalletContext);
	const { tokens } = useContext(DataContext);
	const [balance, setBalance] = React.useState(0);
	const [tradingBalancesUSD, setTradingBalancesUSD] = React.useState([]);
	const [totalTradingBalanceUSD, setTotalTradingBalanceUSD] =
		React.useState(0);

	React.useEffect(() => {
		if (isConnected) _setBalance();
		if (tokens[0])
			if (
				tradingBalancesUSD.length == 0 &&
				tokens[0].price &&
				tokens[0].tradingBalance
			)
				_setTradingBalanceUSD();
	});

	const _setTradingBalanceUSD = () => {
		let _tradingBalancesUSD = [];
		let _totalTradingBalanceUSD = 0;
		for (let i in tokens) {
			let _amount =
				(tokens[i].tradingBalance * tokens[i].price) /
				10 ** tokens[i].decimals;
			if (isNaN(_amount)) _amount = 0;
			_tradingBalancesUSD.push(_amount);
			_totalTradingBalanceUSD += _amount;
		}
		setTradingBalancesUSD(_tradingBalancesUSD);
		setTotalTradingBalanceUSD(_totalTradingBalanceUSD);
	};
	const _setBalance = async () => {
		let _balance = await (window as any).tronWeb.trx.getBalance(address);
		setBalance(_balance);
	};

	return (
		<>
			<Head>
				<title>Portfolio | ZEXE | Buy & Sell Crypto on TRON</title>
				<link rel="icon" type="image/x-icon" href="/favicon.png"></link>
			</Head>
			<Flex justify={'center'}>
				{isConnected ? (
					<Box mt={2} width="100%" maxW="1400px">
						<Flex
							bgColor={'gray.1100'}
							align="start"
							p={4}
							pt={10}
							pb={8}
							justify="space-between">
							<Flex>
								<Avatar
									bgGradient={
										'linear(to-r, #E11860, #CB1DC3)'
									}></Avatar>
								<Box>
									<Text
										ml={4}
										fontSize="xl"
										fontWeight={'bold'}>
										{address}
									</Text>
									<Text
										ml={4}
										fontSize="sm"
										color={'gray.400'}>
										{tokenFormatter(null).format(
											balance / 1e6
										)}{' '}
										TRX
									</Text>
								</Box>
							</Flex>
							<Box>
								<Stat textAlign={'right'}>
									<StatLabel>Trading Balance</StatLabel>
									<StatNumber>
										{dollarFormatter(null).format(
											totalTradingBalanceUSD
										)}
									</StatNumber>
									<StatHelpText></StatHelpText>
								</Stat>
							</Box>
							{/* <Box textAlign={'right'}>
						<Text ml={4} fontSize="sm" color={'gray.400'}></Text>
						<Text ml={4} fontSize="xl" fontWeight={'bold'} ></Text>
					</Box> */}
						</Flex>

						<Box bgColor={'gray.1100'} mt={2}>
							{/* <Text p={5} fontSize='lg' fontWeight={'bold'}>Trading Balance</Text> */}
							<TableContainer>
								<Table variant="simple">
									<Thead>
										<Tr>
											<Th>Asset</Th>
											<Th>Trading Balance</Th>
											<Th>Wallet Balance</Th>
											<Th></Th>
											<Th isNumeric>Actions</Th>
										</Tr>
									</Thead>
									<Tbody>
										{tokens.map((token, index) => {
											return (
												<Tr key={index}>
													<Td>
														<Flex
															gap="8px"
															align="center">
															<Image
																alt="al"
																src={
																	`/assets/crypto_logos/` +
																	token.symbol.toLowerCase() +
																	'.png'
																}
																width={30}
																height={30}
																style={{
																	borderRadius:
																		'50%',
																}}
															/>
															<Text>
																{token.name}
															</Text>
														</Flex>
													</Td>
													<Td>
														<Box>
															<Text>
																{tokenFormatter(
																	null
																).format(
																	token.tradingBalance /
																		10 **
																			token.decimals
																)}{' '}
																{token.symbol}
															</Text>
															<Text
																fontSize={'sm'}
																color="gray">
																{dollarFormatter(
																	null
																).format(
																	tradingBalancesUSD[
																		index
																	]
																)}
															</Text>
														</Box>
													</Td>
													<Td>
														<Box>
															<Text>
																{tokenFormatter(
																	null
																).format(
																	token.balance /
																		10 **
																			token.decimals
																)}{' '}
																{token.symbol}
															</Text>
															<Text
																fontSize={'sm'}
																color="gray">
																{dollarFormatter(
																	null
																).format(
																	(token.balance *
																		token.price) /
																		10 **
																			token.decimals
																)}
															</Text>
														</Box>
													</Td>
													<Td>
														<Progress
															value={
																(100 *
																	tradingBalancesUSD[
																		index
																	]) /
																totalTradingBalanceUSD
															}
															height="2"
															width={40}
															colorScheme="red"
														/>
													</Td>
													<Td
														textAlign={'right'}
														isNumeric>
														<Link href={'/deposit'}>
															<Button
																size={'sm'}
																variant="ghost">
																Deposit
															</Button>
														</Link>
														<Link
															href={'/withdraw'}>
															<Button
																size={'sm'}
																ml={2}
																variant="ghost">
																Withdraw
															</Button>
														</Link>
													</Td>
												</Tr>
											);
										})}
									</Tbody>
								</Table>
							</TableContainer>
						</Box>
					</Box>
				) : (
					<Box
						bgColor={'gray.900'}
						width="100%"
						p={5}
						textAlign="center"
						mt={2}>
						<Text my={5}>Please connect your wallet</Text>
					</Box>
				)}
			</Flex>
		</>
	);
}
