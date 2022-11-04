import React from 'react';
import { Header } from '../components/Header';
import { useContext } from 'react';
import { WalletContext } from '../context/Wallet';
import { Avatar, Box, Button, Flex, Progress, Text } from '@chakra-ui/react';

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
	const { address, isConnected } = useContext(WalletContext);
  	const { tokens, tokenFormatter } = useContext(DataContext)
	const [ balance, setBalance ] = React.useState(0);

	React.useEffect(() => {
		if(isConnected) _setBalance();
	})
	const _setBalance = async () => {
		let _balance = await (window as any).tronWeb.trx.getBalance(address)
		setBalance(_balance)
	}

	return (
		<Flex justify={'center'}>
		<Box mt={2} width='100%' maxW='1400px'>
			<Flex bgColor={'gray.1000'} align="start" p={4} py={10}
			>
				<Avatar bgGradient={'linear(to-r, #E11860, #CB1DC3)'}></Avatar>
				<Box>

				<Text ml={4} fontSize="lg" fontWeight={'bold'}>
					{address}
				</Text>
				<Text ml={4} fontSize="sm" color={'gray.400'}>
					Balance: {tokenFormatter.format(balance/1e6)} TRX
				</Text>
				</Box>
			</Flex>

			<Box bgColor={'gray.1000'} mt={2}
			>
				{/* <Text p={5} fontSize='lg' fontWeight={'bold'}>Trading Balance</Text> */}
				<TableContainer>
					<Table variant="simple">
						<Thead>
							<Tr>
								<Th>Asset</Th>
								<Th>Trading Balance</Th>
								<Th>Wallet Balance</Th>
								{/* <Th></Th> */}
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
					{/* <Td><Progress value={(token.tradingBalance/(10**token.decimals))} height='2' width={40} rounded={20} colorScheme='green' /></Td> */}
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
		</Flex>
	);
}
