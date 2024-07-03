import { Accordion, Text } from '@mantine/core'
import { PatientInfo } from '@types'
import ItemDetail from '../../core/item-detail'
import { getAge } from '@utils/helpers'

interface PatientInfoProps {
  patientInfo: Omit<PatientInfo, 'patientMobileNumber' | 'patientFullName'>
  consultationLanguage: string
}

const keyToTitle: Record<
  keyof Omit<PatientInfo, 'patientMobileNumber' | 'patientFullName'>,
  string
> = {
  name: 'Name',
  dateOfBirth: 'Age',
  address: 'Address',
  community: 'Area',
  language: 'Spoken Languages',
  medicalProblems: 'Medical Problems',
  bloodType: 'Blood type',
  allergies: 'Allergies',
  disabilities: 'Disabilities',
  height: 'Height',
  weight: 'Weight',
  gender: 'Gender',
  patientId: 'Patient ID',
  isChild: 'isChild',
  parentName: 'parentName'
}
export default function PatientInfoContainer({
  patientInfo,
  consultationLanguage,
}: PatientInfoProps) {
  return (
    <Accordion title="Patient information" variant="separated">
      <Accordion.Item value="patientInfo" p={0}>
        <Accordion.Control defaultChecked>
          <Text weight="bold" size="lg">
            Patient information
          </Text>
          <Text color="gray">Personal details and medical information</Text>
        </Accordion.Control>
        <Accordion.Panel p={0}>
          <ItemDetail
            title="Consultation Language"
            value={consultationLanguage}
          />
          {patientInfo.isChild ? (
          <ItemDetail
            title="Child's Parent"
            value={patientInfo.parentName}
          />) : null}

          {Object.keys(patientInfo).map((key) => {
            if (key === 'patientId' || key === 'isChild' || key === 'parentName') {
              return null
            }
            if (key === 'dateOfBirth') {
              return (
                <ItemDetail
                  key={key}
                  title={keyToTitle[key]}
                  value={getAge(patientInfo[key])}
                />
              )
            }
            if (
              key === 'allergies' ||
              key === 'disabilities' ||
              key === 'language' ||
              key === 'medicalProblems'
            ) {
              return (
                <ItemDetail
                  key={key}
                  title={keyToTitle[key]}
                  value={patientInfo[key].join(', ')}
                />
              )
            }
            return (
              <ItemDetail
                key={key}
                title={keyToTitle[key]}
                value={patientInfo[key]}
              />
            )
          })}
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  )
}
