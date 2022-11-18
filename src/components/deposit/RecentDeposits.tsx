import React, { useContext } from 'react';
import { Box, Flex, IconButton, Text } from '@chakra-ui/react';
import { DataContext } from '../../context/DataProvider';
import Image from 'next/image';
import { MdOpenInNew } from 'react-icons/md';
import { tokenFormatter } from '../../utils/formatters';
import Link from 'next/link';

export default function Recent({ type }) {
	const { userDepositWithdraws, tokens, explorer } = useContext(DataContext);

	return (
		<>
			<Text
				fontSize={'md'}
				fontWeight="bold"
				textTransform={'capitalize'}>
				Recent {type}
			</Text>
			{userDepositWithdraws[type]
				?.slice(0, 5)
				.map((item: any, index: number) => {
					const token = tokens.find(
						(token) => token.id === item.token
					);
					return (
						<Flex key={index} justify="space-between" py={2}>
							<Flex gap={1} align="center">
								<Image
									src={
										'/assets/crypto_logos/' +
										token?.symbol.toLowerCase() +
										'.png'
									}
									height={100}
									width={100}
									style={{
										maxWidth: '30px',
										maxHeight: '30px',
										borderRadius: '100px',
									}}
									alt={token?.symbol}
								/>
								<Box>
									{/* <Text fontSize={'sm'}>{token.name}</Text> */}
									<Text fontSize={'xs'}>
										{' '}
										{tokenFormatter(null).format(
											item.amount / 10 ** token?.decimals
										)}{' '}
										{token?.symbol}
									</Text>
									<Text fontSize={'xs'}>
										{new Date(
											Number(item.blockTimestamp)
										).toLocaleString()}
									</Text>
								</Box>
							</Flex>

							<Link
								href={
									explorer() +
									item.txnId
								}
								target="_blank">
								<IconButton
									aria-label=""
									icon={<MdOpenInNew />}
									variant="ghost"
								/>
							</Link>
						</Flex>
					);
				})}
		</>
	);
}
