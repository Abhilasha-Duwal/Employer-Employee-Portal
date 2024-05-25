import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for admin login
export const loginAdmin = createAsyncThunk(
  "user/loginAdmin",
  async (userCredentials) => {
    const request = await axios.post(
      `http://localhost:5000/api/v1/auth/login/admin`,
      userCredentials
    );
    const response = await request.data;
    console.log("adminSlice", response);
    localStorage.setItem("user", JSON.stringify(response));
    return response;
  }
);

// Async thunk for employer login
export const loginEmployer = createAsyncThunk(
  "user/loginEmployer",
  async (userCredentials) => {
    const request = await axios.post(
      `http://localhost:5000/api/v1/auth/login/employer`,
      userCredentials
    );
    const response = await request.data;
    console.log("employerSlice", response);
    localStorage.setItem("user", JSON.stringify(response));
    return response;
  }
);

// Async thunk for employee login
export const loginEmployee = createAsyncThunk(
  "user/loginEmployee",
  async (userCredentials) => {
    const request = await axios.post(
      `http://localhost:5000/api/v1/auth/login/employee`,
      userCredentials
    );
    const response = await request.data;
    console.log("employeeSlice", response);
    localStorage.setItem("user", JSON.stringify(response));
    return response;
  }
);

// Action for logout
export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("user");
  dispatch(userSlice.actions.logout());
};

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    user: null,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Admin login cases
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.user = null;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        console.log(action.error.message);
        if (action.error.message === "Request failed with status code 401") {
          state.error = "Access Denied Invalid Credentials";
        } else {
          state.error = action.error.message;
        }
      })
      // Employer login cases
      .addCase(loginEmployer.pending, (state) => {
        state.loading = true;
        state.user = null;
        state.error = null;
      })
      .addCase(loginEmployer.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginEmployer.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        console.log(action.error.message);
        if (action.error.message === "Request failed with status code 401") {
          state.error = "Access Denied Invalid Credentials";
        } else {
          state.error = action.error.message;
        }
      })
      // Employee login cases
      .addCase(loginEmployee.pending, (state) => {
        state.loading = true;
        state.user = null;
        state.error = null;
      })
      .addCase(loginEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginEmployee.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        console.log(action.error.message);
        if (action.error.message === "Request failed with status code 401") {
          state.error = "Access Denied Invalid Credentials";
        } else {
          state.error = action.error.message;
        }
      })
  },
});

export default userSlice.reducer;
