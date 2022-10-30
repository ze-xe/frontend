import { Flex, Heading, useColorMode } from '@chakra-ui/react'
import Image from 'next/image'

export const Hero = ({ title }: { title: string }) => {
  const color = useColorMode();

return <>
  <Flex
  flexDir={"column"}
    justifyContent="center"
    alignItems="center"
    align={"center"}
    // height="100vh"
    mt={60}
    bgGradient="linear(to-r, #E11860, #CB1DC3, #03ACDF)"
    bgClip="text"
    >
  {/* <Image src="/assets/zexe-text.png" width={500} height={500}  alt="none" style={{borderRadius: 0}} /> */}
  <Heading fontSize="200px" mt={-10} textShadow={"6px 3px " + (color.colorMode == 'light' ? '#222222' : '#fff')}>{title}</Heading>

  </Flex>
    </>
}

Hero.defaultProps = {
  title: 'zexe',
}
