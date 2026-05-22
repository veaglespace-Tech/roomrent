import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthUser } from "@/types";

interface AuthState {
  user: AuthUser | null;
}

const initialState: AuthState = {
  user: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
    }
  }
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

