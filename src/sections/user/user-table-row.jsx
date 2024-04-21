import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Label from 'src/components/label';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';
import {useCallback} from 'react'
import { useRouter } from 'src/routes/hooks';
import { paths} from 'src/routes/paths'

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { Badge } from '@mui/material';
import { styled } from '@mui/material/styles';
// ----------------------------------------------------------------------

const OfflineStyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#808080',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  },
}));

const OnlineStyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

export default function UserTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, onBanRow, onUnbanRow, isOnline }) {
  if (!row) {
    return null; 
  }
  // console.log(row.userId)
  // const DEFAULT_AVATAR_URL = "avatar.jpg"; //默认头像？
  const { username, avatarUrl, gender, birthday, region, membershipTime } = row;

  const confirm = useBoolean();

  const quickEdit = useBoolean();

  const popover = usePopover();

  const router = useRouter();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onChange={onSelectRow}/>
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          {
            isOnline ?
              <OnlineStyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                style={{
                  marginRight: '10px'
                }}
              >
                <Avatar alt={username} src={avatarUrl || username[0]} />
              </OnlineStyledBadge> :
              <OfflineStyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                style={{
                  marginRight: '10px'
                }}
              >
                <Avatar alt={username} src={avatarUrl || username[0]} />
              </OfflineStyledBadge>
          }
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap'}}>
            <ListItemText
              primary={
                <>
                  {username}
                  <Label
                    variant="soft"
                    color={row.isBanned ? 'error' : 'success'}
                    sx={{ ml: 1, display: 'inline-flex', verticalAlign: 'middle' }}
                  >
                    {row.isBanned ? 'Banned' : 'Active'}
                  </Label>
                </>
              }
              secondary={`Member since ${new Date(membershipTime * 1000).toLocaleDateString()}`}
              primaryTypographyProps={{ typography: 'body2', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}
              secondaryTypographyProps={{
                component: 'span',
                color: 'text.disabled',
              }}
            />
          </div>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {gender === 1 ? 'Female' : gender === 0 ? 'Male' : 'Secrecy'}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{!isNaN(Date.parse(birthday)) ? new Date(birthday).toLocaleDateString() : 'Secrecy'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{region}</TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="Edit User" placement="top" arrow>
            <IconButton color={quickEdit.value ? 'inherit' : 'default'} onClick={onEditRow}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>

          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>


      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>

        <MenuItem onClick={() => {
            onBanRow()
            popover.onClose(); 
          }}
          // sx={{ color: '#cc0000' }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="ant-design:stop-outlined" />
          Ban
        </MenuItem>

        <MenuItem onClick={() => { 
            onUnbanRow()
            popover.onClose(); 
          }}
          // sx={{ color: '#4CAF50' }}
        >
          <Iconify icon="fluent:accessibility-checkmark-24-regular" />
          Unban
        </MenuItem>

      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}

UserTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
