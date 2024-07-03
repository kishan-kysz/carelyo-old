import { Stack, Tabs, Title } from '@mantine/core'
import PatientInfoContainer from '../overview/PatientInformation'
import { IAcceptedConsultation } from '@types'
import History from '../history'
import HandleLab from '../forms/HandleLab'
import HandleFollowUp from '../forms/HandleFollowUp'
import { useState } from 'react'
import HandlePrescription from '../forms/HandlePrescriptions'
import VitalsInformation from '../overview/VitalsInformation'

const DEFAULT_TAB = 'overview'
const DEFAULT_TAB2 = 'prescriptions'
function ConsultationTabs({ data }: { data: IAcceptedConsultation }) {
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB)
  const [treatmentTab, setTreatmentTab] = useState(DEFAULT_TAB2)
  return (
    <Stack>
      <Tabs
        value={activeTab}
        onTabChange={setActiveTab}
        keepMounted={false}
        variant="pills"
        color="#10751c"
        styles={(theme) => ({
          panel: {
            marginTop: theme.spacing.sm,
          },
        })}
      >
        <Tabs.List grow={true}>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="history">Medical Chart</Tabs.Tab>
          <Tabs.Tab value="labs">Lab Request</Tabs.Tab>
          <Tabs.Tab value="treatment">Treatment</Tabs.Tab>
          <Tabs.Tab value="followUp">Follow-up</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel
          value="overview"
          style={{ border: '1px solid rgba(0, 0, 0, 0.1)', padding: '10px' }}
        >
          <PatientInfoContainer
            patientInfo={data?.patientInfo}
            consultationLanguage={data?.consultation.language}
          />
          <VitalsInformation patientInfo={data?.patientInfo} />
        </Tabs.Panel>
        <Tabs.Panel
          value="history"
          style={{ border: '1px solid rgba(0, 0, 0, 0.1)', padding: '10px' }}
        >
          <History history={data?.history} />
        </Tabs.Panel>
        <Tabs.Panel
          value="labs"
          style={{ border: '1px solid rgba(0, 0, 0, 0.1)', padding: '10px' }}
        >
          <Stack>
            <Title order={4}>Create Lab Test</Title>
            <HandleLab
              id={data?.consultation.id}
              labs={data?.currentConsultation.labs}
            />
          </Stack>
        </Tabs.Panel>
        <Tabs.Panel
          value="treatment"
          style={{ border: '1px solid rgba(0, 0, 0, 0.1)', padding: '10px' }}
        >
          {
            <Tabs value={treatmentTab}>
              <Tabs.List>
                <Tabs.Tab value="prescriptions">Prescriptions</Tabs.Tab>
                <Tabs.Tab disabled value="alternative">
                  Alternative meds
                </Tabs.Tab>
                <Tabs.Tab disabled value="homeopathic">
                  Homeopathic
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="prescriptions">
                <Stack p={16}>
                  <Title order={4}>Create Prescription</Title>
                  <HandlePrescription
                    id={data?.consultation.id}
                    prescriptions={data?.currentConsultation.prescriptions}
                  />
                </Stack>
              </Tabs.Panel>
              {/* <Tabs.Panel value="alternative">
             
              </Tabs.Panel>
              <Tabs.Panel value="homeopathic">
           
              </Tabs.Panel> */}
            </Tabs>
          }
        </Tabs.Panel>
        <Tabs.Panel
          value="followUp"
          style={{ border: '1px solid rgba(0, 0, 0, 0.1)', padding: '10px' }}
        >
          <Stack>
            <Title order={4}>Create Follow up</Title>
            <HandleFollowUp
              id={data?.consultation.id}
              data={data?.currentConsultation.followUp}
            />
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  )
}

export default ConsultationTabs
