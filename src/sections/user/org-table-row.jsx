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

export default function OrgTableRow({ row, selected, onSelectRow, agreeRow, refuseRow, isOnline }) {
  if (!row) {
    return null; 
  }
  //  console.log(row.userId)
  // const DEFAULT_AVATAR_URL = "avatar.jpg"; //默认头像？
  const { username, avatarUrl, membershipTime } = row;

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

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
         
          {row.status === 'untreated' ? (
            <>
              <Button
                onClick={() => agreeRow(row.userId)}
                sx={{ backgroundColor: '#e0f2f1', color: '#009688', '&:hover': { backgroundColor: '#b2dfdb' }, margin: '10px' }}
              >
                Agree
              </Button>
              <Button
                onClick={() => refuseRow(row.userId)}
                sx={{ backgroundColor: '#ffebee', color: '#f44336', '&:hover': { backgroundColor: '#ffcdd2' }, margin: '10px' }}
              >
                Refuse
              </Button>
            </>
          ) : (
            <Button disabled>{row.status === 'agreed' ? '已同意' : '已拒绝'}</Button>
          )}
        </TableCell>
      </TableRow>

    </>
  );
}

OrgTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func.isRequired,
  agreeRow: PropTypes.func.isRequired,
  refuseRow: PropTypes.func.isRequired,
  isOnline: PropTypes.bool.isRequired,
};