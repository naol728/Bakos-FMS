import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { me } from "@/api/auth";

const getStoredUser = () => {
  const stored = localStorage.getItem("user");
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch (err) {
    console.error("Failed to parse user from localStorage:", err);
    return null;
  }
};

const storedUser = getStoredUser();
const storedRole = localStorage.getItem("role") || null;
const storedToken = localStorage.getItem("token") || null;

const initialState = {
  user: storedUser,
  role: storedRole,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,
};

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("No token found");

      const res = await me(); // API call to fetch user
      return res.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      state.error = null;

      localStorage.setItem("user", JSON.stringify(action.payload));
      localStorage.setItem("role", action.payload.role);
      if (action.payload.session?.access_token) {
        localStorage.setItem("token", action.payload.session.access_token);
      }
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      state.error = null;

      // Clear localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.role = action.payload.role;
        state.isAuthenticated = true;

        // Update localStorage
        localStorage.setItem("user", JSON.stringify(action.payload));
        localStorage.setItem("role", action.payload.role);
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
        state.error = action.payload;

        // Clear localStorage
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        localStorage.removeItem("token");
      });
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
