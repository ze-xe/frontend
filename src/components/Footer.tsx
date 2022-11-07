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


export const Footer = () => (
  <Box position={'fixed'} bottom='0' width={'100%'} >
  <Flex gap={5} justify='center' bgColor={'#F60DC9'} minH={8} align='center'>
          <ChakraLink
            isExternal
            href="https://github.com/ze-xe"
            fontWeight='bold'
          >
            Github 
          </ChakraLink>

          <ChakraLink isExternal href="https://twitter.com/zexeio"
            fontWeight='bold'
            >
            Twitter 
          </ChakraLink>

          <ChakraLink
          //  isExternal
          fontWeight='bold'

            href="#">
            Discord 
          </ChakraLink>

  </Flex>
  </Box>
)
