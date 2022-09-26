import { Select as CSelect } from '@chakra-ui/react'
import type { SelectProps as CSelectProps } from '@chakra-ui/react'

import { useController } from '@redwoodjs/forms'
import type { RegisterOptions } from '@redwoodjs/forms'

import { useFieldName } from 'src/components/Forms'

export interface SelectProps extends CSelectProps {
  defaultValue?: string
  name?: string
  validation?: RegisterOptions
}

const Select = ({
  defaultValue,
  name: propName,
  validation: rules,
  ...p
}: SelectProps) => {
  const fieldName = useFieldName()

  const { field } = useController({
    defaultValue,
    name: fieldName || propName,
    rules,
  })

  return <CSelect {...field} {...p} />
}

export default Select
