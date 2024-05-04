import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect, useNavigate, useMemo } from 'react';

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

import OrgTableRow from '../org-table-row';
import UserTableToolbar from '../user-table-toolbar';
import UserTableFiltersResult from '../user-table-filters-result';
import { apiInstance, endpoints } from 'src/apis';
import { useWebSocketManager } from '../../../websocket/context/websocket_provider';
// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'untreated', label: 'Untreated' },
  { value: 'agreed', label: 'Agreed' },
  { value: 'refused', label: 'Refused' },
];

const TABLE_HEAD = [
  { id: 'checkbox', label: ''},
  { id: 'username', label: 'Username' },
  { id: '', label: 'Operation', width: 88 },
];

const defaultFilters = {
  username: '',
};

// ----------------------------------------------------------------------

export default function OrgListView() {
  const { wsManager } = useWebSocketManager() // get ws conn

  const { enqueueSnackbar } = useSnackbar();

  const table = useTable();

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const [userData, setUserData] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

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

  const fetchAllOrgrs = async () => {
    try {
      const response = await apiInstance.get(endpoints.organize.all);
      return response.data;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  };

  const updateUserStatus = (userId, newStatus) => {
    setUserData(prevUsers => prevUsers.map(user => user.userId === userId ? { ...user, status: newStatus } : user));
  };

  const agreeById = async (userId) => {
    try {
      const response = await apiInstance.post(endpoints.organize.agree(userId));
      updateUserStatus(userId, 'agreed');
      return response.data;
    } catch (error) {
      if (error.response.data.status_msg) {
        console.error('Error agree application:', error.response.data.status_msg);
        throw new Error(error.response.data.status_msg);
      } else {
        console.error('Error agree application:', error);
        throw error;
      }
    }
  };

  const refuseById = async (userId) => {
    try {
      const response = await apiInstance.post(endpoints.organize.refuse(userId));
      updateUserStatus(userId, 'refused');
      return response.data;
    } catch (error) {
      if (error.response.data.status_msg) {
        console.error('Error refuse application:', error.response.data.status_msg);
        throw new Error(error.response.data.status_msg);
      } else {
        console.error('Error refuse application:', error);
        throw error;
      }
    }
  };

  const agreeUser = useCallback(async (userId) => {
    try {
      const response = await agreeById(userId);
      if (response.status_code === 0) {
        enqueueSnackbar('User agreed successfully!', { variant: 'success' });
      }
    } catch (error) {
      const errorMessage = error.message || 'Error agree application';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  }, [enqueueSnackbar, setUserData]);
  
  const refuseUser = useCallback(async (userId) => {
    try {
      const response = await refuseById(userId);
      if (response.status_code === 0) {
        enqueueSnackbar('User refuseed successfully!', { variant: 'success' });
      }
    } catch (error) {
      const errorMessage = error.message || 'Error refuse application';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  }, [enqueueSnackbar, setUserData]);  

  const handleWsMessage = (e)=>{
    if (JSON.parse(e.data).Type === "new_online") {
      console.log("new!!!")
      enqueueSnackbar("New user coming online")
      setOnlineUsers(pre => [...pre, JSON.parse(e.data).userID])
      return
    }
    setOnlineUsers(JSON.parse(e.data).onlineUsers)
  }
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await fetchAllOrgrs();
        if (userData.status_code === 0) {
          const updatedUserData = userData.Data.map(user => {            
            return {
              ...user
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
  
  const [currentTab, setCurrentTab] = useState('all');

  const filteredData = userData.filter(user => {
    if (currentTab === 'all') return true;
    return user.status === currentTab;
  });

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'User', href: paths.user.list },
            { name: 'Organizer' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                iconPosition="end"
              />
            ))}
          </Tabs>

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
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                />

                <TableBody>
                  {onlineUsers && filteredData
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((user) => (
                      <OrgTableRow
                        key={user.userId}
                        row={user}
                        agreeRow={() => agreeUser(user.userId)}
                        refuseRow={() => refuseUser(user.userId)}
                        onSelectRow={() => handleSelectRow(user.userId)}
                        isOnline={onlineUsers?.includes(user.userId)}
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