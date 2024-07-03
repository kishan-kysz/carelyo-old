import { Accordion, Group, Text } from '@mantine/core'
import { BsChevronDown } from 'react-icons/bs'

function AccordionLabel({ label, description }) {
  return (
    <Group noWrap={true}>
      <div>
        <div>
          <Text>{label}</Text>
        </div>
        <div>
          <Text size="sm" color="dimmed">
            {description}
          </Text>
        </div>
      </div>
    </Group>
  )
}

const faqs = [
  {
    text: 'Carelyo is an innovative digital platform that allows you to have medical problems assessed quickly, regardless of location and at low cost by an independent specialist licensed in your country. Carelyo is suitable for the assessment of all types of medical problems.',
    title: 'What is Carelyo?',
    date: '2021-08-01',
  },
  {
    text: 'Carelyo is  a service of Carelyo Nigeria. Carelyo is a Nigerian product developed with the help of leading medical experts. You can find more information about the founders of Carelyo here.',
    title: 'Who is behind Carelyo?',
    date: '2021-08-05',
  },
  {
    text: 'No time-consuming registration or login to the platform is required to use Carelyo. We recommend that you use your smartphone for your enquiry. You do not need to download an app or anything similar, but can simply use the service via carelyo.ng.',
    title: 'How  does Carelyo work?',
    date: '2021-02-05',
  },
  {
    text: 'Attention: Carelyo is NOT suitable for acute health problems such as sudden severe symptoms. We explicitly advise you to immediately alert regional emergency care in life-threatening situations',
    title: 'Is Carelyo suitable for emergencies?',
    date: '2023-02-05',
  },
  {
    text: 'Carelyo generally represents a supplementary service to the personal visit to the practice. Exclusive consultation or treatment via communication media is permitted in individual cases if this is medically justifiable and the required medical care is maintained, in particular by the way in which the findings are ascertained, consultation, treatment and documentation are carried out. The doctor will inform you if (in addition) a personal on-site visit is necessary.',
    title: 'Does a request via Carelyo replace a personal visit to the doctor?',
    date: '2021-02-05',
  },
]
export const Faq = () => {
  return (
    <div>
      <p>Frequently Asked Questions</p>
      <Accordion chevronPosition="right" chevron={<BsChevronDown size="40" />}>
        {faqs.map((i) => {
          return (
            <Accordion.Item value={i.title} key={i.title}>
              <Accordion.Control p={0}>
                <AccordionLabel label={i.title} description={i.date} />
              </Accordion.Control>
              <Accordion.Panel p={0} m={0}>
                <div>{i.text}</div>
              </Accordion.Panel>
            </Accordion.Item>
          )
        })}
      </Accordion>
    </div>
  )
}
