import { Button, Image, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'
import { Autoplay, Keyboard, Navigation, Pagination } from 'swiper/modules'

export default function ImageList({ images }: { images: string[] }) {
  const [isOpen, { toggle, close }] = useDisclosure(false)

  return (
    <>
      <Button fullWidth onClick={toggle} color="#10751c" fw={700}>
        See Patient&apos;s Uploaded Images
      </Button>
      <Modal
        opened={isOpen}
        onClose={close}
        centered
        title="Images submitted by patient"
        padding="xl"
        size="xl"
      >
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          keyboard={{
            enabled: true,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Keyboard, Pagination, Autoplay, Navigation]}
          className="mySwiper"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                }}
              >
                <Image
                  src={image}
                  alt={`Image ${index + 1} from patient`}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Modal>
    </>
  )
}
