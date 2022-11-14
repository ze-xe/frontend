import React, { useContext, useEffect, useState } from 'react';
import {
	Button,
	Box,
	Text,
	Flex,
	useDisclosure,
	Input,
	IconButton,
	InputRightElement,
	InputGroup,
	Spinner,
	Image,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Fade,
	Divider,
} from '@chakra-ui/react';

import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
} from '@chakra-ui/react';

import { BsPlusCircle } from 'react-icons/bs';
import { AiOutlineDisconnect, AiOutlineInfoCircle } from 'react-icons/ai';

import { WalletContext } from '../context/Wallet';
import { DataContext } from '../context/DataProvider';
import { Avatar } from '@chakra-ui/react';
import { BiLogOut, BiMoney } from 'react-icons/bi';
import { MdCopyAll, MdLogout } from 'react-icons/md';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import Link from 'next/link';

const ConnectButton = ({}) => {
	const {
		isConnected: isTronConnected,
		isConnecting,
		address: tronAddress,
		connect: connectTron,
		tronWeb,
		disconnect,
	} = useContext(WalletContext);
	const { isDataReady, isFetchingData, fetchData } = useContext(DataContext);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const {
		isOpen: isConnectOpen,
		onOpen: onConnectOpen,
		onClose: onConnectClose,
	} = useDisclosure();

	const _connectTron = () => {
		connectTron((_address: string | null, _err: string) => {
			if (!isDataReady && !isFetchingData && _address) {
				fetchData((window as any).tronWeb, _address);
			}
		});
		onConnectClose();
	};

	const _copy = () => {
		navigator.clipboard.writeText(tronAddress as string);
	};

	const _connectBttc = () => {};

	const _disconnect = () => {
		disconnect();
		onClose();
	};

	return (
		<Box>
			{isTronConnected ? (
				// <Box>
				// 	<Button
				//     bgGradient="linear(to-r, #E11860, #CB1DC3)"
				//     color="gray.100" size="sm" _hover={{ bg: 'gray.800' }} onClick={onOpen}>{(tronAddress)?.slice(0, 6) + "..." + (tronAddress)?.slice(-4)}</Button>
				// </Box>
				<Menu isOpen={isOpen}>
					<MenuButton
						bgColor={'primary'}
						as={Button}
						variant="ghost"
						fontSize={'sm'}
						p="2"
						boxSize={'40px 150px'}
						_hover={{ bgColor: 'none' }}
						onMouseEnter={onOpen}
						onMouseLeave={onClose}>
						<Flex align={'center'} gap={1}>
							<Avatar bgColor={'primary'} size="xs" mr={1} maxH={'18px'} maxW={'18px'} />
							<Text>My Wallet</Text>
							{isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
						</Flex>
					</MenuButton>
					<Fade in={isOpen} >
						<MenuList borderRadius={0}
							style={{ zIndex: 100 }}
							bgColor={'gray.200'}
							color={'gray.900'}
							onMouseEnter={onOpen}
							onMouseLeave={onClose}>
							<Box mx={'15px'} my={'15px'} minW="300px" width={'300px'}>
								<Flex flexDir="column" align={'center'} gap={2} >
									<Flex width={'100%'} justify={'start'} align='center' gap={2} px={6}>
										<Avatar size={'lg'} bgColor={'gray.800'}/>
										<Text fontSize={'xl'} fontWeight="bold">
											{tronAddress?.slice(0, 5) +
												'....' +
												tronAddress?.slice(-5)}
										</Text>
									</Flex>

									<Divider borderColor={'gray.400'} mt={5}/>
									<Button
										as={Link}
										href="/portfolio"
										// bgColor={'gray.200'}
										px={6}
										height={'55px'}
										width="100%"
										minW={'200px'}
										rounded={10}
										justifyContent='start'
										>
										{' '}
										<Flex
										justify={'start'}
											align="center" gap={2}>
											<BiMoney size={20} />
											<Box>

											<Text fontSize={'md'} fontWeight='bold'>
												Portfolio
											</Text>
											</Box>
										</Flex>
									</Button>

									<Divider borderColor={'gray.400'} />
									<Button
										// bgColor={'gray.200'}
										px={6}
										mb={-2}
										height={'55px'}
										width="100%"
										rounded={10}
										onClick={_disconnect}
										justifyContent='start'
										>
										<Flex
										justify={'start'}
											align="center" gap={2}>
											<MdLogout size={20} />
											<Box>

											<Text fontSize={'md'} fontWeight='bold'>
											Disconnect
											</Text>
											</Box>
										</Flex>
									</Button>
									{/* </Flex> */}
								</Flex>
							</Box>
						</MenuList>
					</Fade>
				</Menu>
			) : (
				<Button
					color="gray.100"
					onClick={onConnectOpen}
					isLoading={isConnecting}
					size="sm"
					bgColor={'primary'}
					_hover={{ bg: 'gray.800' }}>
					Connect Wallet
				</Button>
			)}

			<Modal isCentered isOpen={isConnectOpen} onClose={onConnectClose}>
				<ModalOverlay bg="blackAlpha.100" backdropFilter="blur(30px)" />
				<ModalContent maxW={'20rem'} pt={0} pb={2} rounded={20}>
					{/* <ModalCloseButton rounded={20} bgColor="gray.100" m={2}/> */}
					<ModalBody>
						<Text fontSize={'lg'} fontWeight="bold" mb={5} mt={1}>
							Choose a network
						</Text>
						<Flex gap={5}>
							<Button
								display={'flex'}
								bgColor={'red'}
								minW={'125px'}
								height={'125px'}
								rounded="20"
								onClick={_connectTron}>
								<Image
									src="/tron-outline.png"
									width={55}
									height={55}
									alt="tronlogo"
								/>
							</Button>
							<Button
								bgColor={'black'}
								minW={'125px'}
								height={'125px'}
								rounded="20"
								disabled
								_hover={{ bg: 'gray.700' }}>
								<Flex
									flexDir={'column'}
									align="center"
									justify={'center'}
									gap={0}>
									<Text color={'gray.100'} fontSize="xs">
										Coming Soon
									</Text>
									<Image
										src="/BTT.png"
										width={70}
										height={70}
										alt="tronlogo"
									/>
								</Flex>
							</Button>
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</Box>
	);
};

export default ConnectButton;
