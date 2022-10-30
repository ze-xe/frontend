import { Flex, Heading } from '@chakra-ui/react'

export const Header = ({ title }: { title: string }) => (
  <Flex
    // justifyContent="center"
    // alignItems="center"
    bgGradient="linear(to-b, gray.800, black)"
    // color={"white"}
    p={4}
    px={6}
  >
    <Heading fontSize="2vw" >{title}</Heading>
  </Flex>
)

Header.defaultProps = {
  title: 'zexe',
}
