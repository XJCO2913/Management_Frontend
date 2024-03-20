import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import DeleteIcon from '@mui/icons-material/Delete';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import UserTableRow from '../user-table-row';
import UserTableToolbar from '../user-table-toolbar';
import UserTableFiltersResult from '../user-table-filters-result';
import { fetchAllUsers, deleteUserById, deleteUserByIds, banUserById, unbanUserById } from 'src/apis';
// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }];

const TABLE_HEAD = [
  { id: 'checkbox', label: ''},
  { id: 'username', label: 'Username' },
  { id: 'gender', label: 'Gender' },
  { id: 'birthday', label: 'Birthday' },
  { id: 'region', label: 'Region' },
  { id: '', width: 88 },
];

const defaultFilters = {
  username: '',
};

// ----------------------------------------------------------------------

export default function UserListView() {
  const { enqueueSnackbar } = useSnackbar();

  const table = useTable();

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const [userData, setUserData] = useState([]);

  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: userData,
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 56 + 20;

  const canReset = !!filters.username;

  const notFound = !dataFiltered.length;

  const handleFilters = useCallback(
    (username, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [username]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleSelectRow = (userId) => {
    setSelectedUserIds((prevSelected) => {
      const isSelected = prevSelected.includes(userId);
      if (isSelected) {
        return prevSelected.filter((id) => id !== userId);
      } else {
        return [...prevSelected, userId];
      }
    });
  };

  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const handleDeleteRow = useCallback(
    async (userId) => {
      try {
        const response = await deleteUserById(userId);
        console.log('Delete response:', response);
  
        enqueueSnackbar('Delete success!', { variant: 'success' });
  
        updateUserDataAfterDeletion([userId]);
  
      } catch (error) {
        enqueueSnackbar('Error deleting user', { variant: 'error' });
      }
    },
    [enqueueSnackbar]
  );

  const handleBanUser = useCallback(async (userId) => {
    try {
      const response = await banUserById(userId);
      console.log('Ban response:', response);
      
      enqueueSnackbar('User banned successfully!', { variant: 'success' });
      
    } catch (error) {
      console.error('Error banning user:', error);
      enqueueSnackbar('Error banning user', { variant: 'error' });
    }
  }, [enqueueSnackbar]);
  
  const handleUnbanUser = useCallback(async (userId) => {
    try {
      const response = await unbanUserById(userId);
      console.log('Unban response:', response);
      
      enqueueSnackbar('User unbanned successfully!', { variant: 'success' });
  
    } catch (error) {
      console.error('Error unbanning user:', error);
      enqueueSnackbar('Error unbanning user', { variant: 'error' });
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await fetchAllUsers();
        // console.log('API Response:', data);
  
        if (data.status_code === 0) {
          console.log('Data received:', data.Data);
          setUserData(data.Data);
        } else {
          throw new Error(data.status_msg);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        enqueueSnackbar('An error occurred while fetching user data', { variant: 'error' });
      }
    };
  
    fetchUserData();
  }, [enqueueSnackbar]);  

  const handleBatchDelete = async () => {
    if (selectedUserIds.length === 0) {
      enqueueSnackbar('No users selected', { variant: 'warning' });
      return;
    }
  
    try {
      const response = await deleteUserByIds(selectedUserIds.join('|'));
      console.log('Batch delete response:', response);
  
      updateUserDataAfterDeletion(selectedUserIds);
  
      setSelectedUserIds([]);
  
      enqueueSnackbar('Users deleted successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Error deleting users', { variant: 'error' });
    }
  };
  
  function updateUserDataAfterDeletion(deletedUserIds) {
    setUserData(prevUserData =>
      prevUserData.filter(user => !deletedUserIds.includes(user.userId))
    );
  }  
  
  const handleEditRow = useCallback(
    (userId) => {
      router.push(paths.dashboard.user.edit(userId));
    },
    [router]
  );
  
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'User', href: paths.dashboard.user.root },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.user.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New User
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <Tabs
            value="all"
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
              />
            ))}
          </Tabs>
          
          <UserTableToolbar
            filters={filters}
            onFilters={handleFilters}
          />

          {canReset && (
            <UserTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((user) => user.userId)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            {
              selectedUserIds.length > 0 && (
                <Tooltip title="Delete selected users">
                  <IconButton onClick={handleBatchDelete} color="primary">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )
            }

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((user) => (
                      <UserTableRow
                        key={user.userId}
                        row={user}
                        onDeleteRow={() => handleDeleteRow(user.userId)}
                        onEditRow={() => handleEditRow(user.userId)}
                        onBanRow={() => handleBanUser(user.userId)}
                        onUnbanRow={() => handleUnbanUser(user.userId)}
                        onSelectRow={() => handleSelectRow(user.userId)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, filters }) {
  const { username } = filters;

  let filteredData = inputData;

  if (username) {
    filteredData = inputData.filter(
      (user) => user.username.toLowerCase().indexOf(username.toLowerCase()) !== -1
    );
  }

  return filteredData || [];
}
