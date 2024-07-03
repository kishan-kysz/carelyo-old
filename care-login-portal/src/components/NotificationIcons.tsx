import React from 'react'
import { BsPatchExclamationFill } from 'react-icons/bs'
import { IoShieldCheckmarkSharp } from 'react-icons/io5'

const Icon: React.FC<{ type: 'success' | 'error' | 'warning' | 'info' }> = ({
  type
}) => {
  switch (type) {
    case 'success':
      return <IoShieldCheckmarkSharp />
    case 'error':
      return <BsPatchExclamationFill />
    case 'warning':
      return <BsPatchExclamationFill />
    case 'info':
      return <BsPatchExclamationFill />
    default:
      return <BsPatchExclamationFill />
  }
}

export default Icon
