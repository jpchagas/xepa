const relativeFormat = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' })

const shortDateFormat = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit'
})


// "agora", "há 5 minutos", "há 3 horas", "ontem", "12/10"
export function formatRelativeTime(date, now = Date.now()) {
  if (!date) return ''

  const seconds = Math.round((date.getTime() - now) / 1000)
  const elapsed = Math.abs(seconds)

  if (elapsed < 60) return 'agora'
  if (elapsed < 3600) return relativeFormat.format(Math.round(seconds / 60), 'minute')
  if (elapsed < 86_400) return relativeFormat.format(Math.round(seconds / 3600), 'hour')
  if (elapsed < 604_800) return relativeFormat.format(Math.round(seconds / 86_400), 'day')

  return shortDateFormat.format(date)
}
