import { Box, Divider, Flex, Input, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext } from 'react';
import { DataContext } from '../../../context/DataProvider';

export default function AllTokens() {
	const { pairs } = useContext(DataContext);

	return (
		<Flex flexDir={'column'} gap={0} mt={-2}>
			{pairs.map((pair, index) => (
				<Link
					key={index}
					href={
						'/trade/' +
						pair.tokens[0].symbol +
						'_' +
						pair.tokens[1].symbol
					}>
					<Flex
						align={'center'}
						justify="space-between"
						px={4}
						py={3}
						_hover={{ bgColor: 'gray.900' }}>
						<Flex align="center">
							<Image
								src={
									`https://static.okx.com/cdn/oksupport/asset/currency/icon/` +
									pair.tokens[0].symbol.toLowerCase() +
									'.png'
								}
								width={30}
								height={30}
								alt="eth"
								style={{ maxHeight: 35 }}></Image>
							<Box ml={2}>
								<Text>{pair.tokens[0].name}</Text>
								<Text fontSize={'xs'}>
									{pair.tokens[0].symbol}/
									{pair.tokens[1].symbol}
								</Text>
							</Box>
						</Flex>
						<Box textAlign={'right'}>
							<Text fontWeight={'bold'}>
								{pair.exchangeRate /
									10 ** pair.exchangeRateDecimals}
							</Text>
							<Text fontSize={'xs'}>+1.2%</Text>
						</Box>
					</Flex>
				</Link>
			))}
		</Flex>
	);
}
