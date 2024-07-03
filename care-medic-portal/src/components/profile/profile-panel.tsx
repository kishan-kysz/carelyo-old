import {
  Badge,
  Container,
  Group,
  Modal,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core'
import { AccoladeList } from './acccolades'
import { IconAt, IconBuildingHospital, IconPhone } from '@tabler/icons-react'
import { IProfile } from '@types'
import { useDisclosure } from '@mantine/hooks'
import ProfileImage from './upload/image'
import HandleImage from './upload/handle-upload'

// const BigTitle = ({ title }) => {
//   return (
//     <Text
//       weight={700}
//       color="dimmed"
//       transform="uppercase"
//       sx={{
//         fontFamily: "Inter, sans-serif",
//       }}
//       fz="sm"
//       my="sm"
//     >
//       {title}
//     </Text>
//   );
// };
const ProfilePanel = ({ user }: { user: IProfile }) => {
  const [opened, { close, toggle }] = useDisclosure(false)

  return (
    <Container mt={16} p={0}>
      <ProfileImage image={user.avatar} show={toggle} />
      <Stack mt={24} p="sm">
        <Stack spacing={5}>
          <Badge color="teal" size="lg">
            {user.title ? user.title : 'Doctor'}
          </Badge>
          <Text size="xl" align="center">
            {`${user.firstName} ${user.lastName}`}{' '}
          </Text>
        </Stack>
        <Stack>
          <Group position="left" noWrap>
            <ThemeIcon color="teal" variant="light" size="lg" radius="lg">
              <IconBuildingHospital size={20} />
            </ThemeIcon>
            <Text weight={700} color="dark" fz="lg">
              {user.hospital}
            </Text>
          </Group>

          <Group position="left" noWrap spacing={10} mt={3}>
            <ThemeIcon color="teal" variant="light" size="lg" radius="lg">
              <IconAt size={20} />
            </ThemeIcon>
            <Text size="sm" color="dimmed">
              {user.workEmail}
            </Text>
          </Group>

          <Group position="left" noWrap spacing={10} mt={3}>
            <ThemeIcon color="teal" variant="light" size="lg" radius="lg">
              <IconPhone size={20} />
            </ThemeIcon>
            <Text size="sm" color="dimmed">
              {user.workMobile}
            </Text>
          </Group>
          <AccoladeList />
        </Stack>
      </Stack>
      <Modal size="50%" opened={opened} centered={true} onClose={close}>
        <HandleImage toggle={toggle} />
      </Modal>
    </Container>
  )
}

export default ProfilePanel
