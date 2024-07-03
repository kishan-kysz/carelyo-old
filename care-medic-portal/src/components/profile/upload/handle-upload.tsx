import { useState } from 'react'
import {
  Box,
  Button,
  Center,
  FileInput,
  Group,
  Paper,
  Progress,
  Stepper,
} from '@mantine/core'
import { AiFillPicture } from 'react-icons/ai'
import ImageCropper from './image-cropper'
import NextImage from 'next/image'
import useProfile from '@hooks/use-profile'
import { showNotification } from '@mantine/notifications'

export default function HandleImage({ toggle }: { toggle: () => void }) {
  const [active, setActive] = useState(0)
  const [highestStepVisited, setHighestStepVisited] = useState(active)
  const [image, setImage] = useState<File>()
  const [croppedImage, setCroppedImage] = useState<string>()
  const [progress, setProgress] = useState(0)
  const { upload, user } = useProfile()
  const handleStepChange = async (nextStep: number) => {
    const isOutOfBounds = nextStep > 2 || nextStep < 0
    if (isOutOfBounds) {
      return
    }
    setActive(nextStep)
    setHighestStepVisited((hSC) => Math.max(hSC, nextStep))
  }

  const handleUpload = async () => {
    const file = await fetch(croppedImage)
      .then((r) => r.blob())
      .then(
        (blobFile) =>
          new File([blobFile], `${user.firstName}+${user.referralCode}.png`, {
            type: 'image/png',
          }),
      )
    return upload(
      {
        data: file,
        setProgress,
      },
      {
        onSuccess: () => {
          showNotification({
            title: 'Sucess!',
            message: 'Profile Picture Updated',
          })
          toggle()
        },
        onError: () => {
          showNotification({
            title: 'Error!',
            message: 'Something went wrong',
            color: 'red',
          })
          toggle()
        },
      },
    )
  }

  const onCropDone = (imgCroppedArea) => {
    const canvasEle = document.createElement('canvas')
    canvasEle.width = imgCroppedArea.width
    canvasEle.height = imgCroppedArea.height

    const context = canvasEle.getContext('2d')
    let imageObj1 = new Image()
    imageObj1.src = URL.createObjectURL(image)
    imageObj1.onload = function () {
      context.drawImage(
        imageObj1,
        imgCroppedArea.x,
        imgCroppedArea.y,
        imgCroppedArea.width,
        imgCroppedArea.height,
        0,
        0,
        imgCroppedArea.width,
        imgCroppedArea.height,
      )

      const dataURL = canvasEle.toDataURL('image/jpeg')
      setCroppedImage(dataURL)
      handleStepChange(active + 1)
    }
  }

  const disabledNext =
    (active === 0 && !image) || (active === 1 && !croppedImage)
  // Allow the user to freely go back and forth between visited steps.
  const shouldAllowSelectStep = (step: number) =>
    highestStepVisited >= step && active !== step
  const imageUrl = image ? URL.createObjectURL(image) : ''
  return (
    <>
      <Stepper active={active} onStepClick={setActive} breakpoint="sm">
        <Stepper.Step
          label="Upload"
          description="Upload an image"
          allowStepSelect={shouldAllowSelectStep(0)}
        >
          <FileInput
            placeholder="Pick profile picture"
            label="Profile picture"
            accept="image/jpeg,image/png"
            icon={<AiFillPicture size={14} />}
            mb={20}
            value={image}
            onChange={setImage}
          />
        </Stepper.Step>
        <Stepper.Step
          label="Crop Image"
          description="Crop the image"
          allowStepSelect={shouldAllowSelectStep(1)}
        >
          <Box
            sx={{
              height: '50vh',
            }}
          >
            <ImageCropper
              image={imageUrl}
              onCropDone={onCropDone}
              onCropCancel={() => {
                showNotification({
                  id: 'drop-cancel',
                  title: 'Error!',
                  message: 'Something went wrong',
                  color: 'red',
                })
              }}
            />
          </Box>
        </Stepper.Step>
        <Stepper.Step
          label="Final step"
          description="Preview and save"
          allowStepSelect={shouldAllowSelectStep(2)}
        >
          <Center>
            <Paper shadow="lg" withBorder p="lg">
              <NextImage
                src={croppedImage}
                alt="Logo"
                width={200}
                height={200}
              />
            </Paper>
          </Center>
          <Progress value={progress} striped animate />
        </Stepper.Step>
      </Stepper>

      <Group position="center" mt="xl">
        <Button variant="default" onClick={() => handleStepChange(active - 1)}>
          Back
        </Button>
        <Button
          disabled={disabledNext}
          onClick={() =>
            active <= 1 ? handleStepChange(active + 1) : handleUpload()
          }
        >
          {active <= 1 ? 'Next' : 'Upload'}
        </Button>
      </Group>
    </>
  )
}
