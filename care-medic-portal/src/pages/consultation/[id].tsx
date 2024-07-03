import { DailyCall, type DailyEvent } from '@daily-co/daily-js'
import { DailyProvider } from '@daily-co/daily-react'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import VideoCallFrame from '@components/consultation/current/VideoCallFrame'
// import TgboVideoCallFrame from '@components/consultation/current/TgboVideoCallFrame'
import ConsultationTabs from '@components/consultation/current/SideTabs'
import { getAcceptedConsultation } from '@routes'
import { useRouter } from 'next/router'
import {
  Box,
  Button,
  Center,
  Divider,
  Grid,
  Group,
  LoadingOverlay,
  Modal,
  Paper,
  ScrollArea,
  SegmentedControl,
  Stack,
  Title,
  Text,
} from '@mantine/core'
import useNotification from '@hooks/use-notifications'
import { resetSbar } from '@utils/actions'
import { useStateMachine } from 'little-state-machine'
import { type AxiosError } from 'axios'
import SymptomsHandler from '@components/consultation/overview/SymptomsHandler'
import { IconExclamationCircle } from '@tabler/icons-react'
import Summary from '@components/consultation/current/Summary'
import { useDisclosure, useSessionStorage } from '@mantine/hooks'
import AudioPlayer from '@components/consultation/overview/AudioPlayer'
import DetailedDescription from '@components/consultation/overview/DetailedDescription'
import ImageList from '@components/consultation/overview/ImageView'
import Layout from '@components/layout'
import { SbarSummary } from '@components/consultation/overview/SbarSummary'
import DurationTimer from '@components/consultation/duration-timer'
import AnimatedTimer from '@components/consultation/animated-timer'
import useConsultation from '@hooks/use-consultation'
import { Diagnosis } from '@components/consultation/overview/Diagnosis'
import useProfile from '@hooks/use-profile'

interface SymptomsStore {
  type: 'Symptom' | 'relatedSymptom'
  value: string
}
type consultationStatus = 'accepted' | 'stopped' | 'cancelled' | null
export default function ConsultationPage() {
  const router = useRouter()
  const { id } = router.query
  const { user } = useProfile()
  const userName = user?.lastName || 'User'
  type Views = 'overview' | 'notes' | 'symptoms'
  const [comp, setActive] = useState<Views>('overview')
  const [callState, setCallState] = useState<DailyEvent>('loading')
  const [consultationStatus, setConsultationStatus] =
    useSessionStorage<consultationStatus>({
      key: 'consultationStatus',
      defaultValue: null,
    })
  const handlePhysicalConsultation = useCallback(
    (val: consultationStatus) => {
      setConsultationStatus(val)
    },
    [setConsultationStatus],
  )
  useEffect(() => {
    if (router.isReady && !id) {
      void router.push('/')
    }
  }, [id, router])
  const { addNotification, clearNotifications } = useNotification()
  const { state, actions } = useStateMachine({
    resetSbar,
  })
  const { start } = useConsultation()
  const {
    data: acceptedConsultation,
    isLoading,
    error,
    isError,
  } = useQuery(
    ['acceptedConsultation', id],
    () => getAcceptedConsultation(id.toString()),
    {
      onSuccess: (data) => {
        if (data.consultation.status === 'accepted') {
          addNotification({
            message: `Dr. ${userName}. Consultation must begin in 5 minutes or it goes back to the queue.`,
            type: 'success',
          })
        }
      },
      onError: (err: AxiosError) => {
        clearNotifications()
        actions.resetSbar()
        if (err.response.status !== 404) {
          addNotification({
            // @ts-ignore
            message: err.response.data?.errors[0].message,
            type: 'error',
          })
        } else {
          addNotification({
            message: 'Consultation sent back to queue',
            type: 'error',
          })
        }
        callFrame?.destroy()
        void router.push('/')
      },
      enabled: !!id,
      refetchInterval: 6000,
      refetchOnWindowFocus: false,
      retry: 0,
    },
  )
  const [SymptomsList, setSymptoms] = useSessionStorage<SymptomsStore[]>({
    key: 'Symptoms',
    defaultValue: [],
  })
  const Symptoms = SymptomsList.filter(
    (element) => element.type === 'Symptom',
  ).map((element) => element.value)
  const relatedSymptoms = SymptomsList.filter(
    (element) => element.type === 'relatedSymptom',
  ).map((element) => element.value)
  const startConsultation = useCallback(async () => {
    if (acceptedConsultation?.consultation?.status === 'accepted') {
      try {
        await start(acceptedConsultation.consultation.id)
      } catch (err) {
        addNotification({
          message: 'Error starting consultation',
          type: 'error',
        })
      }
    }
  }, [
    acceptedConsultation?.consultation?.id,
    acceptedConsultation?.consultation?.status,
    addNotification,
    start,
  ])
  const leaveCall = useCallback(() => {
    if (acceptedConsultation?.consultation?.consultationType === 'VIRTUAL') {
      setCallState('left-meeting')
    } else {
      handlePhysicalConsultation('stopped')
    }
  }, [
    acceptedConsultation?.consultation?.consultationType,
    handlePhysicalConsultation,
  ])
  const resetLocalState = useCallback(() => {
    setCallState('loading')
    setConsultationStatus(null)
    setActive('overview')
    setSymptoms([])
  }, [setCallState, setConsultationStatus, setSymptoms])
  const [callFrame, setCallFrame] = useState<DailyCall>(null)
  useEffect(() => {
    return () => {
      if (callFrame !== null) {
        callFrame.destroy()
      }
    }
  }, [callFrame])
  // Display notification when user tries to leave the consultation page
  const [showModal, { close, open }] = useDisclosure(false)
  useEffect(() => {
    const handleBrowserBack = () => {
      // addNotification({
      //   message: `Dr. ${userName}, you have a consultation is in progress!`,
      //   type: "error",
      // });
      open()
      window.history.pushState(null, '', document.URL)
    }
    window.history.pushState(null, '', document.URL)
    window.addEventListener('popstate', handleBrowserBack)
    return () => {
      window.removeEventListener('popstate', handleBrowserBack)
    }
  }, [addNotification, open, userName])
  return (
    <Layout title={`Consultation-${id}`}>
      <DailyProvider callObject={callFrame}>
        {acceptedConsultation ? (
          <Paper
            h="100%"
            component={Grid}
            display="flex"
            withBorder={true}
            sx={{ position: 'relative' }}
          >
            <Grid.Col
              md={6}
              lg={6}
              sx={{
                maxWidth: '100%', // Add this to prevent overflow
              }}
            >
              {acceptedConsultation.consultation?.consultationType ===
              'VIRTUAL' ? (
                <>
                  {callState !== 'left-meeting' &&
                  acceptedConsultation.consultation.status !== 'incomplete' ? (
                    <VideoCallFrame
                      consultationId={acceptedConsultation?.consultation.id}
                      consultationUrl={
                        acceptedConsultation?.consultation.consultationUrl
                      }
                      consultationType={
                        acceptedConsultation.consultation.consultationType
                      }
                      status={acceptedConsultation.consultation.status}
                      callFrame={callFrame}
                      callState={callState}
                      setCallFrame={setCallFrame}
                      setCallState={setCallState}
                      startConsultation={startConsultation}
                    >
                      {' '}
                      {acceptedConsultation?.consultation?.timeStarted &&
                        acceptedConsultation.consultation.consultationType ===
                          'VIRTUAL' &&
                        !consultationStatus && (
                          <DurationTimer
                            leaveCall={leaveCall}
                            consultation={acceptedConsultation.consultation}
                          />
                        )}
                    </VideoCallFrame>
                  ) : undefined}
                  {(callState === 'left-meeting' &&
                    acceptedConsultation.consultation.status === 'started') ||
                  acceptedConsultation.consultation.status === 'incomplete' ? (
                    <Summary
                      current={acceptedConsultation.currentConsultation}
                      diagnosis={state.sbar?.diagnosis}
                      symptoms={Symptoms}
                      relatedSymptoms={relatedSymptoms}
                      consultationId={acceptedConsultation?.consultation.id}
                      reset={resetLocalState}
                      status={acceptedConsultation.consultation.status}
                    />
                  ) : undefined}
                </>
              ) : (
                <>
                  {acceptedConsultation.consultation.status !== 'started' &&
                  acceptedConsultation.consultation.status !== 'incomplete' ? (
                    <Stack h="100%" justify="center" align="center">
                      <Title align="center"> Join the in person meeting</Title>
                      <Group position="center">
                        {' '}
                        <Button
                          variant="filled"
                          color="#10751c"
                          onClick={startConsultation}
                        >
                          Join
                        </Button>{' '}
                      </Group>
                    </Stack>
                  ) : (
                    <>
                      {consultationStatus === 'stopped' ||
                      acceptedConsultation.consultation.status ===
                        'incomplete' ? (
                        <Summary
                          current={acceptedConsultation.currentConsultation}
                          diagnosis={state.sbar?.diagnosis}
                          symptoms={Symptoms}
                          relatedSymptoms={relatedSymptoms}
                          consultationId={acceptedConsultation?.consultation.id}
                          reset={resetLocalState}
                          status={acceptedConsultation.consultation.status}
                        />
                      ) : (
                        <Box mt={200} h="100%">
                          <Stack spacing="xl">
                            <Title align="center">
                              Physical consultation in progress
                            </Title>
                            <AnimatedTimer
                              consultation={acceptedConsultation.consultation}
                            />
                            <Group position="center">
                              <Button onClick={leaveCall}>
                                Stop the physical consultation
                              </Button>
                            </Group>
                          </Stack>
                        </Box>
                      )}
                    </>
                  )}
                </>
              )}
            </Grid.Col>
            <Grid.Col md={6} lg={6} p="md" sx={{ maxWidth: '100%' }}>
              <Paper py="md">
                <ScrollArea
                  h="calc(100vh - calc(var(--mantine-header-height) * 2) )"
                  offsetScrollbars
                >
                  <Stack h="100%" spacing={10}>
                    <Stack>
                      <>
                        <SegmentedControl
                          value={comp}
                          color="#10751c"
                          size="md"
                          mb={5}
                          fw={900}
                          onChange={(value) => setActive(value as Views)}
                          data={[
                            {
                              label: "Patient's Complaint",
                              value: 'overview',
                            },
                            { label: 'Clinical Notes', value: 'notes' },
                            {
                              label: 'Presenting Symptoms',
                              value: 'symptoms',
                            },
                          ]}
                        />
                        {comp === 'overview' ? (
                          <Stack
                            style={{
                              border: '1px solid rgba(0, 0, 0, 0.1)',
                              padding: '10px',
                            }}
                          >
                            {acceptedConsultation.consultation
                              .textDetailedDescription ? (
                              <DetailedDescription
                                text={
                                  acceptedConsultation.consultation
                                    .textDetailedDescription
                                }
                              />
                            ) : null}
                            {acceptedConsultation.consultation
                              .audioDetailedDescription ? (
                              <AudioPlayer
                                audio={
                                  acceptedConsultation.consultation
                                    .audioDetailedDescription
                                }
                              />
                            ) : null}
                            {acceptedConsultation.images.length > 0 ? (
                              <ImageList images={acceptedConsultation.images} />
                            ) : null}
                          </Stack>
                        ) : null}
                        {comp === 'notes' ? (
                          <Diagnosis
                            close={() => {
                              setActive('symptoms')
                            }}
                          />
                        ) : null}
                        {comp === 'symptoms' ? (
                          <SymptomsHandler
                            setSymptoms={setSymptoms}
                            SymptomsList={SymptomsList}
                          />
                        ) : null}
                      </>
                    </Stack>
                    <Divider />
                    <ConsultationTabs data={acceptedConsultation} />
                  </Stack>
                </ScrollArea>
              </Paper>
            </Grid.Col>
          </Paper>
        ) : null}
        <LoadingOverlay visible={isLoading} />
        {isError && !acceptedConsultation ? (
          <>
            <Stack
              sx={{
                alignSelf: 'center',
                width: '100%',
                height: '100%',
                position: 'relative',
              }}
            >
              <Center p="xl" mt={200}>
                <Stack align="center">
                  <IconExclamationCircle size={40} color="red" />
                  <Title order={3}>
                    {/*@ts-ignore */}
                    {error?.response.data?.message || 'Invalid consultation'}
                  </Title>
                  <Button onClick={() => router.push('/')} mt="xl">
                    Go back
                  </Button>
                </Stack>
              </Center>
            </Stack>
          </>
        ) : undefined}
      </DailyProvider>
      {/* Back Notification Modal */}
      <Modal
        opened={showModal}
        onClose={close}
        title="Cannot leave current page!"
      >
        <Paper p="md">
          <Stack spacing="xl">
            <Text fw={500}>
              Dr. {userName}, you have a consultation is in progress!
            </Text>
            <Group position="center">
              <Button onClick={close}>Close</Button>
            </Group>
          </Stack>
        </Paper>
      </Modal>
    </Layout>
  )
}


// import { TelegramCall, type TelegramEvent } from 'telegram-js'

// import { DailyCall, type DailyEvent } from '@daily-co/daily-js'
// import { DailyProvider } from '@daily-co/daily-react'
// import { useQuery } from '@tanstack/react-query'
// import { useCallback, useEffect, useState } from 'react'
// import VideoCallFrame from '@components/consultation/current/VideoCallFrame'
// import TgboVideoCallFrame from '@components/consultation/current/TgboVideoCallFrame'
// import ConsultationTabs from '@components/consultation/current/SideTabs'
// import { getAcceptedConsultation } from '@routes'
// import { useRouter } from 'next/router'
// import {
//   Box,
//   Button,
//   Center,
//   Divider,
//   Grid,
//   Group,
//   LoadingOverlay,
//   Modal,
//   Paper,
//   ScrollArea,
//   SegmentedControl,
//   Stack,
//   Title,
//   Text,
// } from '@mantine/core'
// import useNotification from '@hooks/use-notifications'
// import { resetSbar } from '@utils/actions'
// import { useStateMachine } from 'little-state-machine'
// import { type AxiosError } from 'axios'
// import SymptomsHandler from '@components/consultation/overview/SymptomsHandler'
// import { IconExclamationCircle } from '@tabler/icons-react'
// import Summary from '@components/consultation/current/Summary'
// import { useDisclosure, useSessionStorage } from '@mantine/hooks'
// import AudioPlayer from '@components/consultation/overview/AudioPlayer'
// import DetailedDescription from '@components/consultation/overview/DetailedDescription'
// import ImageList from '@components/consultation/overview/ImageView'
// import Layout from '@components/layout'
// import { SbarSummary } from '@components/consultation/overview/SbarSummary'
// import DurationTimer from '@components/consultation/duration-timer'
// import AnimatedTimer from '@components/consultation/animated-timer'
// import useConsultation from '@hooks/use-consultation'
// import { Diagnosis } from '@components/consultation/overview/Diagnosis'
// import useProfile from '@hooks/use-profile'

// export default function ConsultationPage() {
// interface SymptomsStore {
//   type: 'Symptom' | 'relatedSymptom'
//   value: string
// }
// type consultationStatus = 'accepted' | 'stopped' | 'cancelled' | null
// export default function ConsultationPage() {
//   const router = useRouter()
//   const { id } = router.query
//   const { user } = useProfile()
//   const userName = user?.lastName || 'User'
//   type Views = 'overview' | 'notes' | 'symptoms'
//   const [comp, setActive] = useState<Views>('overview')
//   const [callState, setCallState] = useState<DailyEvent>('loading')
//   const [consultationStatus, setConsultationStatus] =
//     useSessionStorage<consultationStatus>({
//       key: 'consultationStatus',
//       defaultValue: null,
//     })
//   const handlePhysicalConsultation = useCallback(
//     (val: consultationStatus) => {
//       setConsultationStatus(val)
//     },
//     [setConsultationStatus],
//   )
//   useEffect(() => {
//     if (router.isReady && !id) {
//       void router.push('/')
//     }
//   }, [id, router])
//   const { addNotification, clearNotifications } = useNotification()
//   const { state, actions } = useStateMachine({
//     resetSbar,
//   })
//   const { start } = useConsultation()
//   const {
//     data: acceptedConsultation,
//     isLoading,
//     error,
//     isError,
//   } = useQuery(
//     ['acceptedConsultation', id],
//     () => getAcceptedConsultation(id.toString()),
//     {
//       onSuccess: (data) => {
//         if (data.consultation.status === 'accepted') {
//           addNotification({
//             message: `Dr. ${userName}. Consultation must begin in 5 minutes or it goes back to the queue.`,
//             type: 'success',
//           })
//         }
//       },
//       onError: (err: AxiosError) => {
//         clearNotifications()
//         actions.resetSbar()
//         if (err.response.status !== 404) {
//           addNotification({
//             // @ts-ignore
//             message: err.response.data?.errors[0].message,
//             type: 'error',
//           })
//         } else {
//           addNotification({
//             message: 'Consultation sent back to queue',
//             type: 'error',
//           })
//         }
//         callFrame?.destroy()
//         void router.push('/')
//       },
//       enabled: !!id,
//       refetchInterval: 6000,
//       refetchOnWindowFocus: false,
//       retry: 0,
//     },
//   )
//   const [SymptomsList, setSymptoms] = useSessionStorage<SymptomsStore[]>({
//     key: 'Symptoms',
//     defaultValue: [],
//   })
//   const Symptoms = SymptomsList.filter(
//     (element) => element.type === 'Symptom',
//   ).map((element) => element.value)
//   const relatedSymptoms = SymptomsList.filter(
//     (element) => element.type === 'relatedSymptom',
//   ).map((element) => element.value)
//   const startConsultation = useCallback(async () => {
//     if (acceptedConsultation?.consultation?.status === 'accepted') {
//       try {
//         await start(acceptedConsultation.consultation.id)
//       } catch (err) {
//         addNotification({
//           message: 'Error starting consultation',
//           type: 'error',
//         })
//       }
//     }
//   }, [
//     acceptedConsultation?.consultation?.id,
//     acceptedConsultation?.consultation?.status,
//     addNotification,
//     start,
//   ])
//   const leaveCall = useCallback(() => {
//     if (acceptedConsultation?.consultation?.consultationType === 'VIRTUAL') {
//       setCallState('left-meeting')
//     } else {
//       handlePhysicalConsultation('stopped')
//     }
//   }, [
//     acceptedConsultation?.consultation?.consultationType,
//     handlePhysicalConsultation,
//   ])
//   const resetLocalState = useCallback(() => {
//     setCallState('loading')
//     setConsultationStatus(null)
//     setActive('overview')
//     setSymptoms([])
//   }, [setCallState, setConsultationStatus, setSymptoms])

//   const [callFrame, setCallFrame] = useState<TelegramCall>(null)
  // useEffect(() => {
  //   return () => {
  //     if (callFrame !== null) {
  //       callFrame.destroy()
  //     }
  //   }
  // }, [callFrame])
  // // Display notification when user tries to leave the consultation page
  // const [showModal, { close, open }] = useDisclosure(false)
  // useEffect(() => {
  //   const handleBrowserBack = () => {
  //     // addNotification({
  //     //   message: `Dr. ${userName}, you have a consultation is in progress!`,
  //     //   type: "error",
  //     // });
  //     open()
  //     window.history.pushState(null, '', document.URL)
  //   }
  //   window.history.pushState(null, '', document.URL)
  //   window.addEventListener('popstate', handleBrowserBack)
  //   return () => {
  //     window.removeEventListener('popstate', handleBrowserBack)
  //   }
  // }, [addNotification, open, userName])
//   return (
//     <Layout title={`Consultation-${id}`}>
//       {acceptedConsultation ? (
//         <Paper
//           h="100%"
//           component={Grid}
//           display="flex"
//           withBorder={true}
//           sx={{ position: 'relative' }}
//         >
//           <Grid.Col
//             md={6}
//             lg={6}
//             sx={{
//               maxWidth: '100%', // Add this to prevent overflow
//             }}
//           >
//             {acceptedConsultation.consultation?.consultationType ===
//             'VIRTUAL' ? (
//               <>
//                 {callState !== 'left-meeting' &&
//                 acceptedConsultation.consultation.status !== 'incomplete' ? (
//                   <TgboVideoCallFrame // Updated component
//                     consultationId={acceptedConsultation?.consultation.id}
//                     consultationUrl={
//                       acceptedConsultation?.consultation.consultationUrl
//                     }
//                     consultationType={
//                       acceptedConsultation.consultation.consultationType
//                     }
//                     status={acceptedConsultation.consultation.status}
//                     callFrame={callFrame}
//                     callState={callState}
//                     setCallFrame={setCallFrame}
//                     setCallState={setCallState}
//                     startConsultation={startConsultation}
//                   >
//                     {' '}
//                     {acceptedConsultation?.consultation?.timeStarted &&
//                       acceptedConsultation.consultation.consultationType ===
//                         'VIRTUAL' &&
//                       !consultationStatus && (
//                         <DurationTimer
//                           leaveCall={leaveCall}
//                           consultation={acceptedConsultation.consultation}
//                         />
//                       )}
//                   </TgboVideoCallFrame>
//                 ) : undefined}
//                 {(callState === 'left-meeting' &&
//                   acceptedConsultation.consultation.status === 'started') ||
//                 acceptedConsultation.consultation.status === 'incomplete' ? (
//                   <Summary
//                     current={acceptedConsultation.currentConsultation}
//                     diagnosis={state.sbar?.diagnosis}
//                     symptoms={Symptoms}
//                     relatedSymptoms={relatedSymptoms}
//                     consultationId={acceptedConsultation?.consultation.id}
//                     reset={resetLocalState}
//                     status={acceptedConsultation.consultation.status}
//                   />
//                 ) : undefined}
//               </>
//             ) : (
//               <>
//                 {acceptedConsultation.consultation.status !== 'started' &&
//                 acceptedConsultation.consultation.status !== 'incomplete' ? (
//                   <Stack h="100%" justify="center" align="center">
//                     <Title align="center"> Join the in person meeting</Title>
//                     <Group position="center">
//                       {' '}
//                       <Button
//                         variant="filled"
//                         color="#10751c"
//                         onClick={startConsultation}
//                       >
//                         Join
//                       </Button>{' '}
//                     </Group>
//                   </Stack>
//                 ) : (
//                   <>
//                     {consultationStatus === 'stopped' ||
//                     acceptedConsultation.consultation.status ===
//                       'incomplete' ? (
//                       <Summary
//                         current={acceptedConsultation.currentConsultation}
//                         diagnosis={state.sbar?.diagnosis}
//                         symptoms={Symptoms}
//                         relatedSymptoms={relatedSymptoms}
//                         consultationId={acceptedConsultation?.consultation.id}
//                         reset={resetLocalState}
//                         status={acceptedConsultation.consultation.status}
//                       />
//                     ) : (
//                       <Box mt={200} h="100%">
//                         <Stack spacing="xl">
//                           <Title align="center">
//                             Physical consultation in progress
//                           </Title>
//                           <AnimatedTimer
//                             consultation={acceptedConsultation.consultation}
//                           />
//                           <Group position="center">
//                             <Button onClick={leaveCall}>
//                               Stop the physical consultation
//                             </Button>
//                           </Group>
//                         </Stack>
//                       </Box>
//                     )}
//                   </>
//                 )}
//               </>
//             )}
//           </Grid.Col>
//           <Grid.Col md={6} lg={6} p="md" sx={{ maxWidth: '100%' }}>
//             <Paper py="md">
//               <ScrollArea
//                 h="calc(100vh - calc(var(--mantine-header-height) * 2) )"
//                 offsetScrollbars
//               >
//                 <Stack h="100%" spacing={10}>
//                   <Stack>
//                     <>
//                       <SegmentedControl
//                         value={comp}
//                         color="#10751c"
//                         size="md"
//                         mb={5}
//                         fw={900}
//                         onChange={(value) => setActive(value as Views)}
//                         data={[
//                           {
//                             label: "Patient's Complaint",
//                             value: 'overview',
//                           },
//                           { label: 'Clinical Notes', value: 'notes' },
//                           {
//                             label: 'Presenting Symptoms',
//                             value: 'symptoms',
//                           },
//                         ]}
//                       />
//                       {comp === 'overview' ? (
//                         <Stack
//                           style={{
//                             border: '1px solid rgba(0, 0, 0, 0.1)',
//                             padding: '10px',
//                           }}
//                         >
//                           {acceptedConsultation.consultation
//                             .textDetailedDescription ? (
//                             <DetailedDescription
//                               text={
//                                 acceptedConsultation.consultation
//                                   .textDetailedDescription
//                               }
//                             />
//                           ) : null}
//                           {acceptedConsultation.consultation
//                             .audioDetailedDescription ? (
//                             <AudioPlayer
//                               audio={
//                                 acceptedConsultation.consultation
//                                   .audioDetailedDescription
//                               }
//                             />
//                           ) : null}
//                           {acceptedConsultation.images.length > 0 ? (
//                             <ImageList images={acceptedConsultation.images} />
//                           ) : null}
//                         </Stack>
//                       ) : null}
//                       {comp === 'notes' ? (
//                         <Diagnosis
//                           close={() => {
//                             setActive('symptoms')
//                           }}
//                         />
//                       ) : null}
//                       {comp === 'symptoms' ? (
//                         <SymptomsHandler
//                           setSymptoms={setSymptoms}
//                           SymptomsList={SymptomsList}
//                         />
//                       ) : null}
//                     </>
//                   </Stack>
//                   <Divider />
//                   <ConsultationTabs data={acceptedConsultation} />
//                 </Stack>
//               </ScrollArea>
//             </Paper>
//           </Grid.Col>
//         </Paper>
//       ) : null}
//       <LoadingOverlay visible={isLoading} />
//       {isError && !acceptedConsultation ? (
//         <>
//           <Stack
//             sx={{
//               alignSelf: 'center',
//               width: '100%',
//               height: '100%',
//               position: 'relative',
//             }}
//           >
//             <Center p="xl" mt={200}>
//               <Stack align="center">
//                 <IconExclamationCircle size={40} color="red" />
//                 <Title order={3}>
//                   {/*@ts-ignore */}
//                   {error?.response.data?.message || 'Invalid consultation'}
//                 </Title>
//                 <Button onClick={() => router.push('/')} mt="xl">
//                   Go back
//                 </Button>
//               </Stack>
//             </Center>
//           </Stack>
//         </>
//       ) : undefined}
//       {/* Back Notification Modal */}
//       <Modal
//         opened={showModal}
//         onClose={close}
//         title="Cannot leave current page!"
//       >
//         <Paper p="md">
//           <Stack spacing="xl">
//             <Text fw={500}>
//               Dr. {userName}, you have a consultation is in progress!
//             </Text>
//             <Group position="center">
//               <Button onClick={close}>Close</Button>
//             </Group>
//           </Stack>
//         </Paper>
//       </Modal>
//     </Layout>
//   )
// }
