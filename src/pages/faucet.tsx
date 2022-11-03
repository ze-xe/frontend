import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import Image from 'next/image';
import React from 'react';
import { useContext } from 'react';
import { DataContext } from '../context/DataProvider';
import { WalletContext } from '../context/Wallet';
import { getABI } from '../utils/contract';

const mintAmount = {
  'USDT': 10000,
  'USDD': 10000,
  'BTC': 10,
  'ETH': 100,
  'TRX': 1000000,
  'BTT': 1000000000000,
}

const Big = require('big.js');

export default function faucets() {
	const { tokens } = useContext(DataContext);
	const { address } = useContext(WalletContext);

	const [loadingToken, setLoadingToken] = React.useState('');

	const mint = async (token: any) => {
    setLoadingToken(token.id);
		// mint tokens
		const tokenContract = await (window as any).tronWeb.contract(getABI('ERC20'), token.id);
    tokenContract.methods.mint(address, Big(mintAmount[token.symbol]).times(1e18).toFixed(0))
			.send({shouldPollResponse: true})
			.then((res: any) => {
        setLoadingToken('');
				console.log(res);
			});
	};
	return (
		<Box mx={4} mt={6}>
			<Heading size={'md'} mb={3}>
				Test Tokens Faucet
			</Heading>
			<Flex gap={4} justify="start">
				{tokens.map((token) => (
					<Box key={token.id} bgColor="gray.800" minW={'15%'} p={2}>
						<Image
							src={
								`/assets/crypto_logos/` +
								token.symbol.toLowerCase() +
								'.png'
							}
							width={40}
							height={40}
							alt={token.symbol}
							style={{
								maxHeight: 40,
								borderRadius: '50%',
							}}></Image>
						<Text fontSize={'xl'}>{token.name}</Text>
						<Text>{token.symbol}</Text>

						<Text fontSize={'sm'} my={2}>Balance {token.balance/(10**token.decimals)}</Text>

						<Button
							width={'100%'}
							mt={2}
							onClick={() => mint(token)}
              loadingText='Minting'
              isLoading={loadingToken === token.id}
              >
							Mint
						</Button>
					</Box>
				))}
			</Flex>
		</Box>
	);
}
