const AVATAR_COLORS = [
  '#E3141B',
  '#FF8A00',
  '#16A34A',
  '#0EA5E9',
  '#7C3AED',
  '#DB2777',
  '#0D9488',
]

export const getInitial = email =>
  email?.charAt(0).toUpperCase() || '?'

// Same email always gets the same color.
export const getAvatarColor = email => {
  const text = email || ''

  let hash = 5381

  for (let index = 0; index < text.length; index++) {
    hash = ((hash * 33) ^ text.charCodeAt(index)) | 0
  }

  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}
