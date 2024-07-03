import { useCallback, useMemo, useState } from 'react'
import { cd10 } from '@prisma/client'
import Icd10Search from '@components/core/icd10-search'

/**
 * A custom React hook for managing state and functions related to an ICD-10 search component.
 * @returns {{selected: (function(): {label: string, value: string}[]), setSelected: React.Dispatch<React.SetStateAction<cd10[]>>, SearchIcd10: (function(): JSX.Element)}} An object containing `selected`, `setSelected`, and `SearchIcd10` properties.
 */
export const useIcd10 = (cb?: Function) => {
  const [selected, setSelected] = useState<cd10[]>([])

  /**
   * Memoized function to format the `selected` array into a list of objects with `label` and `value` properties.
   * @type {function(): {label: string, value: string}[]}
   */
  const formatSelectedToList = useCallback(() => {
    return selected.map((item) => {
      return {
        label: `${item.icd103_code}, ${item.icd10_code}`,
        value: item.who_full_description,
      }
    })
  }, [selected])

  const selectedList = formatSelectedToList()
  /**
   * Memoized function to return an `ICD10Search` component with `selected` and `setSelected` props.
   * @type {function(): JSX.Element}
   */
  const SearchIcd10Callback = useCallback(() => {
    return (
      <Icd10Search
        selected={selected}
        setSelected={setSelected}
        handleDiagnosis={cb}
      />
    )
  }, [cb, selected])

  /**
   * Memoized object containing `selected`, `setSelected`, and `SearchIcd10` properties.
   * @type {{selected: function(): {label: string, value: string}[], setSelected: React.Dispatch<React.SetStateAction<cd10[]>>, SearchIcd10: function(): JSX.Element}}
   */
  return useMemo(
    () => ({
      selected: selectedList,
      setSelected,
      SearchIcd10: SearchIcd10Callback,
    }),
    [selectedList, setSelected, SearchIcd10Callback],
  )
}
