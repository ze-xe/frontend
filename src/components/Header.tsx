import {
	Flex,
	Heading,
	Box,
	Text,
	Button,
	useDisclosure,
	Tooltip,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useEffect, useContext } from 'react';
import { MdArrowDropDown } from 'react-icons/md';
import { DarkModeSwitch } from './DarkModeSwitch';
import {
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	MenuItemOption,
	MenuGroup,
	MenuOptionGroup,
	MenuDivider,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';
import ConnectButton from './ConnectButton';
import { WalletContext } from '../context/Wallet';
import { DataContext } from '../context/DataProvider';

export const Header = ({ title }: { title: string }) => {
	const router = useRouter();

	const { connectionError, connect, isConnected, isConnecting, tronWeb } =
		useContext(WalletContext);
	const { isFetchingData, isDataReady, fetchData } = useContext(DataContext);

	useEffect(() => {
		if (localStorage.getItem('chakra-ui-color-mode') === 'light') {
			localStorage.setItem('chakra-ui-color-mode', 'dark');
		}
		if (typeof window !== 'undefined') {
			if (
				localStorage.getItem('address') &&
				!isConnected &&
				!isConnecting
			) {
				connect((_address: string | null, _err: string) => {
					if (!isDataReady && !isFetchingData && _address) {
						fetchData(tronWeb, _address);
					}
				});
			}
		}
	});
	if (router.pathname === '/') {
		return <></>;
	}
	return (
		<>
			{connectionError && (
				<Text
					textAlign={'center'}
					width="100%"
					fontSize={'sm'}
					fontWeight="bold"
					p={2}
					bgColor="gray.600">
					⚠️ {connectionError}
				</Text>
			)}
			<Flex
				justifyContent="space-between"
				align="center"
				// bgClip="text"
				bgColor={'gray.1100'}
				// color={"white"}
				py={1}
				px={6}>
				<Flex align={'end'}>
					{/* Logo */}
					<Link href={'/'}>
						<Box
							bgGradient="linear(to-r, #E11860, #CB1DC3)"
							bgClip={'text'}>
							<Text fontSize="3xl" fontWeight={'bold'}>
								{title}
							</Text>
						</Box>
					</Link>
					<Flex ml={5} my={'auto'} align="center" gap={2}>
						{/* <TradeMenu /> */}
						<MenuOption href={'/trade'} title={'Spot'} />
						<MenuOption
							href={'/'}
							title={'Margin'}
							disabled={true}
						/>
							<MenuOption
								href={'/'}
								title={'Perpetuals'}
								disabled={true}
							/>
						<MenuOption
							href={'/'}
							title={'Options'}
							disabled={true}
						/>

						{/* <Link href={'/faucet'}><Button variant={'ghost'} fontSize='sm'>Faucet</Button></Link> */}
					</Flex>
				</Flex>
				{/* Links */}
				<Flex align={'center'} gap={2}>
					<Box height={'100%'}>
						<Link href={'/faucet'}>
						
							<Button variant={'ghost'} fontSize="sm" px={2}>
								Faucet 💰
							</Button>
							
						</Link>
					</Box>
					<WalletMenu />
					<ConnectButton />
				</Flex>
			</Flex>
		</>
	);
};

const MenuOption = ({ href, title, disabled = false, size = 'sm' }) => {
	return (
		<Box height={'100%'} pt={1} px={2}>
			<Link href={href}>
			<Tooltip isDisabled={!disabled} hasArrow label='Coming Soon' bg='white' color={'gray.800'}>
				<Button
					variant={'unstyled'}
					disabled={disabled}
					size={size}
					fontSize="sm"
					>
					{title}
				</Button>
				</Tooltip>
			</Link>
		</Box>
	);
};

const TradeMenu2 = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<Menu isOpen={isOpen}>
			<MenuButton
				as={Button}
				variant="ghost"
				// bgColor="gray.1100"
				fontSize={'sm'}
				p="2"
				_hover={{ bgColor: 'none' }}
				onMouseEnter={onOpen}
				onMouseLeave={onClose}>
				Trade {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
			</MenuButton>
			<MenuList
				bgColor={'gray.50'}
				color={'gray.900'}
				onMouseEnter={onOpen}
				onMouseLeave={onClose}>
				<MenuItem as={Link} href="/trade">
					<div>
						<div>Spot Trading</div>
						<div style={{ fontSize: '10px' }}>
							Place limit/market on any pair
						</div>
					</div>
				</MenuItem>
				<MenuItem _hover={{ bgColor: 'gray.800' }}>
					<div>
						<div>
							Margin{' '}
							<sup style={{ fontSize: '10px' }}>
								(Coming Soon)
							</sup>
						</div>
						<div style={{ fontSize: '10px' }}>
							Trade with upto 10x leverage
						</div>
					</div>
				</MenuItem>
				<MenuItem _hover={{ bgColor: 'gray.800' }}>
					<div>
						<div>
							Options{' '}
							<sup style={{ fontSize: '10px' }}>
								(Coming Soon)
							</sup>
						</div>
						<div style={{ fontSize: '10px' }}>
							Speculate on the future price
						</div>
					</div>
				</MenuItem>
			</MenuList>
		</Menu>
	);
};

const WalletMenu = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<Menu isOpen={isOpen}>
			<MenuButton
				as={Button}
				variant="ghost"
				fontSize={'sm'}
				p="2"
				_hover={{ bgColor: 'none' }}
				onMouseEnter={onOpen}
				onMouseLeave={onClose}>
				My Wallet {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
			</MenuButton>
			<MenuList
				bgColor={'gray.50'}
				color={'gray.900'}
				onMouseEnter={onOpen}
				onMouseLeave={onClose}>
				<MenuItem as={Link} href="/deposit">
					<div>
						<div>Deposit</div>
						<div style={{ fontSize: '10px' }}>
							Add tokens to your wallet
						</div>
					</div>
				</MenuItem>

				<MenuItem as={Link} href="/withdraw">
					<div>
						<div>Withdraw</div>
						<div style={{ fontSize: '10px' }}>
							Withdraw tokens from your wallet
						</div>
					</div>
				</MenuItem>

				<MenuItem as={Link} href="/portfolio">
					<div>
						<div>Portfolio</div>
						<div style={{ fontSize: '10px' }}>
							View your asset holdings
						</div>
					</div>
				</MenuItem>
			</MenuList>
		</Menu>
	);
};

Header.defaultProps = {
	title: 'zexe',
};
