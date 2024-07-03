import {
  Accordion,
  Badge,
  Blockquote,
  Box,
  Center,
  Divider,
  Group,
  Pagination,
  Text,
} from '@mantine/core'
import { IHistory, ILabRequest, IPrescription } from '@types'
import { Fragment, useState } from 'react'
import ItemDetail from '../../core/item-detail'
import { IconNoDerivatives } from '@tabler/icons-react'
import { formatDate } from '@utils/helpers'

const prescriptionTitleMap: Record<
  keyof Omit<IPrescription, 'consultationId' | 'id'>,
  string
> = {
  medicationName: 'Medication',
  dosage: 'Dosage',
  frequency: 'Frequency',
  issueDate: 'Issue date',
  quantity: 'Quantity',
  treatmentDuration: 'Duration',
  issuerName: 'Issuer',
  medicationStrength: 'Strength',
  medicationType: 'Type',
  illness: 'Illness',
  status: 'Status',
}
const LabRequest = ({ lab }: { lab: ILabRequest }) => {
  return (
    <Accordion.Item value={lab.reason} key={lab.id} my={5}>
      <Accordion.Control>
        {' '}
        <Group position="apart">
          <Text> {lab.doctorName} </Text>
          <Text> {lab.createdAt} </Text>
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        <ItemDetail title="Test" value={lab.test} />
        <ItemDetail title="Reason" value={lab.reason} />
      </Accordion.Panel>
    </Accordion.Item>
  )
}
const Prescription = ({ prescription }: { prescription: IPrescription }) => {
  return (
    <Accordion.Item value={prescription.medicationName} key={prescription.id}>
      <Accordion.Control>
        <Group position="apart">
          <Text>{prescription.medicationName}</Text>
          <Text>{formatDate(prescription.issueDate)}</Text>
        </Group>{' '}
      </Accordion.Control>
      <Accordion.Panel>
        {' '}
        {Object.keys(prescription).map((key) => {
          if (key === 'id') {
            return null
          }
          return (
            <ItemDetail
              key={key}
              title={prescriptionTitleMap[key]}
              value={prescription[key]}
            />
          )
        })}{' '}
      </Accordion.Panel>
    </Accordion.Item>
  )
}

const HistoryItem = ({ history }: { history: IHistory }) => {
  return history.timeFinished ? (
    <Accordion variant="separated" my={5}>
      <Accordion.Item
        value={history?.timeFinished?.toString() || 'time'}
        key={history?.timeFinished?.toString()}
      >
        <Accordion.Control>
          <Text> {formatDate(history?.timeFinished, 'LLL')} </Text>
          <Group position="apart">
            <Group>
              <Divider my={3} label="Symptoms:" labelPosition="center" />
              {history.symptoms.map((s) => (
                <Badge
                  key={s}
                  color="lime"
                  variant="filled"
                  size="sm"
                  style={{ margin: 5 }}
                >
                  {' '}
                  {s}{' '}
                </Badge>
              ))}
            </Group>
            <Group>
              <Divider
                my={3}
                label="Related Symptoms:"
                labelPosition="center"
              />
              {history.relatedSymptoms.map((s) => (
                <Badge
                  key={s}
                  color="blue"
                  variant="filled"
                  size="sm"
                  style={{ margin: 5 }}
                >
                  {' '}
                  {s}{' '}
                </Badge>
              ))}
            </Group>
          </Group>
        </Accordion.Control>
        <Accordion.Panel>
          <Fragment>
            <Divider
              my={3}
              label="Passed  encounters (SBAR)"
              labelPosition="center"
            />
            <Blockquote cite="– Situation" icon={null}>
              {' '}
              {history?.sbar.situation}
            </Blockquote>
            <Blockquote cite="– Background" icon={null}>
              {' '}
              {history?.sbar.background}
            </Blockquote>
            <Blockquote cite="– Assessment" icon={null}>
              {' '}
              {history?.sbar.assessment}
            </Blockquote>
            <Blockquote cite="– Diagnosis" icon={null}>
              {' '}
              {history.diagnosis}
            </Blockquote>
            <Blockquote cite="– Doctor's Confidential Note:" icon={null}>
              {' '}
              {history?.sbar.notes}
            </Blockquote>
            <Blockquote
              cite={`Recommendation by: Dr. ${history?.doctorName}`}
              icon={null}
            >
              {' '}
              {history?.sbar.recommendation}
            </Blockquote>
          </Fragment>
          {history.labrequests.length > 0 ? (
            <Fragment>
              <Divider my={3} label="Labs" labelPosition="center" />
              <Accordion variant="contained">
                <Accordion.Control>
                  {' '}
                  <Text>
                    {`${history.labrequests.length} Lab request in consultation`}{' '}
                  </Text>
                </Accordion.Control>
                <Accordion.Panel>
                  {history.labrequests.map((lab) => {
                    return (
                      <Accordion key={lab.id} variant="contained">
                        <LabRequest lab={lab} />
                      </Accordion>
                    )
                  })}
                </Accordion.Panel>
              </Accordion>
            </Fragment>
          ) : null}
          {history.prescriptions.length > 0 ? (
            <Fragment>
              <Divider my={3} label="Prescriptions" labelPosition="center" />
              <Accordion variant="contained">
                <Accordion.Control>
                  {' '}
                  <Text>
                    {`${history.prescriptions.length} Prescriptions in consultation`}{' '}
                  </Text>
                </Accordion.Control>
                <Accordion.Panel>
                  {history.prescriptions.map((pres) => {
                    return (
                      <Accordion key={pres.id} variant="contained">
                        <Prescription prescription={pres} key={pres.id} />
                      </Accordion>
                    )
                  })}
                </Accordion.Panel>
              </Accordion>
            </Fragment>
          ) : null}
          {history.followUpId ? (
            <Fragment>
              <Divider my={3} label="Follow up" labelPosition="center" />
              <Text> Booked followup </Text>
            </Fragment>
          ) : null}
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  ) : null
}
export default function History({ history }: { history: IHistory[] }) {
  const [page, setPage] = useState(1)
  const HISTORY_PER_PAGE = 5
  return history.length >= 1 ? (
    <Box>
      {history
        .slice((page - 1) * HISTORY_PER_PAGE, page * HISTORY_PER_PAGE)
        .map((h) => {
          return <HistoryItem history={h} key={h.timeFinished?.toString()} />
        })}
      <Group position="center">
        <Pagination
          value={page}
          total={
            history.length > HISTORY_PER_PAGE
              ? history.length / HISTORY_PER_PAGE
              : 0
          }
          onChange={setPage}
        />
      </Group>
    </Box>
  ) : (
    <Box p="lg" h={300}>
      <Center>
        <Text color="red" size="lg">
          <IconNoDerivatives size={50} />
        </Text>
      </Center>
      <Text align="center" size="lg" fw={600}>
        {' '}
        No history{' '}
      </Text>
    </Box>
  )
}
