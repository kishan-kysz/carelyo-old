import Layout from '@components/layout/index'
import ListOfPatients from '@components/patientlist/list-of-patients'
import SelectedPatientDisplay from '@components/patientlist/selected-patient-display'

import usePatient from '@hooks/use-patient'
import { Container, Grid } from '@mantine/core'
import { IPatients } from '@types'
import { NextPageWithLayout } from 'pages/_app'
import { useEffect, useState } from 'react'

const PatientList: NextPageWithLayout = () => {
  const { patientList } = usePatient()
  const [id, setId] = useState<number>()
  const [selectedPatient, setSelectedPatient] = useState<IPatients>()

  useEffect(() => {
    if (patientList && id) {
      const patient = patientList.find((item) => item.userId === id)
      setSelectedPatient(patient)
    }
  }, [id, patientList])

  return (
    <Container h="100%" maw={1600}>
      {/* <DashboardHeader title="Patient list"/> */}
      <Grid mt={8} h="100%">
        <Grid.Col span={6} md={5} lg={4}>
          <ListOfPatients
            patients={patientList}
            selectedPatientId={id}
            setId={setId}
          />
        </Grid.Col>
        <Grid.Col span={6} md={7} lg={8}>
          <SelectedPatientDisplay selectedPatient={selectedPatient} />
        </Grid.Col>
      </Grid>
    </Container>
  )
}

export default PatientList

PatientList.getLayout = (page) => <Layout title="Patient List">{page}</Layout>
