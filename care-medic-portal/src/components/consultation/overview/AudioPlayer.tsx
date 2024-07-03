import { useEffect, useRef, useState } from 'react'
import {
  Button,
  Group,
  Slider,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core'
import {
  IconPlayerPause,
  IconPlayerPlay,
  IconVolume,
  IconVolumeOff,
} from '@tabler/icons-react'

interface AudioPlayerProps {
  audio: string
}

const base64Regex =
  /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/
const AudioPlayer = ({ audio }: AudioPlayerProps) => {
  const [src, setSrc] = useState<string>('')
  const audioRef = useRef<HTMLAudioElement>(null)
  const [duration, setDuration] = useState<number>(1)
  const [currentTime, setCurrentTime] = useState<number>(0)

  useEffect(() => {
    if (!audio) return
    if (!base64Regex.test(audio)) return

    const binaryData = Buffer.from(audio, 'base64').toString('binary')
    const byteArray = new Uint8Array(binaryData.length)
    for (let i = 0; i < binaryData.length; i++) {
      byteArray[i] = binaryData.charCodeAt(i)
    }
    const blob = new Blob([byteArray], { type: 'audio/mpeg' })
    const player = new Audio(URL.createObjectURL(blob))
    audioRef.current = player
    setSrc(player.src)

    player.addEventListener('loadedmetadata', () => {
      if (player.duration === Infinity) return
      setDuration(player.duration)
    })

    player.addEventListener('timeupdate', () => {
      setCurrentTime(player.currentTime)
    })

    player.addEventListener('ended', () => {
      setIsPlaying(false)
    })

    return () => {
      URL.revokeObjectURL(player.src)
      player.removeEventListener('loadedmetadata', () => {})
      player.removeEventListener('timeupdate', () => {})
      player.removeEventListener('ended', () => {})
    }
  }, [audio])

  const [isPlaying, setIsPlaying] = useState(false)
  const [muted, setMuted] = useState(false)

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted
      setMuted(!muted)
    }
  }

  const handleSeek = (val: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Number(val)
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }
  const theme = useMantineTheme()

  return audio && audioRef.current ? (
    <Stack
      my="lg"
      p="xs"
      style={{ border: '1px solid rgba(0, 0, 0, 0.1)', padding: '10px' }}
    >
      <Stack>
        <Text>Patient Voice Note</Text>
        <Group position="apart">
          <Text size="sm" color="gray">
            {formatTime(currentTime)}
          </Text>
          <Slider
            sx={{ flexGrow: 1 }}
            color={muted ? 'red.5' : isPlaying ? 'teal' : '#10751c'}
            value={currentTime}
            onChange={handleSeek}
          />
          {duration && (
            <Text size="sm" color="gray">
              {formatTime(duration)}
            </Text>
          )}
        </Group>
      </Stack>
      <Group position="center">
        <Button size="md" onClick={togglePlay} color="#10751c">
          {isPlaying ? <IconPlayerPause /> : <IconPlayerPlay />}
        </Button>
        <Button size="md" onClick={toggleMute} color="gray.4">
          {muted ? (
            <IconVolumeOff color={theme.colors.red[7]} />
          ) : (
            <IconVolume color={theme.colors.dark[5]} />
          )}
        </Button>
      </Group>

      <audio src={src} ref={audioRef} onEnded={() => setIsPlaying(false)} />
    </Stack>
  ) : (
    <Text align="center" size="lg">
      No Patient Voice Note
    </Text>
  )
}

export default AudioPlayer
