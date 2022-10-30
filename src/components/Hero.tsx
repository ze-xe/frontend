import { Flex, Heading } from '@chakra-ui/react'
import Image from 'next/image'

export const Hero = ({ title }: { title: string }) => (
<>
  <Flex
  flexDir={"column"}
    justifyContent="center"
    alignItems="center"
    align={"center"}
    // height="100vh"
    mt={40}
    bgGradient="linear(to-r, #E11860, #CB1DC3, #03ACDF)"
    bgClip="text"
    >
  {/* <Image src="/assets/zexe-text.png" width={500} height={500}  alt="none" style={{borderRadius: 0}} /> */}
  <Heading fontSize="10vw" mt={-10} textShadow={"6px 4px #fff"}>{title}</Heading>

  </Flex>
    </>
)

Hero.defaultProps = {
  title: 'zexe',
}
