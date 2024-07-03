import { Accordion, Box, Button, Group, Text } from '@mantine/core'
import { Fragment } from 'react'
import ItemDetail from '../../core/item-detail'
import { capitalize, formatDate } from '@utils/helpers'

// rome-ignore lint: <explanation>
export function HandleCurrent<T extends Array<any>>({
  data,
  handleSelectEdit,
  handleSelectDelete,
  type,
  isLoading,
}: {
  data: T
  handleSelectEdit: Function
  handleSelectDelete: Function
  isLoading: boolean
  type: 'lab' | 'prescriptions' | 'followup'
}) {
  return (
    <Box>
      <Text>
        {data.length > 0
          ? `${capitalize(type)} for current consultation`
          : `No ${type} has been created`}
      </Text>
      {data?.map((item, index) => (
        <Fragment key={item.id}>
          <Accordion key={item.id} title={item.id} variant="separated">
            <Accordion.Item value={`${item.id}${index}`}>
              <Accordion.Control>
                <Text> {`${formatDate(item.createdAt)}`}</Text>
              </Accordion.Control>
              <Accordion.Panel>
                {Object.entries(item).map(
                  ([key, value]) =>
                    typeof key === 'string' &&
                    key !== 'id'&& key !== 'consultationId' && key !== 'patientName' && (
                      <ItemDetail
                        key={key}
                        title={key.toUpperCase()}
                        value={value as string}
                      />
                    ),
                )}

                <Group position="right" mt={5}>
                  <Button
                    size="xs"
                    color="blue"
                    loading={isLoading}
                    onClick={() => handleSelectEdit(item)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="xs"
                    color="red"
                    onClick={() => handleSelectDelete(item)}
                  >
                    Delete
                  </Button>
                </Group>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Fragment>
      ))}
    </Box>
  )
}
