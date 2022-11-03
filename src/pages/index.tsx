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
} from '@chakra-ui/react'
import { CheckCircleIcon, LinkIcon } from '@chakra-ui/icons'

import { Hero } from '../components/Hero'
import { Container } from '../components/Container'
import { Main } from '../components/Main'
import { DarkModeSwitch } from '../components/DarkModeSwitch'
import { CTA } from '../components/CTA'
import { Footer } from '../components/Footer'
import { useColorMode } from '@chakra-ui/react';
import { useEffect }  from 'react';
const Index = () => {
  const {colorMode, toggleColorMode} = useColorMode();
  
  return <Container>
    <Hero />
    <Main >
      <Flex justify="center" gap={1} mt={0}>
      <Text  fontSize={"lg"}  color={ colorMode == 'light' ? 'gray.800' : "gray.400"} fontWeight={"bold"} mb={5} textAlign={"center"}>
        Advanced limit-order trading platform on TRON 
      </Text>
        <Image src="https://cdn.worldvectorlogo.com/logos/tron.svg" height={25} width={25} />
      </Flex>
      {/* <Image src="/assets/cyborg.png" height={400} width={700}  alt="none" /> */}
      {/* <Button display={"flex"} gap="1" variant={'outline'} disabled><Text>Try Now</Text> <Text fontSize={"10px"}>Coming Soon</Text> </Button> */}

      
    </Main>

    <DarkModeSwitch />
    <Footer>
      {/* <Text color={"gray.500"}>hello@chainscore.finance</Text> */}
    </Footer>
    {/* <CTA /> */}
  </Container>
}

export default Index
