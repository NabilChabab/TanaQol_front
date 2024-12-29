import { createReducer, on } from '@ngrx/store';
import { loginSuccess, logout } from './user.actions';
import { UserState, initialUserState } from './user.state';

export const userReducer = createReducer(
  initialUserState,
  on(loginSuccess, (state, { id, username, role }) => ({
    ...state,
    id,
    username,
    role,
    isAuthenticated: true,
  })),
  on(logout, () => initialUserState)
);
