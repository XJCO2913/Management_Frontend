import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import UserQuickEditForm from './user-quick-edit-form';
// ----------------------------------------------------------------------

export default function UserTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, onBanRow, onUnbanRow }) {
  if (!row) {
    return null; 
  }
  // console.log(row)

  const { username, avatarUrl, gender, birthday, region, membershipTime } = row;

  const confirm = useBoolean();

  const quickEdit = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox
          checked={selected} 
          onChange={onSelectRow}
        />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={username} src={avatarUrl} sx={{ mr: 2 }} />
          <ListItemText
            primary={
              <>
                {username}
                {row.isBanned && <Iconify icon="mdi:account-off-outline" style={{ color: 'red', marginLeft: 4 }} fontSize="small" />}
              </>
            }
            secondary={`Member since ${new Date(membershipTime * 1000).toLocaleDateString()}`}
            primaryTypographyProps={{ typography: 'body2', display: 'flex', alignItems: 'center' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {gender === 1 ? 'Female' : gender === 0 ? 'Male' : 'Secrecy'}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{!isNaN(Date.parse(birthday)) ? new Date(birthday).toLocaleDateString() : 'Secrecy'}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{region}</TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="Quick Edit" placement="top" arrow>
            <IconButton color={quickEdit.value ? 'inherit' : 'default'} onClick={quickEdit.onTrue}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>

          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <UserQuickEditForm currentUser={row} open={quickEdit.value} onClose={quickEdit.onFalse} />

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

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
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
