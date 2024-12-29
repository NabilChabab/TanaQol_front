export interface UserState {
  id: string | null;
  username: string | null;
  role: string | null;
  isAuthenticated: boolean;
}

export const initialUserState: UserState = {
  id: null,
  username: null,
  role: null,
  isAuthenticated: false,
};
