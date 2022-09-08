import { useCallback } from 'react'

import { useMutation } from '@apollo/client'
import type {
  FetchResult,
  MutationFunctionOptions,
  MutationHookOptions,
  MutationResult,
} from '@apollo/client'
import { useToast } from '@chakra-ui/react'
import type { UseToastOptions } from '@chakra-ui/react'
import type { DocumentNode } from 'graphql/language/ast'

interface ToastMessages<Data = object> {
  error?: UseToastOptions | ((err: Error) => UseToastOptions)
  loading: UseToastOptions
  success: UseToastOptions | ((data: FetchResult<Data>) => UseToastOptions)
}

type UseToastTuple<Data = object, Variables = object> = [
  (
    variables: Variables,
    messages: ToastMessages<Data>,
    opts?: MutationFunctionOptions<Data>
  ) => Promise<void>,
  MutationResult<Data>
]

/**
 * Combines the {@link useMutation} hook from [the Apollo client](https://www.apollographql.com/docs/react/) with the {@link useToast} hook [from Chakra UI](https://chakra-ui.com/docs/components/toast/usage), automatically displaying a toast depending on the state of the mutation's promise. That is to say, it will display an `info` toast while loading, a `success` toast after resolution, and an `error` if the promise rejects.
 *
 * @example
 * import useToastMutation from 'src/hooks/useToastMutation'
 *
 * const MUTATION = gql`...`
 *
 * const MyPage = () => {
 *   const [mutate] = useToastMutation(MUTATION)
 *
 *   return (
 *     <button
 *       onClick={() => mutate(
 *         { input: { ... } },
 *         {
 *           loading: { title: 'Loading mutation!' },
 *           success: { title: 'Mutated successfully!' }
 *         }
 *       )}
 *     >
 *       Click me!
 *     </button>
 *   )
 * }
 */
const useToastMutation = <Data = object, Variables = object>(
  mutation: DocumentNode,
  opts?: MutationHookOptions<Data, Variables>
): UseToastTuple<Data, Variables> => {
  const [m, res] = useMutation<Data, Variables>(mutation, opts)

  const toast = useToast()

  const mutate = useCallback(
    async (
      variables: Variables,
      messages: ToastMessages<Data>,
      opts: MutationFunctionOptions<Data, Variables> = {}
    ) => {
      const toastId = toast({ status: 'info', ...messages.loading })

      try {
        const data = await m({ ...opts, variables })

        toast.close(toastId)

        toast({
          status: 'success',
          ...(typeof messages.success === 'function'
            ? messages.success(data)
            : messages.success),
        })
      } catch (err) {
        toast.close(toastId)

        toast({
          status: 'error',
          ...(typeof messages.error === 'undefined'
            ? { title: 'An error occured.', description: err.message }
            : typeof messages.error === 'function'
            ? messages.error(err)
            : messages.error),
        })
      }
    },
    [m, toast]
  )

  return [mutate, res]
}

export default useToastMutation
