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

export default function PlacedOrders({ pair }) {
	const { tokens } = useContext(DataContext);
	const [token0, setToken0] = React.useState(null);
	const [token1, setToken1] = React.useState(null);
	const [pairNow, setPairNow] = React.useState(null);

	useEffect(() => {
		if(pair){
		if (pairNow !== pair.id || (!token0)) {
			setToken0(
				tokens.find((token) => token.symbol === pair.tokens[0].symbol)
			);
			setToken1(
				tokens.find((token) => token.symbol === pair.tokens[1].symbol)
			);
			setPairNow(pair.id)
		}}
	});

	const { placedOrders } = useContext(DataContext);
	
	return (
		<Box bgColor="background2">
			{placedOrders[pair?.id]?.length > 0 ? <TableContainer>
				<Table size="sm" borderColor={'gray.800'}>
					<Thead>
						<Tr>
							<Th>Order</Th>
							<Th>Amount</Th>
							<Th>Exchange Rate</Th>
							<Th isNumeric></Th>
						</Tr>
					</Thead>
					<Tbody>
						{placedOrders[pair?.id]?.slice(0, 10).map(
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
												order.amount /
													10 ** token0?.decimals
											)}{' '}
											{token0?.symbol}
										</Td>
										<Td>
											{tokenFormatter(pair?.exchangeRateDecimals).format(
												order.exchangeRate /
													10 **
														pair?.exchangeRateDecimals
											)}{' '}
											{token1?.symbol}/{token0?.symbol}
										</Td>
										<Td isNumeric>
											<Flex justify={'end'}>
												<UpdateOrder
													pair={pair}
													token0={token0}
													token1={token1}
													price={0}
													order={order}
												/>
												<CancelOrder
													pair={pair}
													token0={token0}
													token1={token1}
													price={0}
													order={order}
												/>
											</Flex>
										</Td>
									</Tr>
								);
							}
						)}
					</Tbody>
				</Table>
			</TableContainer>:
			<Box>
				<Text color={'gray'}>No orders placed</Text>
			</Box>
			}
		</Box>
	);
}
