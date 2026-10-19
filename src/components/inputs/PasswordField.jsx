// React
import { useState } from 'react'

// Third-party
import {
  IconButton,
  InputAdornment,
  TextField
} from '@mui/material'

import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'


function PasswordField({ slotProps, ...props }) {
  const [visible, setVisible] = useState(false)

  return (
    <TextField
      type={visible ? 'text' : 'password'}
      {...props}
      slotProps={{
        ...slotProps,
        input: {
          ...slotProps?.input,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                onClick={() => setVisible(value => !value)}
                aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {visible ? (
                  <VisibilityOffOutlinedIcon />
                ) : (
                  <VisibilityOutlinedIcon />
                )}
              </IconButton>
            </InputAdornment>
          )
        }
      }}
    />
  )
}

export default PasswordField
