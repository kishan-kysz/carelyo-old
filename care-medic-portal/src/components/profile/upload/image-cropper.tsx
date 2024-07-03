import { Button, Group, Stack, Text } from '@mantine/core'
import { useState } from 'react'
import Cropper from 'react-easy-crop'

function ImageCropper({ image, onCropDone, onCropCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedArea, setCroppedArea] = useState(null)
  const [aspectRatio, setAspectRatio] = useState(1 / 1)

  const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels)
  }

  return (
    <Stack>
      <Cropper
        image={image}
        aspect={aspectRatio}
        crop={crop}
        zoom={zoom}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
        style={{
          containerStyle: {
            width: '100%',
            height: '80%',
            backgroundColor: '#fff',
          },
        }}
      />
      <Text>Hello</Text>
      <Group
        className="action-btns"
        sx={{ position: 'absolute', bottom: '21%', left: '42%' }}
      >
        <Button
          onClick={() => {
            onCropDone(croppedArea)
          }}
        >
          Crop
        </Button>
      </Group>
    </Stack>
  )
}

export default ImageCropper
