import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import Withdraw from '../components/deposit/Withdraw';
import Recent from '../components/deposit/RecentDeposits';
import TradingBalance from '../components/deposit/TradingBalance';

export default function deposit() {
	return (
		<Flex justify={'center'}>
			<Flex mt={2} flex="stretch" gap={2} width="100%" maxW="1400px">
				<Box bgColor="gray.1000" width={'30%'} p={4}>
					<TradingBalance />
				</Box>
				<Box bgColor="gray.1000" width={'50%'} p={4}>
					<Withdraw />
				</Box>
				<Box bgColor="gray.1000" width={'20%'} p={4}>
					<Recent type={'withdraws'} />
				</Box>
			</Flex>
		</Flex>
	);
}
