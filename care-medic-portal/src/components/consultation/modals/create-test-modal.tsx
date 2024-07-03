import {
  Box,
  Button,
  Modal,
  Select,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { useState } from 'react'
import { useTests } from '@hooks/use-tests'

const showModalType = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
}

const CreateTestModal = ({
  opened,
  toggle,
}: {
  opened: boolean
  toggle: () => void
}): JSX.Element => {
  const close = () => {
    toggle()
  }
  const { categoryData, createTestMutation } = useTests(close)

  const [createdData, setCreatedData] =
    useState<Array<{ label: string; value: string }>>(categoryData)
  const [testName, setTestName] = useState('')
  const [category, setCategory] = useState('')
  const [errors, setErrors] = useState({ testName: '', category: '' })
  const [showModal, setShowModal] = useState(showModalType.CREATE)
  const [selectedCategory, setSelectedCategory] = useState(null)

  const validateInputs = () => {
    const newErrors = { testName: '', category: '' }
    if (!testName) {
      newErrors.testName = 'Test Name is required'
    }
    if (!category) {
      newErrors.category = 'Category is required'
    }
    setErrors(newErrors)
    return !(newErrors.testName && newErrors.category)
  }

  const handleTestNameChange = (event) => {
    setTestName(event.target.value)
    setErrors((prevErrors) => ({ ...prevErrors, testName: '' }))
  }

  const handleCategoryChange = (selectedOption) => {
    setErrors((prevErrors) => ({ ...prevErrors, category: '' }))
    setCategory(selectedOption)
  }

  const handleCreateTest = async () => {
    if (!validateInputs()) {
      return
    }
    const newTestData = {
      category: category,
      procedure: testName,
    }
    await createTestMutation(newTestData)
  }

  return (
    <Modal
      title={
        <Box>
          <Text size={'lg'}>Lab test configuration</Text>
        </Box>
      }
      opened={opened}
      onClose={close}
      size="xl"
      styles={{
        content: {
          width: '500px',
          height: '500px',
        },
      }}
    >
      <Box
        p="md"
        h={400}
        display="flex"
        sx={{ flexDirection: 'column', justifyContent: 'space-around' }}
      >
        {showModal === showModalType.CREATE && (
          <>
            <Title align="center">Add a new test</Title>

            <Select
              label="Category"
              placeholder="Select Category "
              searchable={true}
              creatable={true}
              getCreateLabel={(query) => `+ Create ${query}`}
              onCreate={(query) => {
                const item = { value: query, label: query }
                setCreatedData((current) => [...current, item])
                return { value: query, label: query }
              }}
              maxDropdownHeight={150}
              error={errors.category}
              onChange={handleCategoryChange}
              dropdownPosition="bottom"
              clearable={true}
              data={createdData || []}
              required
              autoCapitalize="words"
            />
            <TextInput
              placeholder="Enter test name"
              label="Test Name"
              required
              onChange={handleTestNameChange}
              error={errors.testName}
            />
            <Box>
              <Button
                onClick={handleCreateTest}
                color="teal"
                size="sm"
                variant="filled"
                mt={10}
                mb={30}
                px={48}
              >
                Create
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  )
}

export default CreateTestModal
