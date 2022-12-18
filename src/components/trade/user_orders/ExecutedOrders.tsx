import { Box, Text, IconButton, Flex } from '@chakra-ui/react';
import React from 'react';
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
import { EditIcon } from '@chakra-ui/icons';
import { MdOutlineCancel } from 'react-icons/md';
import CancelOrder from './CancelOrder';
import { useEffect } from 'react';
import { useContext } from 'react';
import { DataContext } from '../../../context/DataProvider';
import UpdateOrder from './UpdateOrder';
import { tokenFormatter } from '../../../utils/formatters';

export default function ExecutedOrders({ pair }) {

	const { orderHistory } = useContext(DataContext);
	
	return (
		<Box bgColor="background2">
			{orderHistory[pair?.id]?.length ? <TableContainer>
				<Table size="sm" borderColor={'gray.800'}>
					<Thead>
						<Tr>
							<Th>Order</Th>
							<Th>Amount</Th>
							<Th>Exchange Rate</Th>
						</Tr>
					</Thead>
					<Tbody>
						{orderHistory[pair?.id]?.slice(0, 10).map(
							(order: any, index: number) => {
								return (
									<Tr>
										<Td
										color={
												order.orderType == '0'
													? 'red2'
													: 'green2'
											}>
											<Text fontSize={'xs'} ml={1} fontWeight='bold'>
											{order.orderType == '0'
												? 'SELL'
												: 'BUY'}
												</Text>
										</Td>
										<Td>
											{tokenFormatter(null).format(
												order.fillAmount /
													10 ** pair.tokens[0]?.decimals
											)}{' '}
											{pair.tokens[0]?.symbol}
										</Td>
										<Td>
											{tokenFormatter(pair?.exchangeRateDecimals).format(
												order.exchangeRate /
													10 **
														pair?.exchangeRateDecimals
											)}{' '}
											{pair.tokens[1]?.symbol}/{pair.tokens[0]?.symbol}
										</Td>
										
									</Tr>
								);
							}
						)}
					</Tbody>
				</Table>
			</TableContainer>
			:
			<Box mx={4}>
				<Text color={'gray'}>No executed orders</Text>
			</Box>
			}
		</Box>
	);
}
