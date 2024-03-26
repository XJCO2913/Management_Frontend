import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect, useNavigate } from 'react';

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
import { apiInstance, userEndpoints } from 'src/apis';
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

  const fetchAllUsers = async () => {
    try {
      const response = await apiInstance.get(userEndpoints.fetchAllUsers);
      return response.data;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  };

  const deleteUserById = async (userId) => {
    try {
      const response = await apiInstance.delete(userEndpoints.deleteUserById(userId));
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  const deleteUserByIds = async (userIdsString) => {
    try {
      const response = await apiInstance.delete(userEndpoints.deleteUserByIds(userIdsString));
      return response.data;
    } catch (error) {
      console.error('Error deleting users:', error);
      throw error;
    }
  };

  const banUserById = async (userId) => {
    try {
      const response = await apiInstance.post(userEndpoints.banUserById(userId));
      return response.data;
    } catch (error) {
      if (error.response.data.status_msg) {
        console.error('Error banning user:', error.response.data.status_msg);
        throw new Error(error.response.data.status_msg);
      } else {
        console.error('Error banning user:', error);
        throw error;
      }
    }
  };

  const unbanUserById = async (userId) => {
    try {
      const response = await apiInstance.post(userEndpoints.unbanUserById(userId));
      return response.data;
    } catch (error) {
      if (error.response.data.status_msg) {
        console.error('Error unbanning user:', error.response.data.status_msg);
        throw new Error(error.response.data.status_msg);
      } else {
        console.error('Error unbanning user:', error);
        throw error;
      }
    }
  };

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

   
  const handleEditRow = useCallback((userId) => () => {
    router.push(paths.user.edit(userId)); 
  }, [router]);

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
      if (response.status_code === 0) {
        setUserData((currentUsers) =>
          currentUsers.map((user) =>
            user.userId === userId ? { ...user, isBanned: true } : user
          )
        );
        enqueueSnackbar('User banned successfully!', { variant: 'success' });
      }
    } catch (error) {
      console.error('Error banning user:', error);
      enqueueSnackbar('Error banning user', { variant: 'error' });
    }
  }, [enqueueSnackbar, setUserData]);
  
  const handleUnbanUser = useCallback(async (userId) => {
    try {
      const response = await unbanUserById(userId);
      if (response.status_code === 0) {
        setUserData((currentUsers) =>
          currentUsers.map((user) =>
            user.userId === userId ? { ...user, isBanned: false } : user
          )
        );
        enqueueSnackbar('User unbanned successfully!', { variant: 'success' });
      }
    } catch (error) {
      console.error('Error unbanning user:', error);
      enqueueSnackbar('Error unbanning user', { variant: 'error' });
    }
  }, [enqueueSnackbar, setUserData]);  

  const handleBatchBan = async () => {
    if (selectedUserIds.length === 0) {
      enqueueSnackbar('No users selected', { variant: 'warning' });
      return;
    }
  
    try {
      const response = await apiInstance.post(userEndpoints.banUserByIds(selectedUserIds.join('|')));
      console.log('Batch ban response:', response);
      setUserData(currentUsers =>
        currentUsers.map(user =>
          selectedUserIds.includes(user.userId) ? { ...user, isBanned: true } : user
        )
      );
      enqueueSnackbar('Users banned successfully', { variant: 'success' });
    } catch (error) {
        const errorMessage = error.response && error.response.data && error.response.data.status_msg
        ? error.response.data.status_msg
        : 'Error banning users';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };
  
  const handleBatchUnban = async () => {
    if (selectedUserIds.length === 0) {
      enqueueSnackbar('No users selected', { variant: 'warning' });
      return;
    }
  
    try {
      const response = await apiInstance.post(userEndpoints.unbanUserByIds(selectedUserIds.join('|')));
      console.log('Batch unban response:', response);
      setUserData(currentUsers =>
        currentUsers.map(user =>
          selectedUserIds.includes(user.userId) ? { ...user, isBanned: false } : user
        )
      );
      enqueueSnackbar('Users unbanned successfully', { variant: 'success' });
    } catch (error) {
        const errorMessage = error.response && error.response.data && error.response.data.status_msg
        ? error.response.data.status_msg
        : 'Error unbanning users';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };  

  const fetchUserStatuses = async () => {
    try {
      const response = await apiInstance.get(userEndpoints.AllUserStatus);
        if (response.data.status_code === 0) {
          return response.data.Data; 
        } else {
          throw new Error(response.data.status_msg);
        }
    } catch (error) {
      console.error('Error fetching user statuses:', error);
      throw error;
    }
  };
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await fetchAllUsers();
        if (userData.status_code === 0) {
          const userStatuses = await fetchUserStatuses();
          const updatedUserData = userData.Data.map(user => {
            const status = userStatuses.find(status => status.userId === user.userId);
            return {
              ...user,
              isBanned: status ? status.isBanned : false,
            };
          });
          setUserData(updatedUserData);
        } else {
          throw new Error(userData.status_msg);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
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
  
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'User', href: paths.user.list },
            { name: 'List' },
          ]}
          action={
            <Button
              component={RouterLink}
              href="#"
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
                <>
                  <Tooltip title="Delete selected users">
                    <IconButton onClick={handleBatchDelete}
                      sx={{ color: 'error.main', ml: 1 }}
                    >
                      <Iconify icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Ban selected users">
                    <IconButton onClick={handleBatchBan}
                      sx={{ color: 'warning.main' }}
                    >
                      <Iconify icon="eva:slash-outline" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Unban selected users">
                    <IconButton onClick={handleBatchUnban}
                      sx={{ color: 'success.main' }}
                    >
                      <Iconify icon="eva:checkmark-circle-2-outline" />
                    </IconButton>
                  </Tooltip>
                </>
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