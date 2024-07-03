// form-context.ts file
import { createFormContext } from '@mantine/form'
import { IProfileUpdate } from '@types'

export const [UserFormProvider, useUserFormContext, useUserForm] =
  createFormContext<IProfileUpdate>()
