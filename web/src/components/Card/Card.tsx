import { Box, BoxProps } from '@chakra-ui/react'

const Card = (p: BoxProps) => {
  return (
    <Box
      backgroundColor="gray.50"
      border="1px"
      borderColor="gray.100"
      borderRadius="lg"
      padding="8"
      shadow="sm"
      {...p}
    />
  )
}

export default Card
