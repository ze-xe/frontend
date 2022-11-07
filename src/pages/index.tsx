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
import { CheckCircleIcon, LinkIcon } from '@chakra-ui/icons';

import { Hero } from '../components/Hero';
import { Container } from '../components/Container';
import { Main } from '../components/Main';
import { DarkModeSwitch } from '../components/DarkModeSwitch';
import { CTA } from '../components/CTA';
import { Footer } from '../components/Footer';
import { useColorMode } from '@chakra-ui/react';
import { useEffect } from 'react';
import Link from 'next/link';

const Index = () => {
	const { colorMode, toggleColorMode } = useColorMode();

	return (
		<Flex flexDir='column' justify='space-between'>
      <Box>
        
      
			<Hero title="zexe" />
			<Flex flexDir={'column'}>
				<Flex justify="center" gap={1} mt={5}>
					<Text
						fontSize={'lg'}
						color={colorMode == 'light' ? 'gray.800' : 'gray.400'}
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

				<Flex gap={2} justify="center" mt={5}>
					<Link href={'/trade'}>
						<Button size={'lg'}>Trade Now</Button>
					</Link>
					<Link href={'/'}>
						<Button size={'lg'} variant={'outline'}>
							Learn More
						</Button>
					</Link>
				</Flex>
				{/* <Image src="/assets/cyborg.png" height={400} width={700}  alt="none" /> */}
				{/* <Button display={"flex"} gap="1" variant={'outline'} disabled><Text>Try Now</Text> <Text fontSize={"10px"}>Coming Soon</Text> </Button> */}
			<Footer />
			</Flex>

      </Box>
		</Flex>
	);
};

export default Index;
