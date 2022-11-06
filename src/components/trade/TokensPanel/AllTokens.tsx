import { Box, Divider, Flex, Input, Text } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext } from 'react';
import { DataContext } from '../../../context/DataProvider';

export default function AllTokens({search}) {
	const { pairs, pairStats, tokenFormatter } = useContext(DataContext);

	const filteredPairs = pairs.filter((pair) => {
		return pair?.tokens[0].symbol.toLowerCase().includes(search.toLowerCase()) || pair?.tokens[1].symbol.toLowerCase().includes(search.toLowerCase()) || pair?.tokens[0].name.toLowerCase().includes(search.toLowerCase()) || pair?.tokens[1].name.toLowerCase().includes(search.toLowerCase());
	})

	return (
		<Flex flexDir={'column'} gap={0} mt={-2}>
			{filteredPairs.map((pair, index) => (
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
									`/assets/crypto_logos/` +
								pair.tokens[0].symbol.toLowerCase() +
								'.png'
								}
								width={30}
								height={30}
								alt="eth"
								style={{ maxHeight: 30, maxWidth: 30, borderRadius: "50%" }}></Image>
							<Box ml={2}>
								<Text>{pair.tokens[0].name}</Text>
								<Text fontSize={'xs'} color='gray.400'>
									{pair.tokens[0].symbol}/
									{pair.tokens[1].symbol}
								</Text>
							</Box>
						</Flex>
						<Box textAlign={'right'} color={Number(pairStats[pair.id]?.[1].changeInER) >= 0 ? 'green' : 'red'}>
							<Text fontWeight={'bold'}>
								{pair.exchangeRate /
									10 ** pair.exchangeRateDecimals}
							</Text>
							<Text fontSize={'xs'}>{tokenFormatter.format(pairStats[pair.id]?.[1].changeInER ?? 0)} %</Text>
						</Box>
					</Flex>
				</Link>
			))}
		</Flex>
	);
}
