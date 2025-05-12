import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import jwt from "jsonwebtoken";

const BASE_URL = "http://localhost:3001/api";
// Define types for credentials
interface Credentials {
  email: string;
  password: string;
}

// Define the auth state type
interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  registrationSuccess: boolean;
  user: null | { email: string; userId: string };
}

// Async action to handle login
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }: Credentials, { rejectWithValue }) => {
    try {
      const res = await fetch(BASE_URL + "/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify JSON content type
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await res.json();
      return data.token;
    } catch (error: any) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

// Async action to handle registration
export const register = createAsyncThunk(
  "auth/register",
  async ({ email, password }: Credentials, { rejectWithValue }) => {
    try {
      const res = await fetch(BASE_URL + "/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify JSON content type
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await res.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Registration failed");
    }
  }
);

// Define the auth slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    registrationSuccess: false,
  } as AuthState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        localStorage.setItem("token", action.payload);
        state.token = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        const decodedToken = jwt.decode(action.payload) as {
          email: string;
          userId: string;
        };
        state.user = {
          email: decodedToken.email,
          userId: decodedToken.userId,
        };
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Registration cases
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registrationSuccess = false;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.registrationSuccess = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.registrationSuccess = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
