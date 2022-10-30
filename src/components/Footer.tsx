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


export const Footer = (props: FlexProps) => (
  <Flex gap={5} position={"absolute"} bottom="0" mb={10}>


          <ChakraLink
            isExternal
            href="https://github.com/ze-xe"
            flexGrow={1}
            mr={2}
          >
            Github <LinkIcon />
          </ChakraLink>

          <ChakraLink isExternal href="https://nextjs.org" flexGrow={1} mr={2}>
            Twitter <LinkIcon />
          </ChakraLink>

          <ChakraLink isExternal href="https://nextjs.org" flexGrow={1} mr={2}>
            Discord <LinkIcon />
          </ChakraLink>

  </Flex>
)
