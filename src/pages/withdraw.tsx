import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import Withdraw from '../components/deposit/Withdraw';
import Recent from '../components/deposit/RecentDeposits';
import TradingBalance from '../components/deposit/TradingBalance';
import Head from 'next/head';

export default function deposit() {
	return (
		<>
		<Head>
				<title>
					Withdraw | ZEXE | Buy & Sell Crypto on TRON
				</title>
				<link rel="icon" type="image/x-icon" href="/favicon.png"></link>
			</Head>
		<Flex justify={'center'}>
			<Flex mt={2} flex="stretch" gap={2} width="100%" maxW="1400px">
				<Box bgColor="gray.1100" width={'30%'} p={4}>
					<TradingBalance />
				</Box>
				<Box bgColor="gray.1100" width={'50%'} p={4}>
					<Withdraw />
				</Box>
				<Box bgColor="gray.1100" width={'20%'} p={4}>
					<Recent type={'withdraws'} />
				</Box>
			</Flex>
		</Flex>
		</>
	);
}
