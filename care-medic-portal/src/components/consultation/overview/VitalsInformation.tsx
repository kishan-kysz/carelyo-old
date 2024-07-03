import UseVitals from '@hooks/use-vitals'
import { Accordion, Text } from '@mantine/core'
import { PatientInfo } from '@types'
import VitalsAccordionPanel from './VitalsAccordionPanel'

interface IProps {
  patientInfo: PatientInfo
}

const VitalsInformation = ({ patientInfo }: IProps) => {
  const { vitalData } = UseVitals(patientInfo.patientId, patientInfo.isChild)

  return (
    <div>
      <Accordion mt={16} variant="separated">
        <Accordion.Item value="test">
          <Accordion.Control>
            <Text size="lg" fw="bold">
              Patient vitals
            </Text>
            <Text color="gray">Vital patient details </Text>
          </Accordion.Control>
          {vitalData && (
            <Accordion.Panel p={0}>
              {Object.keys(vitalData).map((data) => (
                <Accordion
                  styles={{
                    content: {
                      padding: 0,
                    },
                  }}
                  key={data}
                  p={0}
                >
                  <Accordion.Item p={0} value={data}>
                    <Accordion.Control p={0}>
                      {data === 'bloodGlucose'
                        ? 'Blood Glucose'
                        : data === 'bloodOxygen'
                          ? 'Blood oxygen levels'
                          : data === 'bloodPressure'
                            ? 'Blood Pressure'
                            : data === 'bodyTemperature'
                              ? 'Body temperatuire'
                              : data === 'heartRate'
                                ? 'Heart rate'
                                : data === 'menstruation'
                                  ? 'Menstruation'
                                  : data === 'respiratoryRate'
                                    ? 'Respiratory rate'
                                    : null}
                    </Accordion.Control>
                    <Accordion.Panel>
                      {vitalData[data].map((item) => (
                        <VitalsAccordionPanel
                          key={item.id}
                          item={item}
                          data={data}
                        />
                      ))}
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion>
              ))}
            </Accordion.Panel>
          )}
        </Accordion.Item>
      </Accordion>
    </div>
  )
}

export default VitalsInformation
