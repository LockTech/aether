import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'

import { FormControl, FormErrorMessage } from '@chakra-ui/react'

import { FieldError, useFormState } from '@redwoodjs/forms'

export interface FieldProps {
  children: ReactNode
  disabled?: boolean
  invalid?: boolean
  name: string
  readonly?: boolean
  required?: boolean
}

const FieldNameContext = createContext<string>(undefined)

/**
 * @returns The `name` of the {@link Field} who is a parent of the component this hook was called in.
 */
export const useFieldName = () => useContext(FieldNameContext)

/**
 * Combines Chakra UI and RedwoodJS form components, providing support for signifying a {@link FormControl} is invalid — syncing it with [React Hook Form's validation functionality](https://react-hook-form.com/get-started#applyvalidation). This component will also take care of providing a {@link FieldError} component, used to display validation error-messages.
 *
 * Pass-through props have been added to manually control the `invalid` state, as well as for signifying the field as being `disabled`, `readonly`, and `required`.
 *
 * The provided `name` prop will be automatically passed to children {@link Input} and {@link Label} components. This value can be subscribed to from within custom components via the {@link useFieldName} hook — exported alongside this component.
 *
 * @example
 * import { Form } from '@redwoodjs/forms'
 *
 * import { Field, Input, Label, Submit } from 'src/components/Forms'
 *
 * const MyPage = () => {
 *   return (
 *     <Form required>
 *       <Field name="foobar">
 *         <Label>Foo Bar</Label>
 *         <Input
 *           placeholder="Some random foo-bar text"
 *           validation={{ ... }}
 *         />
 *       </Field>
 *     <Form>
 *   )
 * }
 */
const Field = ({
  children,
  disabled,
  invalid,
  name,
  readonly,
  required,
}: FieldProps) => {
  const { errors } = useFormState({ name })

  return (
    <FieldNameContext.Provider key={name} value={name}>
      <FormControl
        isDisabled={disabled}
        isInvalid={invalid || typeof errors[name] === 'object'}
        isReadOnly={readonly}
        isRequired={required}
      >
        {children}
        <FormErrorMessage>
          <FieldError name={name} />
        </FormErrorMessage>
      </FormControl>
    </FieldNameContext.Provider>
  )
}

export default Field
