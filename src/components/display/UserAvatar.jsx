// Third-party
import { Avatar } from '@mui/material'

// Utils
import {
  getAvatarColor,
  getInitial
} from '../../utils/userHelpers'


function UserAvatar({ email, size = 36, sx, ...props }) {
  return (
    <Avatar
      {...props}
      sx={{
        width: size,
        height: size,
        fontSize: size * 0.42,
        fontWeight: 700,
        color: '#FFFFFF',
        bgcolor: getAvatarColor(email),
        ...sx
      }}
    >
      {getInitial(email)}
    </Avatar>
  )
}

export default UserAvatar
