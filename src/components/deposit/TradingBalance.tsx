import React from 'react';
import { Divider, Flex, Text } from '@chakra-ui/react';
import { useContext } from 'react';

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
import { DataContext } from '../../context/DataProvider';
const Big = require('big.js');
import Image from 'next/image';
import { tokenFormatter } from '../../utils/formatters';

export default function WalletBalance() {
	const { tokens } = useContext(DataContext);

	return (
		<>
			<Text fontSize={'md'} fontWeight='bold' mb={4}>Trading Balance</Text>

			<TableContainer>
				<Table size="sm" colorScheme={'gray'}>
					<Thead>
						<Tr>
							<Th>Asset</Th>
							<Th isNumeric>Balance</Th>
						</Tr>
					</Thead>
					<Tbody>
						{tokens.map((token, index) => {
							return (
								<Tr key={index}>
									<Td>
										<Flex align={'center'} gap={1}>

										<Image
											src={
												`/assets/crypto_logos/` +
												token.symbol.toLowerCase() +
												'.png'
											}
											width={20}
											height={20}
											alt={token.symbol}
											style={{
												maxHeight: 20,
												borderRadius: '50%',
											}}></Image>
										{token.name}
											</Flex>
									</Td>
									<Td isNumeric>
										{tokenFormatter(null).format(
											Big(token.tradingBalance ?? 0)
												.div(
													10 ** (token.decimals ?? 18)
												)
												.toString()
										)}{' '}
										{token.symbol}
									</Td>
								</Tr>
							);
						})}
					</Tbody>
				</Table>
			</TableContainer>
		</>
	);
}
