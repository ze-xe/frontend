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
} from '@chakra-ui/react';

import { Footer } from '../components/Footer';
import { useColorMode } from '@chakra-ui/react';
import Link from 'next/link';
import Head from 'next/head';

const Index = () => {
	const { colorMode, toggleColorMode } = useColorMode();

	return (
		<>
			<Head>
				<title>ZEXE: Advanced limit-order trading platform on TRON</title>
				<link rel="icon" type="image/x-icon" href="/favicon.png"></link>
			</Head>
			<Flex
				flexDir="column"
				bgColor={'#09001F'}
				height="100vh"
				// justify={'center'}
				pt={'10%'}
				
				>
					<Box maxW={'1200px'} ml={'10%'}>

					<Text
					color='#F60DC9'
						fontFamily={'Zen Dots'}
						fontSize="180px"
						>
						zexe
					</Text>
					<Flex>
						<Text
							fontSize={'lg'}
							color={
								colorMode == 'light' ? 'gray.800' : 'gray.400'
							}
							fontWeight={'bold'}
							mb={5}
							textAlign={'center'}>
							Advanced limit-order trading platform on TRON
						</Text>
						<Image
							src="https://cdn.worldvectorlogo.com/logos/tron.svg"
							height={25}
							width={25}
						/>
					</Flex>

					<Flex gap={2} mt={5}>
						<Link href={'/trade'}>
							<Button size={'lg'} bgColor='#fff' color={'black'}>Trade Now</Button>
						</Link>
						<Link href={'/'}>
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
