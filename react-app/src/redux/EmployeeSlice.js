import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import getCurrentUser from "../utility/getUser";

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

// Add employees in bulk
export const uploadEmployees = createAsyncThunk(
  "employees/upload",
  async (excelFile, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("excelFile", excelFile); // Assuming 'excelFile' is the name of the file field expected by the server

      const response = await createAxiosInstance().post(
        "/users/employees/upload",
        formData, // Send FormData object as the request body
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set Content-Type to multipart/form-data for file upload
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data); // Return error message from server
    }
  }
);

// Async thunk for fetching own employee details
export const fetchOwnDetail = createAsyncThunk(
  "employees/fetchmyself",
  async (userId) => {
    try {
      const response = await createAxiosInstance().get(
        `/users/employees/me/${userId}`
      );
      return response.data;
    } catch (error) {
      throw Error("Failed to fetch your details");
    }
  }
);

// Async thunk for fetching employees
export const fetchEmployees = createAsyncThunk("employees/fetch", async () => {
  try {
    const response = await createAxiosInstance().get("/users/employees");
    return response.data;
  } catch (error) {
    throw Error("Failed to fetch employees");
  }
});

// Async thunk for create employee
export const createEmployee = createAsyncThunk(
  "employees/create",
  async (employeeData, { rejectWithValue }) => {
    try {
      const response = await createAxiosInstance().post(
        "/auth/register/employee",
        employeeData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data); // Return error message from server
    }
  }
);

// Async thunk for updating employees by id
export const updateEmployee = createAsyncThunk(
  "employees/update",
  async (updatedEmployee) => {
    const response = await createAxiosInstance().put(
      `/users/employees/find/${updatedEmployee.id}`,
      updatedEmployee
    );
    return response.data;
  }
);

// Async thunk for add more details of employees (PATCH)
export const patchEmployee = createAsyncThunk(
  "employees/patch",
  async ({ id, updatedFields }) => {
    const response = await createAxiosInstance().patch(
      `/users/employees/${id}`,
      updatedFields
    );
    return response.data;
  }
);

// UPDATE USER BY User Itself AND IF ROLE IS EMPLOYEE UPDATE DETAILS EXCEPT annual salary, job title and user role fields
export const EditEmployeeItself = createAsyncThunk(
  "employees/updateSelf",
  async ({ userId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await createAxiosInstance().put(
        `/users/employees/${userId}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for deleting employees
export const deleteEmployee = createAsyncThunk(
  "employees/delete",
  async (employeeId) => {
    await createAxiosInstance().delete(`/users/employees/${employeeId}`);
    return employeeId;
  }
);

const employeeSlice = createSlice({
  name: "employees",
  initialState: {
    loading: false,
    employees: [],
    employeeDetail: null,
    error: null,
    currentPage: 1,
    employeesPerPage: 5,
  },
  reducers: {
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(uploadEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchOwnDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOwnDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeDetail = action.payload;
        state.error = null;
      })
      .addCase(fetchOwnDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(EditEmployeeItself.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(EditEmployeeItself.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeDetail = action.payload;
        state.error = null;
      })
      .addCase(EditEmployeeItself.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees.push(action.payload); // Add the new employee to the state
        state.error = null;
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const updatedEmployee = action.payload;
        if (Array.isArray(state.employees)) {
          state.employees = state.employees.map((employee) =>
            employee.id === updatedEmployee.id ? updatedEmployee : employee
          );
        } else {
          state.employees = [updatedEmployee];
        }
      })
      .addCase(patchEmployee.fulfilled, (state, action) => {
        const updatedEmployee = action.payload;
        if (Array.isArray(state.employees)) {
          state.employees = state.employees.map((employee) =>
            employee.id === updatedEmployee.id ? updatedEmployee : employee
          );
        } else {
          state.employees = [updatedEmployee];
        }
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        const deletedEmployeeId = action.payload;
        if (Array.isArray(state.employees)) {
          state.employees = state.employees.filter(
            (employee) => employee.id !== deletedEmployeeId
          );
        }
      });
  },
});

export const { setCurrentPage } = employeeSlice.actions;
export const selectCurrentPage = (state) => state.employees.currentPage;
export const selectEmployeesPerPage = (state) =>
  state.employees.employeesPerPage;
export const selectEmployees = (state) => state.employees.employees;
export const selectEmployeeDetail = (state) => state.employees.employeeDetail;

export default employeeSlice.reducer;
