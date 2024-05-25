import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import getCurrentUser from "../utility/getUser"

// Function to create Axios instance with headers
const createAxiosInstance = () => {
  const user = getCurrentUser();
  const token = user ? user.accessToken : null;

  const instance = axios.create({
    baseURL: "http://localhost:5000/api/v1",
    headers: {
      "Content-Type": "application/json",
      token: `Bearer ${token}`,
    },
  });

  return instance;
};

// Async thunk for fetching employers
export const fetchEmployers = createAsyncThunk("employers/fetch", async () => {
  try {
    const response = await createAxiosInstance().get("/users/employers");
    return response.data;
  } catch (error) {
    throw Error("Failed to fetch employers");
  }
});

// Async thunk for create employer
export const createEmployer = createAsyncThunk(
  "employers/create",
  async (employerData, { rejectWithValue }) => {
    try {
      const response = await createAxiosInstance().post(
        "/auth/register/employer",
        employerData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data); // Return error message from server
    }
  }
);

// Async thunk for updating employers (PUT)
export const updateEmployer = createAsyncThunk(
  "employers/update",
  async (updatedEmployer) => {
    const response = await createAxiosInstance().put(
      `/users/employers/${updatedEmployer.id}`,
      updatedEmployer
    );
    return response.data;
  }
);

// Async thunk for patching employers (PATCH)
export const patchEmployer = createAsyncThunk(
  "employers/patch",
  async ({ id, updatedFields }) => {
    const response = await createAxiosInstance().patch(
      `/users/employers/${id}`,
      updatedFields
    );
    return response.data;
  }
);

// Async thunk for deleting employers
export const deleteEmployer = createAsyncThunk(
  "employers/delete",
  async (employerId) => {
    await createAxiosInstance().delete(`/users/employers/${employerId}`);
    return employerId;
  }
);

const employerSlice = createSlice({
  name: "employers",
  initialState: {
    loading: false,
    employers: [],
    error: null,
  },
  reducers: {
    // You can add any additional reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployers.fulfilled, (state, action) => {
        state.loading = false;
        state.employers = action.payload;
        state.error = null;
      })
      .addCase(fetchEmployers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createEmployer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployer.fulfilled, (state, action) => {
        state.loading = false;
        state.employers.push(action.payload); // Add the new employer to the state
        state.error = null;
      })
      .addCase(createEmployer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateEmployer.fulfilled, (state, action) => {
        const updatedEmployer = action.payload;
        state.employers = state.employers.map((employer) =>
          employer.id === updatedEmployer.id ? updatedEmployer : employer
        );
      })
      .addCase(patchEmployer.fulfilled, (state, action) => {
        const updatedEmployer = action.payload;
        state.employers = state.employers.map((employer) =>
          employer.id === updatedEmployer.id ? updatedEmployer : employer
        );
      })
      .addCase(deleteEmployer.fulfilled, (state, action) => {
        const deletedEmployerId = action.payload;
        state.employers = state.employers.filter(
          (employer) => employer.id !== deletedEmployerId
        );
      });
  },
});

export const selectEmployers = (state) => state.employers.employers;

export default employerSlice.reducer;
