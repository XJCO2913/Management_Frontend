import PropTypes from 'prop-types';
import { useMemo, useEffect, useReducer, useCallback } from 'react';

import axios from 'src/utils/axios';

import { AuthContext } from './auth-context';
import { setSession, isValidToken, jwtDecode } from './utils';
import { adminEndpoints } from '../../../apis';

// ----------------------------------------------------------------------
/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */
// ----------------------------------------------------------------------

const initialState = {
  user: null,
  loading: true,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL')
  {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN')
  {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER')
  {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT')
  {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try
    {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);

      if (accessToken && isValidToken(accessToken))
      {
        setSession(accessToken);

        const payload = jwtDecode(accessToken)
        const adminID = payload.userID

        dispatch({
          type: 'INITIAL',
          payload: {
            user: {
              adminID,
              accessToken,
            },
          },
        });
      } else
      {
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
          },
        });
      }
    } catch (error)
    {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (name, password) => {
    const data = {
      name,
      password,
    };

    try {
      const response = await axios.post(adminEndpoints.auth.login, data);
      if (response.data.status_code === 0)
      {
        const { token, adminID } = response.data.Data;

        setSession(token);
        sessionStorage.removeItem("adminID")
        sessionStorage.setItem("adminID", adminID)

        dispatch({
          type: 'LOGIN',
          payload: {
            user: {
              adminID,
              token,
            },
          },
        });

        return {
          success: true,
        }
      } else
      {
        return {
          success: false,
          errMsg: response.data.Data.status_msg,
        }
      }
    } catch (err) {
      return {
        success: false,
        errMsg: err.status_msg,
      }
    }
  }, []);

  // REGISTER
  // const register = useCallback(async (email, password, firstName, lastName) => {
  //   const data = {
  //     email,
  //     password,
  //     firstName,
  //     lastName,
  //   };

  //   const response = await axios.post(endpoints.auth.register, data);

  //   const { accessToken, user } = response.data;

  //   sessionStorage.setItem(STORAGE_KEY, accessToken);

  //   dispatch({
  //     type: 'REGISTER',
  //     payload: {
  //       user: {
  //         ...user,
  //         accessToken,
  //       },
  //     },
  //   });
  // }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      logout,
    }),
    [login, logout, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
