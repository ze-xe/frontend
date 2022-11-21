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
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { chains, ChainID } from '../utils/chains';

const ConnectButton = ({}) => {
	const {address: evmAddress, isConnected: isEvmConnected, isConnecting: isEvmConnecting} = useAccount();
	const {connectAsync: connectEvm, connectors} = useConnect();
	const { disconnect: disconnectEvm } = useDisconnect()
	
	const {
		isConnected: isTronConnected,
		isConnecting,
		address: tronAddress,
		connect: connectTron,
		disconnect,
	} = useContext(WalletContext);

	const { isDataReady, isFetchingData, fetchData, setChain, chain } = useContext(DataContext);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const {
		isOpen: isConnectOpen,
		onOpen: onConnectOpen,
		onClose: onConnectClose,
	} = useDisclosure();

	const _connectTron = () => {
		connectTron((_address: string | null, _err: string) => {
			if (!isDataReady && !isFetchingData && _address) {
				fetchData(_address, ChainID.NILE);
				setChain(ChainID.NILE);
			}
		});
		onConnectClose();
	};

	const _copy = () => {
		navigator.clipboard.writeText(tronAddress as string);
	};

	const _connectEvm = (chain: number) => {
		connectEvm({chainId: chains[chain].id, connector: connectors[chain]}).then((res) => {
			fetchData(res.account, ChainID.AURORA);
			setChain(ChainID.AURORA);
			localStorage.setItem("address", res.account)
			localStorage.setItem("chain", ChainID.AURORA.toString());
		})
		onConnectClose();
	};

	const _disconnect = () => {
		if(chain == ChainID.NILE) {
			disconnect();
			// reload
			window.location.reload();
		} else {
			localStorage.removeItem("address");
			localStorage.removeItem("chain");
			disconnectEvm();
			window.location.reload();
		}
		onClose();
	};

	const address = () => {
		if (isEvmConnected) return evmAddress;
		if (isTronConnected) return tronAddress;
		return '';
	}

	return (
		<Box>
			{isTronConnected || isEvmConnected ? (
				// <Box>
				// 	<Button
				//     bgGradient="linear(to-r, #E11860, #CB1DC3)"
				//     color="gray.100" size="sm" _hover={{ bg: 'gray.800' }} onClick={onOpen}>{(tronAddress)?.slice(0, 6) + "..." + (tronAddress)?.slice(-4)}</Button>
				// </Box>
				<Menu isOpen={isOpen} >
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
					<Fade in={isOpen}>
						<MenuList
							style={{ zIndex: 100 }}
							bgColor={'gray.50'}
							color={'gray.900'}
							onMouseEnter={onOpen}
							onMouseLeave={onClose}
							borderRadius={0}>
							<Box mx={'15px'} my={'15px'} minW="300px" width={'300px'}>
								<Flex flexDir="column" align={'center'} gap={2} >
									<Flex width={'100%'} justify={'start'} align='center' gap={2} px={6}>
										<Avatar size={'lg'} bgColor={'gray.800'}/>
										<Text fontSize={'xl'} fontWeight="bold">
											{address().slice(0, 5) +
												'....' +
												address().slice(-5)}
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

			<Modal isCentered isOpen={isConnectOpen} onClose={onConnectClose} >
				<ModalOverlay bg="blackAlpha.100" backdropFilter="blur(30px)" />
				<ModalContent maxW={'300px'} pt={0} pb={2} rounded={0} >
					{/* <ModalCloseButton rounded={20} bgColor="gray.100" m={2}/> */}
					<ModalBody >
						<Text fontSize={'lg'} fontWeight="bold" mb={5} mt={1}>
							Choose a network
						</Text>
						<Flex gap={5}>
						<Button
								bgColor={'black'}
								// minW={'0px'}
								height={'125px'}
								rounded="20"
								// disabled
								_hover={{ bg: 'gray.800' }}
								onClick={() => _connectEvm(0)}
								px={8}
								>
								<Flex
									flexDir={'row'}
									align="center"
									justify={'center'}
									gap={5}>
									<Image
										src="/aurora.png"
										width={70}
										height={70}
										alt="tronlogo"
									/>
									<Box>
									<Text mb={1} fontSize='lg'>Aurora Testnet</Text>
									<Text fontSize={'sm'}>{ChainID.AURORA}</Text>
									</Box>

								</Flex>
							</Button>
							{/* <Button
								display={'flex'}
								bgColor={'red'}
								minW={'125px'}
								height={'125px'}
								rounded="20"
								onClick={_connectTron}>
								<Image
									src="/tron-outline.png"
									width={70}
									height={70}
									alt="tronlogo"
								/>
							</Button> */}
{/* 							
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
									<Text color={'gray.100'} fontSize="xs" mb={2}>
										Coming Soon
									</Text>
									<Image
										src="/near.ico"
										// width={40}
										height={70}
										alt="tronlogo"
									/>
								</Flex>
							</Button> */}

							{/* <Button
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
									<Text color={'gray.100'} fontSize="xs" mb={2}>
										Coming Soon
									</Text>
									<Image
										src="/eth.png"
										// width={70}
										height={70}
										alt="tronlogo"
									/>
								</Flex>
							</Button> */}
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</Box>
	);
};

export default ConnectButton;