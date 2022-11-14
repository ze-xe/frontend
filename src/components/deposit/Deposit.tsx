import {
	Heading,
	Button,
	Box,
	Text,
	Flex,
	InputLeftElement,
	Alert,
	AlertIcon,
} from '@chakra-ui/react';
import React from 'react';
import { useContext } from 'react';
import { WalletContext } from '../../context/Wallet';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { Select } from '@chakra-ui/react';
import { DataContext } from '../../context/DataProvider';
import Image from 'next/image';
import { getABI, getAddress, getContract, send } from '../../utils/contract';
import { MdOpenInNew } from 'react-icons/md';
import axios from 'axios';
import Link from 'next/link';
import { ChainID } from '../../utils/chains';
import { useAccount } from 'wagmi';
const Big = require('big.js');
const ethers = require('ethers');

export default function Deposit() {
	const { address, isConnected } = useContext(WalletContext);
	const { address: evmAddress, isConnected: isEvmConnected } = useAccount();

	const { tokens, chain, explorer } = useContext(DataContext);
	const [selectedToken, setSelectedToken] = React.useState(0);
	const [amount, setAmount] = React.useState('0');

	// loading
	const [loading, setLoading] = React.useState(false);
	const [response, setResponse] = React.useState(null);
	const [hash, setHash] = React.useState(null);
	const [confirmed, setConfirmed] = React.useState(false);

	const [isApprovedNow, setIsApprovedNow] = React.useState({});

	const handleMax = () => {
		// set amount as token balance
		let token = tokens[selectedToken];
		let amount = Big(token.balance).div(10 ** token.decimals);
		setAmount(amount);
	};

	const deposit = async () => {
		setLoading(true);
		setResponse(null);
		setConfirmed(false);
		setHash(null);
		// deposit amount of selected token
		let token = tokens[selectedToken];
		let _amount = Big(amount)
			.times(10 ** token.decimals)
			.toFixed(0);

		// get contract
		let vault = await getContract('Vault', chain);
		send(vault, 'deposit', [token.id, _amount], chain)
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
			});
	};

	const approve = async () => {
		setLoading(true);
		// approve amount of selected token
		let token = tokens[selectedToken];
		let _amount = Big(amount)
			.times(10 ** token.decimals)
			.toString();

		const erc20 = await getContract('ERC20', chain, tokens[selectedToken].id);
		send(erc20, 'approve', [getAddress('Vault', chain), ethers.constants.MaxUint256.toString()], chain)
		.then((res: any) => {
			const _isApprovedNow = isApprovedNow;
			_isApprovedNow[selectedToken] = true;
			setIsApprovedNow(_isApprovedNow);
			setLoading(false);
		});
	};

	const needsApproval = () => {
		if(isApprovedNow[selectedToken]) return false;
		let token = tokens[selectedToken];
		if (amount == '' || !token) return false;
		let _amount = Big(amount)
			.times(10 ** token.decimals)
			.toNumber();
		return token.allowance < _amount;
	};

	const amountExceedsBalance = () => {
		let token = tokens[selectedToken];
		if (amount == '' || !token) return false;
		let _amount = Big(amount)
			.times(10 ** token.decimals)
			.toNumber();
		return token.balance < _amount;
	};

	return (
		<Flex flexDir={'column'} justify="space-between" height={'100%'}>
			<Box>
				<Flex justify={'space-between'} align="start">
					<Text fontSize={'2xl'} fontWeight="bold" mb={2}>
						Choose an asset to deposit
					</Text>
					<Link href="/faucet">
						<Button >
							<Text mr={'2'} fontSize="sm">
							💰 Faucet (Testnet)
							</Text>
							<MdOpenInNew />
						</Button>
					</Link>
				</Flex>
				<Box mt={4}>
					<Select
						size="lg"
						placeholder="Asset"
						width={'100%'}
						value={selectedToken}
						onChange={(e) => {
							setSelectedToken(parseInt(e.target.value));
						}}
						// borderRadius={'0 8px 8px 0'}
						// size={'lg'}
					>
						{tokens.map((token, index) => {
							return (
								<option key={index} value={index}>
									<Image
										src={
											`/assets/crypto_logos/` +
											tokens[
												selectedToken
											]?.symbol.toLowerCase() +
											'.png'
										}
										width={30}
										height={30}
										alt={tokens[selectedToken]?.symbol}
										style={{
											maxHeight: 30,
											borderRadius: '50%',
										}}></Image>
									{token.name} ({token.symbol})
								</option>
							);
						})}
					</Select>
				</Box>

				<Box my={2}>
					<InputGroup size="lg" width={'100%'}>
						<InputLeftElement
							pointerEvents="none"
							children={
								<Image
									src={
										`/assets/crypto_logos/` +
										tokens[
											selectedToken
										]?.symbol.toLowerCase() +
										'.png'
									}
									width={30}
									height={30}
									alt={tokens[selectedToken]?.symbol}
									style={{
										maxHeight: 30,
										borderRadius: '50%',
									}}></Image>
							}
						/>
						<Input
							// borderRadius={'8px 0 0 8px'}
							pr="4.5rem"
							type={'Amount'}
							placeholder="Enter Amount"
							// disabled={needsApproval()}
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
						/>
						<InputRightElement mr={2}>
							<Button
								h="1.75rem"
								size="sm"
								// disabled={needsApproval()}
								onClick={handleMax}
								variant="ghost">
								{'Max'}
							</Button>
						</InputRightElement>
					</InputGroup>
				</Box>

				<Flex
					p={2}
					bgColor="gray.900"
					my={4}
					mt={6}
					borderRadius={7}
					justify="space-between"
					align={'center'}>
					<Flex align={'center'} gap={3}>
						<Box
							height={3}
							width={3}
							borderRadius={10}
							bgColor={(isConnected || isEvmConnected) ? 'green' : 'red'}></Box>
						{(isConnected || isEvmConnected) ? (
							<Box>
								<Text fontSize={'sm'}>From Wallet</Text>
								<Text fontSize={'md'}>{address??evmAddress}</Text>
							</Box>
						) : (
							<Text>Wallet not connected</Text>
						)}
					</Flex>
					<Button size={'sm'} variant="ghost" h="1.75rem" disabled>
						Change Wallet
					</Button>
				</Flex>
			</Box>
			<Box>
				{needsApproval() ? (
					<Button
						width={'100%'}
						mt={2}
						onClick={approve}
						isLoading={loading}
						loadingText="Approving your token...">
						Approve zexe to use your token
					</Button>
				) : (
					<Button
						width={'100%'}
						mt={2}
						disabled={
							loading ||
							Number(amount) == 0 ||
							amountExceedsBalance() ||
							!(isConnected || isEvmConnected)
						}
						onClick={deposit}
						isLoading={loading}
						loadingText="Confirm in your wallet"
						bgGradient={'linear(to-r, #E11860, #CB1DC3)'}
						size="lg">
						{!(isConnected || isEvmConnected)
							? 'Connect wallet'
							: Number(amount) == 0
							? 'Enter Amount'
							: amountExceedsBalance()
							? 'Insufficient Balance'
							: 'Deposit'}
					</Button>
				)}
				<Box>
					{(response) && (
						<Box width={'100%'} my={2}>
							<Alert
								status={
									response.includes('confirm')
										? 'info'
										: confirmed &&
										  response.includes('Success')
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
					)}
				</Box>
			</Box>
		</Flex>
	);
}
