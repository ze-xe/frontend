import React from 'react';
import { Divider, Text } from '@chakra-ui/react';
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

export default function WalletBalance() {

  const {tokens} = useContext(DataContext);
  const {tokenFormatter} = useContext(DataContext);

	return (
		<>
			<Text fontSize={'lg'}>Trading Balance</Text>

      <Divider my={4}/>

			<TableContainer>
				<Table size="sm" colorScheme={'whiteAlpha'}>
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
                  <Td>{token.name} </Td>
                  <Td isNumeric>{tokenFormatter.format(Big(token.tradingBalance ?? 0).div(10**(token.decimals ?? 18)).toString())} {token.symbol}</Td>
                </Tr>
              );
            })}
						
					</Tbody>

				</Table>
			</TableContainer>
		</>
	);
}
