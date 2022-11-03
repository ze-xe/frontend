import { Heading, Button, Box, Text, Flex, Link } from '@chakra-ui/react';
import React from 'react';
import { useContext } from 'react';
import { WalletContext } from '../../context/Wallet';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { Select } from '@chakra-ui/react';
import { DataContext } from '../../context/DataProvider';
import Image from 'next/image';
import { getABI, getAddress } from '../../utils/contract';
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
		let amount = Big(token.tradingBalance).div(10**token.decimals);
		setAmount(amount);
	};
	
	const withdraw = () => {
		setLoading(true);
		setError('');
		setSuccess(false);
		setHash('');
		// deposit amount of selected token
		let token = tokens[selectedToken];
		let _amount = Big(amount).times(10**token.decimals).toFixed(0);
		(window as any).tronWeb.contract(getABI('Vault'), getAddress('Vault')).methods.withdraw(token.id, _amount).send({})
		.then((res: any) => {
			setLoading(false);
			setSuccess(true);
			setHash(res);
		})
	}


	const amountExceedsBalance = () => {
		let token = tokens[selectedToken];
		if(amount == '' || !token) return false;
		let _amount = Big(amount).times(10**token.decimals).toNumber();
		return (token.tradingBalance) < (_amount);
	}

	return (
		<>
			<Text fontSize={'xl'}>Withdraw</Text>
			{/* <Flex
				p={2}
				bgColor="gray.900"
				mt={4}
				borderRadius={7}
				justify="space-between"
				align={'center'}>
				<Flex align={'center'} gap={3}>
					<Box
						height={3}
						width={3}
						borderRadius={10}
						bgColor="green"></Box>
					<Box>
						<Text fontSize={'sm'}>To</Text>
						<Text fontSize={'md'}>{address}</Text>
					</Box>
				</Flex>
				<Button size={'sm'} variant="ghost" h="1.75rem">
					Change Wallet
				</Button>
			</Flex> */}
			<Flex mt={2}>
				<InputGroup size="md" width={'70%'}>
					<Input
						borderRadius={'8px 0 0 8px'}
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
				<Select
					placeholder="Asset"
					width={'30%'}
					value={selectedToken}
					onChange={(e) => {setSelectedToken(parseInt(e.target.value))}}
					borderRadius={'0 8px 8px 0'}
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
			</Flex>
			
			
			<Button width={'100%'} mt={2} disabled={Number(amount) == 0 || amountExceedsBalance()} onClick={withdraw} isLoading={loading} loadingText='Confirm in your wallet'>
				{Number(amount) == 0 ? 'Enter Amount' : amountExceedsBalance() ? 'Insufficient Balance' : 'Withdraw'}
			</Button>
			
			<Box>
				{error && <Text color={'red'}>{error}</Text>}
				{success && <Box>
					<Text >Transaction Submitted!</Text>
					<Link target={'_blank'} href={'https://nile.tronscan.org/#/transaction/' + hash} >View on TronScan</Link>
				</Box> }
			</Box>
		</>
	);
}
