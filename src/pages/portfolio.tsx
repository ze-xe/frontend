import React from 'react';
import { Header } from '../components/Header';
import { useContext } from 'react';
import { WalletContext } from '../context/Wallet';
import { Avatar, Box, Button, Flex, Text } from '@chakra-ui/react';

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
import { DataContext } from '../context/DataProvider';
import Link from 'next/link';

export default function wallet() {
	const { address } = useContext(WalletContext);
  const { tokens, tokenFormatter } = useContext(DataContext)

	return (
		<Box mt={2}>
			<Flex bgColor={'gray.1000'} align="center" p={2} py={4}>
				<Avatar></Avatar>
				<Text ml={2} fontSize="lg">
					{address}
				</Text>
			</Flex>

			<Box bgColor={'gray.1000'} mt={2}>
				{/* <Text p={5} fontSize='lg' fontWeight={'bold'}>Trading Balance</Text> */}
				<TableContainer>
					<Table variant="simple">
						<Thead>
							<Tr>
								<Th>Asset</Th>
								<Th>Trading Balance</Th>
								<Th>Wallet Balance</Th>
								<Th></Th>
							</Tr>
						</Thead>
						<Tbody>
							{tokens.map((token, index) => {
                return (
                  <Tr key={index}>
                    <Td>
                      <div style={{display: 'flex', gap: '8px', alignItems:'center'}}>
                        <img alt='al' src={`/assets/crypto_logos/` + token.symbol.toLowerCase() + '.png'} style={{width: '30px', height: '30px', borderRadius: '20px'}}/>
                        <div>{token.name}</div> 
                      </div>
                      </Td>
                    <Td>{tokenFormatter.format(token.tradingBalance/(10**token.decimals))} {token.symbol}</Td>
                    <Td>{tokenFormatter.format(token.balance/(10**token.decimals))} {token.symbol}</Td>
                    <Td textAlign={'right'}>
                        <Link href={'/deposit'}>
                        <Button size={'sm'} variant='ghost'>Deposit</Button>
                        </Link>
                        <Link href={'/withdraw'}>
                        <Button size={'sm'} ml={2} variant='ghost'>Withdraw</Button>
                        </Link>
                    </Td>
                  </Tr>
                );
              }
            )}
						</Tbody>
					</Table>
				</TableContainer>
			</Box>
		</Box>
	);
}
