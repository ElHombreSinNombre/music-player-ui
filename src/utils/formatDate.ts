const milisecondsToDate = ({
  hasYear = false,
  date
}: {
  hasYear?: boolean
  date: number
}) => {
  if (!hasYear) {
    return new Date(date).toLocaleString(navigator.languages, {
      minute: '2-digit',
      second: '2-digit'
    })
  }
  return new Date(date).toLocaleString(navigator.language, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

export default milisecondsToDate
