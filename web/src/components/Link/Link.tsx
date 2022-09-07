import { Link as CHLink } from '@chakra-ui/react'
import type { LinkProps as CHLinkProps } from '@chakra-ui/react'

import { Link as RWLink, routes } from '@redwoodjs/router'

export interface LinkProps extends CHLinkProps {
  to: string
}

/**
 * Combines the [RedwoodJS](https://redwoodjs.com/docs/router#link-and-named-route-functionsc) and [Chakra UI](https://v1.chakra-ui.com/docs/components/navigation/link) `<Link>` components.
 *
 * @example
 * import Link, { routes } from from 'src/components/Link'
 *
 * const MyPage = () => {
 *   return (
 *     <Link color="blue.500" to={routes.home()}>Click me!</Link>
 *   )
 * }
 */
const Link = (p: LinkProps) => {
  return <CHLink as={RWLink} {...p} />
}

Link.defaultProps = {
  color: 'teal.500',
}

export default Link
export { routes }
