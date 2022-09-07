import { FormLabel, FormLabelProps } from '@chakra-ui/react'

import { Label as RWLabel } from '@redwoodjs/forms'

import { useFieldName } from 'src/components/Forms'

export interface LabelProps extends FormLabelProps {
  name?: string
}

/**
 * Chakra UI's {@link FormLabel} component, with RedwoodJS' {@link RWLabel Label} component provided to the `as` prop. This component's `name` prop will be automatically provided when used within a {@link Field} component.
 */
const Label = (p: LabelProps) => {
  const name = useFieldName()
  return <FormLabel name={name} {...p} />
}

Label.defaultProps = {
  as: RWLabel,
}

export default Label
