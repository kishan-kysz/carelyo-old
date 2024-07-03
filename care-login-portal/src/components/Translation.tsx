import { SetStateAction, useState } from 'react'
import { createStyles, Group, Image, Menu, UnstyledButton } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import i18n from 'i18next'
import langFlag from './Icons/header/flags'

const Translation = () => {
  const { t, ready } = useTranslation(['default'])
  if (!ready) {
    return
  }

  const languages = [
    {
      value: 'Za',
      title: t('translation.languages.afrikaans'),
      name: 'Za',
      iconFlag: langFlag.afrikaans
    },
    {
      value: 'Gh',
      title: t('translation.languages.akan'),
      name: 'Gh',
      iconFlag: langFlag.akan
    },
    {
      value: 'De',
      title: t('translation.languages.german'),
      name: 'De',
      iconFlag: langFlag.german
    },
    {
      value: 'En',
      title: t('translation.languages.english'),
      name: 'En',
      iconFlag: langFlag.english
    },
    {
      value: 'Es',
      title: t('translation.languages.spanish'),
      name: 'Es',
      iconFlag: langFlag.spanish
    },
    {
      value: 'Fr',
      title: t('translation.languages.french'),
      name: 'Fr',
      iconFlag: langFlag.french
    },
    {
      value: 'Pt',
      title: t('translation.languages.portuguese'),
      name: 'Pt',
      iconFlag: langFlag.portuguese
    },
    {
      value: 'Sw',
      title: t('translation.languages.swahili'),
      name: 'Sw',
      iconFlag: langFlag.swahili
    },
    {
      value: 'Sv',
      title: t('translation.languages.swedish'),
      name: 'Sv',
      iconFlag: langFlag.swedish
    },
    {
      value: 'Ig',
      title: t('translation.languages.igbo'),
      name: 'Ig',
      iconFlag: langFlag.nigerian
    },
    {
      value: 'Yo',
      title: t('translation.languages.yoruba'),
      name: 'Yo',
      iconFlag: langFlag.nigerian
    },
    {
      value: 'Ha',
      title: t('translation.languages.hausa'),
      name: 'Ha',
      iconFlag: langFlag.nigerian
    }
  ]

  const [opened, setOpened] = useState<boolean>(false)
  const { classes } = useStyles()
  const currentLanguage = localStorage.getItem('i18nextLng')
  const currentLanguageObject = languages.find(
    (languages) =>
      languages.value.toLocaleLowerCase() ===
      currentLanguage?.toLocaleLowerCase()
  )
  const currentIconFlag = currentLanguageObject?.iconFlag
  const [flagOfLanguage, setFlagOfLanguage] = useState(currentIconFlag)

  const handleLanguageChange = (l: {
    iconFlag: SetStateAction<string | undefined>
    value: string | undefined
  }) => {
    setFlagOfLanguage(l.iconFlag)
    i18n.changeLanguage(l.value).then((r) => r)
  }
  return (
    <div
      style={{ position: 'fixed', top: '.5rem', right: '1rem', zIndex: 999 }}
    >
      <Menu
        onOpen={() => setOpened(true)}
        onClose={() => setOpened(false)}
        radius='md'
      >
        <Menu.Target>
          <UnstyledButton className={classes.control}>
            <Group spacing='xs'>
              <Image src={flagOfLanguage} width={22} height={22} />
              <span className={classes.label}>{currentLanguage}</span>
            </Group>
            {/* <IconChevronDown size={16} className={classes.icon} stroke={1.5} /> */}
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          {languages.map((l) => (
            <Menu.Item
              key={l.value}
              icon={<Image src={l.iconFlag} width={18} height={18} />}
              value={l.value}
              onClick={() => handleLanguageChange(l)}
              onKeyDown={() => handleLanguageChange(l)}
            >
              {l.title}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    </div>
  )
}

export default Translation

const useStyles = createStyles((theme) => ({
  control: {
    padding: '2px 5px',
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'background-color 150ms ease',
    borderRadius: theme.radius.sm,
    cursor: 'pointer',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[5]
          : theme.colors.gray[1]
    }
  },

  label: {
    fontWeight: 700,
    fontSize: theme.fontSizes.sm
  },

  icon: {
    marginLeft: '2px',
    transition: 'transform 150ms ease',
    // transform: opened ? 'rotate(180deg)' : 'rotate(0deg)',
    fontSize: theme.fontSizes.sm,
    fontWeight: 700
  }
}))
