import {
	Heading,
	Button,
	Box,
	Text,
	Flex,
	Link,
	InputLeftElement,
} from '@chakra-ui/react';
import React from 'react';
import { useContext } from 'react';
import { WalletContext } from '../../context/Wallet';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { Select } from '@chakra-ui/react';
import { DataContext } from '../../context/DataProvider';
import Image from 'next/image';
import { getABI, getAddress } from '../../utils/contract';
import { PhoneIcon } from '@chakra-ui/icons';
const Big = require('big.js');
const ethers = require('ethers');

export default function Deposit() {
	const { address } = useContext(WalletContext);
	const { tokens } = useContext(DataContext);
	const [selectedToken, setSelectedToken] = React.useState(0);
	const [amount, setAmount] = React.useState('0');

	// loading
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState('');
	const [success, setSuccess] = React.useState(false);
	const [hash, setHash] = React.useState('');

	const handleMax = () => {
		// set amount as token balance
		let token = tokens[selectedToken];
		let amount = Big(token.tradingBalance).div(10 ** token.decimals);
		setAmount(amount);
	};

	const withdraw = () => {
		setLoading(true);
		setError('');
		setSuccess(false);
		setHash('');
		// deposit amount of selected token
		let token = tokens[selectedToken];
		let _amount = Big(amount)
			.times(10 ** token.decimals)
			.toFixed(0);
		(window as any).tronWeb
			.contract(getABI('Vault'), getAddress('Vault'))
			.methods.withdraw(token.id, _amount)
			.send({})
			.then((res: any) => {
				setLoading(false);
				setSuccess(true);
				setHash(res);
			});
	};

	const amountExceedsBalance = () => {
		let token = tokens[selectedToken];
		if (amount == '' || !token) return false;
		let _amount = Big(amount)
			.times(10 ** token.decimals)
			.toNumber();
		return token.tradingBalance < _amount;
	};

	return (
		<Flex flexDir={'column'} justify="space-between" height={'100%'}>
			<Box>
				<Text fontSize={'2xl'} fontWeight="bold" mb={2}>
					Choose an asset to withdraw
				</Text>
				<Box mt={4}>
					<Select
						placeholder="Asset"
						width={'100%'}
						value={selectedToken}
						onChange={(e) => {
							setSelectedToken(parseInt(e.target.value));
						}}
						size="lg"
						// borderRadius={'0 8px 8px 0'}
						// size={'lg'}
					>
						{tokens.map((token, index) => {
							return (
								<option key={index} value={index}>
									{token.symbol}
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
			</Box>

			<Box>
				<Button
					width={'100%'}
					mt={2}
					disabled={Number(amount) == 0 || amountExceedsBalance()}
					onClick={withdraw}
					isLoading={loading}
					loadingText="Confirm in your wallet"
					bgGradient={'linear(to-r, #E11860, #CB1DC3)'}
					size="lg">
					{Number(amount) == 0
						? 'Enter Amount'
						: amountExceedsBalance()
						? 'Insufficient Balance'
						: 'Withdraw'}
				</Button>

				<Box>
					{error && <Text color={'red'}>{error}</Text>}
					{success && (
						<Box>
							<Text>Transaction Submitted!</Text>
							<Link
								target={'_blank'}
								href={
									'https://nile.tronscan.org/#/transaction/' +
									hash
								}>
								View on TronScan
							</Link>
						</Box>
					)}
				</Box>
			</Box>
		</Flex>
	);
}
