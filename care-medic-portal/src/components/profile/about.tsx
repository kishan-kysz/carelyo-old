import {
  Anchor,
  Box,
  Divider,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
} from '@mantine/core'
import { IProfile } from '@types'
import ProfilePanel from './profile-panel'
import { utcToLocal } from '@utils/helpers'

type InfoTextProps = {
  label: string
  value: string | number
  type?: 'text' | 'email' | 'tel' | 'url'
}

const InfoText = ({ label, value, type }: InfoTextProps) => {
  return (
    <Group w="100%" my="sm">
      <Text size="md" fw={400} color="dark.8" w="30%">
        {label}:
      </Text>
      {type === 'text' ? (
        <Text size="sm" w="55%">
          {value}
        </Text>
      ) : undefined}
      {type === 'email' ? (
        <Anchor href={`mailto:${value}`} size="sm" w="55%">
          {value}
        </Anchor>
      ) : undefined}
      {type === 'tel' ? (
        <Anchor href={`tel:${value}`} size="sm" w="55%">
          {value}
        </Anchor>
      ) : undefined}
      {type === 'url' ? (
        <Anchor w="55%" href={value as string} size="sm">
          {value}
        </Anchor>
      ) : undefined}
    </Group>
  )
}
const BigTitle = ({ title }) => {
  return (
    <Text
      weight={700}
      color="dimmed"
      transform="uppercase"
      sx={{
        fontFamily: 'Inter, sans-serif',
      }}
      fz="sm"
      my="sm"
    >
      {title}
    </Text>
  )
}

export default function About({ user }: { user: IProfile }) {
  const utcTimeDateBirth = user.dateOfBirth
  const birthDate = utcToLocal(utcTimeDateBirth)

  const utcGraduationDate = user.graduationDate
  const graduationDate = utcToLocal(utcGraduationDate)

  return (
    <Paper withBorder radius="md" p="md" mt="xs">
      <Grid gutter="xl" p="sm">
        <Grid.Col md={3} lg={3}>
          <ProfilePanel user={user} />
        </Grid.Col>
        <Grid.Col md={9}>
          <Box mt="xs">
            <BigTitle title="Contact Information" />
            <Divider mt="md" mb="md" />
            <InfoText label="Email" value={user.email} type="email" />
            <InfoText label="Mobile" value={user.mobile} type="tel" />
            <InfoText
              label="Address"
              value={`${user.street}, ${user.streetNumber}`}
              type="text"
            />
            <InfoText label="City" value={user.city} type="text" />
            <InfoText label="State" value={user.state} type="text" />
            <InfoText label="Zip Code" value={user.zipCode} type="text" />
            <InfoText label="Country" value={user.country} type="text" />
            <BigTitle title="Personal Information" />
            <Divider mt="md" mb="md" />
            <InfoText
              label="Date of Birth"
              value={birthDate.slice(0, 10)}
              type="text"
            />
            <InfoText
              label="Gender"
              value={user.gender?.toLocaleUpperCase() || 'Not Specified'}
              type="text"
            />
            <BigTitle title="Education" />
            <Divider mt="md" mb="md" />
            <InfoText label="University" value={user.university} type="text" />
            <InfoText
              label="Graduation Date"
              value={graduationDate.slice(0, 10)}
              type="text"
            />
          </Box>
        </Grid.Col>
      </Grid>
    </Paper>
  )
}
