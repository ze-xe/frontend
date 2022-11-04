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
import {MdOutlineCancel} from 'react-icons/md';
export default function PlacedOrders() {
	return (
		<Box bgColor="gray.1100">
			<TableContainer>
				<Table size="sm" borderColor={'gray.800'} >
					<Thead>
						<Tr>
							<Th>Order</Th>
							<Th>Amount</Th>
							<Th isNumeric></Th>
						</Tr>
					</Thead>
					<Tbody>
						<Tr>
							<Td color={'green'}>Buy</Td>
							<Td>10.22 T0</Td>
							<Td isNumeric>
                                <Flex justify={'end'} gap={2}>
                                <EditIcon/>
                                <MdOutlineCancel/>
                                </Flex>
                            </Td>
						</Tr>
                        <Tr>
							<Td color={'red'}>Sell</Td>
							<Td>10.22 T0</Td>
							<Td isNumeric>
                                <Flex justify={'end'} gap={2}>
                                <EditIcon/>
                                <MdOutlineCancel/>
                                </Flex>
                            </Td>
						</Tr>
					</Tbody>
				</Table>
			</TableContainer>
		</Box>
	);
}
