import { Box, Text, Flex, Divider } from '@chakra-ui/react';
import Image from 'next/image';
import React from 'react';

export default function TitlePanel({ pair }) {
	return (
		<Box bgColor={'gray.1100'} px="4" pb={2} pt={3}>
			<Flex justify={'space-between'}>
			<Flex align={'center'} gap={2}>
				<Image
					src={
						`/assets/crypto_logos/` +
								pair?.tokens[0].symbol.toLowerCase() +
								'.png'
					}
					width={40}
					height={40}
					alt="eth"
					style={{ maxHeight: 40, borderRadius: '50%' }}></Image>
				<Text fontSize={'3xl'} fontWeight="bold">
					{pair?.tokens[0].symbol}/{pair?.tokens[1].symbol}
				</Text>
				<Box>
					<Text fontSize={'xs'} color="gray.500">
						{pair?.tokens[0].name}
					</Text>
					<Text fontSize={'xs'} color="gray.500">
						{pair?.tokens[1].name}
					</Text>
				</Box>
			</Flex>
			<Box textAlign={'right'}>
				{/* <Text fontSize={'xs'} textTransform='uppercase'>Price</Text> */}
				<Text fontSize={'3xl'} fontWeight='bold' color='green'>{pair?.exchangeRate / (10**pair?.exchangeRateDecimals)} </Text>
				<Text fontSize={'sm'} color='green'>+2.2%</Text>

			</Box>
			</Flex>
			<Divider mt={2} mb={4} />
			<Flex justify={'space-between'} mb={2}>
				<Box>
					<Text
						fontSize={'xs'}
						fontWeight="bold"
						textTransform={'uppercase'}
						color="gray.400">
						Trading Volume
					</Text>
					<Text fontSize={'sm'} fontWeight="bold">
						$10,293,144
					</Text>
				</Box>
				<Box>
					<Text
						fontSize={'xs'}
						fontWeight="bold"
						textTransform={'uppercase'}
						color="gray.400">
						24h Change
					</Text>
					<Text fontSize={'sm'} fontWeight="bold">
						+2.33%
					</Text>
				</Box>
				<Box>
					<Text
						fontSize={'xs'}
						fontWeight="bold"
						textTransform={'uppercase'}
						color="gray.400">
						7d Change
					</Text>
					<Text fontSize={'sm'} fontWeight="bold">
						-12.1%
					</Text>
				</Box>
				<Box>
					<Text
						fontSize={'xs'}
						fontWeight="bold"
						textTransform={'uppercase'}
						color="gray.400">
						30d Change
					</Text>
					<Text fontSize={'sm'} fontWeight="bold">
						-12.1%
					</Text>
				</Box>
				<Box>
					<Text
						fontSize={'xs'}
						fontWeight="bold"
						textTransform={'uppercase'}
						color="gray.400">
						90d Change
					</Text>
					<Text fontSize={'sm'} fontWeight="bold">
						-12.1%
					</Text>
				</Box>
				<Box>
					<Text
						fontSize={'xs'}
						fontWeight="bold"
						textTransform={'uppercase'}
						color="gray.400">
						1y Change
					</Text>
					<Text fontSize={'sm'} fontWeight="bold">
						-12.1%
					</Text>
				</Box>
			</Flex>
		</Box>
	);
}
