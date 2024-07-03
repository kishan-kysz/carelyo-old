import { Loader } from '@mantine/core'

export default function SuspenseLoader() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: ' 100%',
        height: '100vh',
      }}
    >
      <h2
        style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          margin: '0 0 0.5rem',
        }}
      >
        {' '}
        Loading...{' '}
      </h2>
      <Loader />
    </div>
  )
}
