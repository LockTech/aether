import { Input as CHInput } from '@chakra-ui/react'
import type { InputProps as CHInputProps } from '@chakra-ui/react'

import { TextField } from '@redwoodjs/forms'
import type { InputFieldProps as TextFieldProps } from '@redwoodjs/forms'

import { useFieldName } from 'src/components/Forms'

export interface InputProps
  extends CHInputProps,
    Pick<TextFieldProps, 'validation'> {}

/**
 * Chakra UI's {@link CHInput Input} component with a default `as` prop which uses RedwoodJS' {@link TextField} component. This component's `name` prop will be automatically provided when used within a {@link Field} component.
 *
 * @example
 * import { PasswordField } from '@redwoodjs/forms'
 *
 * import { Input } from 'src/components/Forms'
 *
 * const MyPage = () => {
 *   return (
 *     <>
 *       <Input name="..." validation={{ ... }} />
 *       <Input as={PasswordField} name="..." validation={{ ... }} />
 *     </>
 *   )
 * }
 */
const Input = (p: InputProps) => {
  const name = useFieldName()
  return <CHInput name={name} {...p} />
}

Input.defaultProps = {
  as: TextField,
}

export default Input
