import { Box, Flex } from '@chakra-ui/react';
import Head from 'next/head';
import React from 'react';
import Deposit from '../components/deposit/Deposit';
import Recent from '../components/deposit/RecentDeposits';
import WalletBalance from '../components/deposit/WalletBalance';

export default function deposit() {
	return (
		<>
		<Head>
				<title>
					Deposit | ZEXE | Buy & Sell Crypto on TRON
				</title>
				<link rel="icon" type="image/x-icon" href="/favicon.png"></link>
			</Head>
		<Flex justify={'center'}>
			<Flex mt={2} flex="stretch" gap={2} width="100%" maxW="1400px">
				<Box bgColor="gray.1100" width={'30%'} p={4}>
					<WalletBalance />
				</Box>
				<Box bgColor="gray.1100" width={'50%'} p={4}>
					<Deposit />
				</Box>
				<Box bgColor="gray.1100" width={'20%'} p={4}>
					<Recent type={'deposits'} />
				</Box>
			</Flex>
		</Flex>
		</>
	);
}
