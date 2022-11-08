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
import { BiLogOut } from 'react-icons/bi';
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
						bgGradient="linear(to-r, #E11860, #CB1DC3)"
						as={Button}
						variant="ghost"
						fontSize={'sm'}
						p="2"
						boxSize={'40px 150px'}
						_hover={{ bgColor: 'none' }}
						onMouseEnter={onOpen}
						onMouseLeave={onClose}>
						My Wallet{' '}
						{isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
					</MenuButton>
					<Fade in={isOpen}>
						<MenuList
							style={{ zIndex: 100 }}
							bgColor={'gray.50'}
							color={'gray.900'}
							onMouseEnter={onOpen}
							onMouseLeave={onClose}>
							<Box mx={'15px'} my={'15px'}>
								<Flex flexDir="column" align={'center'} gap={4}>
									<Avatar size={'lg'} />
									<Text fontSize={'lg'} fontWeight="bold">
										{tronAddress?.slice(0, 5) +
											'....' +
											tronAddress?.slice(-5)}
									</Text>
									<Box>
										<Box
											textAlign={'center'}
											width="100%"
											mb={2}>
											<Link href="/portfolio" as='/portfolio'>
												<Button fontSize={'sm'}>View your Portfolio</Button>
											</Link>
										</Box>
									</Box>
									<Flex gap={5} width="100%">
										<Button
											bgColor={'gray.200'}
											px={6}
											height={'55px'}
											width="50%"
											rounded={10}>
											{' '}
											<Flex
												flexDir={'column'}
												alignItems="center"
												onClick={_copy}>
												<MdCopyAll />
												<Text fontSize={'sm'}>
													Copy Address
												</Text>
											</Flex>{' '}
										</Button>
										<Button
											bgColor={'gray.200'}
											px={6}
											height={'55px'}
											width="50%"
											rounded={10}
											onClick={_disconnect}>
											{' '}
											<Flex
												flexDir={'column'}
												alignItems="center">
												<MdLogout />
												<Text fontSize={'sm'}>
													Disconnect
												</Text>
											</Flex>{' '}
										</Button>
									</Flex>
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
					bgGradient="linear(to-r, #E11860, #CB1DC3, #03ACDF)"
					_hover={{ bg: 'gray.800' }}>
					Connect Wallet
				</Button>
			)}

			{/* <Modal isCentered isOpen={isOpen} onClose={onClose} >
				<ModalOverlay bg="blackAlpha.100" backdropFilter="blur(30px)" />
				<ModalContent width={'23rem'}
				pt="5"
				pb={2}
				rounded={20}
				>
					<ModalCloseButton rounded={20} m={2}/>
					<ModalBody>
						<Flex flexDir="column" align={"center"} gap={4}>
							<Avatar size={"lg"}/>
							<Text fontSize={"lg"} fontWeight="bold">
							{(tronAddress)?.slice(0, 5)+"...."+(tronAddress)?.slice(-5)}
							</Text>
							<Flex gap={5} width="100%">
							<Button height={"55px"} width="50%" rounded={10} > <Flex flexDir={"column"} alignItems="center" onClick={_copy}><MdCopyAll/>
								<Text fontSize={"sm"}>Copy Address</Text>
								</Flex> </Button>
								<Button height={"55px"} width="50%" rounded={10} onClick={_disconnect}> <Flex flexDir={"column"} alignItems="center"><MdLogout/>
								<Text fontSize={"sm"}>Disconnect</Text>
								</Flex> </Button>
							</Flex>
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal> */}

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
