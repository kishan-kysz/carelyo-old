import Icd10Search from '@components/core/icd10-search'
import Layout from '@components/layout'
import { useState } from 'react'

const Test = () => {
  const [selected, setSelected] = useState([])
  const handleDiagnosis = (val) => {
    console.log(val)
  }
  return (
    <Layout title="test">
      <Icd10Search
        selected={selected}
        setSelected={setSelected}
        handleDiagnosis={handleDiagnosis}
      />
    </Layout>
  )
}
export default Test
