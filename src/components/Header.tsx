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

import {
	IconButton,
	Stack,
	Collapse,
	Icon,
	Popover,
	PopoverTrigger,
	PopoverContent,
	useColorModeValue,
	useBreakpointValue,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, ChevronRightIcon } from '@chakra-ui/icons';

export const Header = ({ title }: { title: string }) => {
	const router = useRouter();
	const { isOpen, onToggle } = useDisclosure();

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
				<Flex
					flex={{ base: 1, md: 'auto' }}
					ml={{ base: -2 }}
					display={{ base: 'flex', md: 'none' }}>
					<IconButton
						onClick={onToggle}
						icon={
							isOpen ? (
								<CloseIcon w={3} h={3} />
							) : (
								<HamburgerIcon w={5} h={5} />
							)
						}
						variant={'ghost'}
						aria-label={'Toggle Navigation'}
					/>
				</Flex>
				<Flex
					flex={{ base: 1 }}
					justify={{ base: 'center', md: 'start' }}>
					<Link href={'/'}>
						<Box
							bgGradient="linear(to-r, #E11860, #CB1DC3)"
							bgClip={'text'}>
							<Text fontSize="3xl" fontWeight={'bold'}>
								{title}
							</Text>
						</Box>
					</Link>

					<Flex display={{ base: 'none', md: 'flex' }} ml={10}>
						<DesktopNav />
					</Flex>
				</Flex>

				<Stack
					flex={{ base: 1, md: 0 }}
					justify={'flex-end'}
					align="center"
					direction={'row'}>
					<Flex
						display={{ sm: 'none', md: 'flex' }}
						align="center"
						gap={2}>
						<WalletMenu />
						<Box>
							<Link href={'/faucet'}>
								<Button variant={'ghost'} fontSize="sm">
									Faucet 💰
								</Button>
							</Link>
						</Box>
						<ConnectButton />
					</Flex>
				</Stack>
			</Flex>
			<Collapse in={isOpen} animateOpacity>
				<MobileNav />
			</Collapse>
		</>
	);
};

const MenuOption = ({ href, title, disabled = false, size = 'sm' }) => {
	return (
		<Box height={'100%'} pt={1} px={2}>
			<Link href={href}>
				<Tooltip
					isDisabled={!disabled}
					hasArrow
					label="Coming Soon"
					bg="white"
					color={'gray.800'}>
					<Button
						variant={'unstyled'}
						disabled={disabled}
						size={size}
						fontSize="sm">
						{title}
					</Button>
				</Tooltip>
			</Link>
		</Box>
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

const DesktopNav = () => {
	const linkColor = useColorModeValue('gray.600', 'gray.200');
	const linkHoverColor = useColorModeValue('gray.800', 'white');
	const popoverContentBgColor = useColorModeValue('white', 'gray.800');

	return (
		<Stack direction={'row'} spacing={2} align="center" mt={1}>
			<MenuOption href={'/trade'} title={'Spot'} />
			<MenuOption href={'/'} title={'Margin'} disabled={true} />
			<MenuOption href={'/'} title={'Perpetuals'} disabled={true} />
			<MenuOption href={'/'} title={'Options'} disabled={true} />
		</Stack>
	);
};

const MobileNav = () => {
	return (
		<Stack
			bg={useColorModeValue('white', 'gray.800')}
			p={4}
			display={{ md: 'none' }}>
			<MenuOption href={'/trade'} title={'Spot'} />
			<MenuOption href={'/'} title={'Margin'} disabled={true} />
			<MenuOption href={'/'} title={'Perpetuals'} disabled={true} />
			<MenuOption href={'/'} title={'Options'} disabled={true} />
			<MenuOption href={'/faucet'} title={'💰 Faucet'} />
			<MenuOption href={'/deposit'} title={'Deposit'} />
			<MenuOption href={'/withdraw'} title={'Withdraw'} />
			<MenuOption href={'/portfolio'} title={'Portfolio'} />
			<Box width={'100%'}>
				<ConnectButton />
			</Box>
		</Stack>
	);
};

Header.defaultProps = {
	title: 'zexe',
};
