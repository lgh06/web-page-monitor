import Error from 'next/error'

// only used in prod
// add status error code to frontend page
function customError({ statusCode }) {
  return (
    <p>
      {statusCode
        ? <Error statusCode={statusCode} />
        : 'An error occurred on client'}
    </p>
  )
}

customError.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 500
  return { statusCode }
}

export default customError