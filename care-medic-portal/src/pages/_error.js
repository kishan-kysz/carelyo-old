import NextErrorComponent from 'next/error'

const CustomErrorComponent = (props) => {
  return <NextErrorComponent statusCode={props.statusCode} />
}

export default CustomErrorComponent
