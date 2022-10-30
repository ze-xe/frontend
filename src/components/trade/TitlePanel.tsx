import { Box, Text, Flex } from '@chakra-ui/react';
import React from 'react';

export default function TitlePanel() {
	return (
		<Box bgColor={"gray.900"} p="5">
			<Text fontSize={'3xl'} fontWeight="bold">
				TOKEN0/TOKEN1
			</Text>
			<Flex justify={'space-between'} mt={2}>
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
