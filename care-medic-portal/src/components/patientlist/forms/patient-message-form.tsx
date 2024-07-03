import useMessages from '@hooks/use-messages'
import {
  Button,
  Group,
  TextInput,
  Textarea,
  createStyles,
  useMantineTheme,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { FormObject, IFormValues } from '@types'
import { IconMail } from '@tabler/icons-react'

interface IProps {
  formObject: FormObject
}

const PatientMessageForm = ({ formObject }: IProps) => {
  //
  const { sendMessage, sendMessageToUserLoading } = useMessages()

  const { classes } = useStyles()
  const theme = useMantineTheme()
  const form = useForm<IFormValues>({
    initialValues: {
      ...formObject,
      message: '',
      subject: '',
    },
    validate: {
      message: (message) =>
        message.length < 2 ? 'You must enter a message ' : null,
      subject: (subject) =>
        subject.length < 2 ? 'You must enter a message subject' : null,
    },
  })

  const handleSubmit = async () => {
    await sendMessage(form.values)
    form.reset()
  }

  return (
    <form onSubmit={form.onSubmit(() => handleSubmit())}>
      <TextInput
        my={theme.spacing.xs}
        value={form.values.subject}
        radius="md"
        variant="filled"
        classNames={{ input: classes.borderForInput }}
        label="Subject"
        placeholder="Message subject"
        {...form.getInputProps('subject')}
      />
      <Textarea
        my={theme.spacing.xs}
        value={form.values.message}
        classNames={{ input: classes.input }}
        aria-label="Textarea for a message sent to the patient"
        radius="md"
        label="Message"
        variant="filled"
        placeholder="Your message"
        {...form.getInputProps('message')}
      />
      <Group position="right">
        <Button
          loading={sendMessageToUserLoading}
          type="submit"
          leftIcon={<IconMail />}
          my="md"
          radius="md"
          size="sm"
        >
          Send message
        </Button>
      </Group>
    </form>
  )
}
const useStyles = createStyles((theme) => ({
  input: {
    height: 125,
    border: '2px solid #e0e0e0',
  },
  borderForInput: {
    border: '2px solid #e0e0e0',
  },
}))
export default PatientMessageForm

{
  /* <TitleWithInfo
title="Patient message"
label="Send a message to a patient"
/> */
}
