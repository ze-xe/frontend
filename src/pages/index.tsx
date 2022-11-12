import {
	Link as ChakraLink,
	Text,
	Code,
	List,
	ListIcon,
	Image,
	ListItem,
	Flex,
	Button,
	Box,
	Divider,
} from '@chakra-ui/react';

import { Footer } from '../components/Footer';
import { useColorMode } from '@chakra-ui/react';
import Link from 'next/link';
import Head from 'next/head';
import { BsCurrencyExchange } from 'react-icons/bs';
import { RiExchangeFundsFill } from 'react-icons/ri';
import { GiBank, GiCardExchange } from 'react-icons/gi';

import { Tweet } from 'react-twitter-widgets';
import theme from '../theme';

const Index = () => {
	const { colorMode, toggleColorMode } = useColorMode();

	const featuresTitle = {
		fontSize: 'xl',
		fontWeight: 'bold',
		mt: 2,
	};

	const featuresText = {
		fontSize: 'sm',
	};

	const featuresIcon = {
		size: '25',
	};

	return (
		<>
			<Head>
				<title>
					ZEXE: Advanced limit-order trading platform on TRON
				</title>
				<link rel="icon" type="image/x-icon" href="/favicon.png"></link>
			</Head>

			<Flex
				flexDir="column"
				bgColor={'#09001F'}
				height="100vh"
				// justify={'center'}
				pt={'8%'}
				bgImage="/round.png"
				bgRepeat={'no-repeat'}
				bgPosition={{ sm: '70vw 40vh', md: '70vw -160px' }}
				bgSize={{ sm: '600px', md: 'contain' }}>
				<Box maxW={'1200px'} ml={'10%'}>
					<Box
						style={{
							backgroundColor: '#F60DC9',
							// backgroundImage:
							// 	'linear-gradient(45deg, black 25%, transparent 25%, transparent 75%, #F60DC9 75%, #F60DC9), linear-gradient(45deg, #F60DC9 25%, transparent 25%, transparent 75%, black 75%, #F60DC9), linear-gradient(to bottom, rgb(8, 8, 8), #F60DC9)',
							// backgroundSize: '10px 10px, 10px 10px, 10px 5px',
							// backgroundPosition: '0px 0px, 5px 5px, 0px 0px',
						}}
						bgClip="text">
						<Text
							fontFamily={'Zen Dots'}
							fontSize={{ sm: '100px', md: '180px' }}
							// fontWeight='bold'
							>
							zexe
						</Text>
					</Box>
					<Flex
					mt={0}
					>
						<Text
							fontSize={'lg'}
							fontWeight={'bold'}
							textAlign={'center'}>
							Professional trading platform on-chain: Transparent.
							Secure. Better
						</Text>
						{/* <Image
							src="https://cdn.worldvectorlogo.com/logos/tron.svg"
							height={25}
							width={25}
						/> */}
					</Flex>

					<Flex my={10} height="90px" wrap={'wrap'}>
						<Box w={'200px'}>
							<BsCurrencyExchange {...featuresIcon} />
							<Text {...featuresTitle}>Spot Trading</Text>
							<Text {...featuresText}>
								Market and limit orders with stop losses
							</Text>
						</Box>

						<Divider
							orientation="vertical"
							borderColor={'#fff'}
							mx={4}
						/>

						<Box w={'200px'}>
							<RiExchangeFundsFill {...featuresIcon} />
							<Text {...featuresTitle}>Margin and Futures</Text>
							<Text {...featuresText}>
								With upto 10x leverage
							</Text>
						</Box>

						<Divider
							orientation="vertical"
							borderColor={'#fff'}
							mx={4}
						/>

						<Box w={'200px'}>
							<GiCardExchange {...featuresIcon} />
							<Text {...featuresTitle}>Perpetuals</Text>
							<Text {...featuresText}>
								Take advantage of upswings in the market
							</Text>
						</Box>

						<Divider
							orientation="vertical"
							borderColor={'#fff'}
							mx={4}
						/>

						<Box w={'200px'}>
							<GiBank {...featuresIcon} />
							<Text {...featuresTitle}>Option Calls</Text>
							<Text {...featuresText}>
								Buy puts or calls on tokens
							</Text>
						</Box>
					</Flex>

					<Flex gap={2} mt={20}>
						<Link href={'/trade'}>
							<Button size={'lg'} bgColor="#fff" color={'black'}>
								Trade Now
							</Button>
						</Link>
						<Link
							href={
								'https://drive.google.com/file/d/1j2sCnlfbsgolGQDeXib6GoBhdCdIY5dF/view?usp=sharing'
							}
							target="_blank">
							<Button size={'lg'} variant={'outline'}>
								Learn More
							</Button>
						</Link>
					</Flex>
				</Box>

				{/* <Image src="/assets/cyborg.png" height={400} width={700}  alt="none" /> */}
				{/* <Button display={"flex"} gap="1" variant={'outline'} disabled><Text>Try Now</Text> <Text fontSize={"10px"}>Coming Soon</Text> </Button> */}
				<Footer />
			</Flex>
		</>
	);
};

export default Index;
