import { Box, Flex, FlexProps } from '@chakra-ui/react'
import {
  Link as ChakraLink,
  Text,
  Code,
  List,
  ListIcon,
  Image,
  ListItem,
  Button,
} from '@chakra-ui/react'
import { CheckCircleIcon, LinkIcon } from '@chakra-ui/icons'
import { BsDiscord, BsGithub, BsTwitter } from 'react-icons/bs'


export const Footer = () => (
  <Box position={'fixed'} bottom='0' width={'100%'} bgColor={'gray.800'}>
  <Flex gap={5} justify='center'  minH={8} align='center'>
    <Text textAlign={'center'} my={1} fontSize='sm' color={'gray.400'}>Join the revolution</Text>
          <ChakraLink
            isExternal
            href="https://github.com/ze-xe"
            fontWeight='bold'
          >
            <BsGithub/> 
          </ChakraLink>

          <ChakraLink isExternal href="https://twitter.com/zexeio"
            fontWeight='bold'
            >
            <BsTwitter/> 
          </ChakraLink>

          <ChakraLink
           isExternal
          fontWeight='bold'
            href="https://discord.gg/MdngKExqjv">
            <BsDiscord/> 
          </ChakraLink>

  </Flex>
  </Box>
)
