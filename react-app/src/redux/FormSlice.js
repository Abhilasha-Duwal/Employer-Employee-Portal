import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: "",
  email: "",
  password: "",
  address: "",
  mobile: "",
  annualSalary: "",
  jobTitle: "",
  userRole: "",
  showPassword: false,
  file:"",
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setUsername(state, action) {
      state.username = action.payload;
    },
    setEmail(state, action) {
      state.email = action.payload;
    },
    setPassword(state, action) {
      state.password = action.payload;
    },
    setAddress(state, action) {
      state.address = action.payload;
    },
    setMobile(state, action) {
      state.mobile = action.payload;
    },
    setAnnualSalary(state, action) {
      state.annualSalary = action.payload;
    },
    setJobTitle(state, action) {
      state.jobTitle = action.payload;
    },
    setUserRole(state, action) {
      state.userRole = action.payload;
    },
    togglePasswordVisibility(state) {
      state.showPassword = !state.showPassword;
    },
    setFile(state, action) {
      state.file = action.payload;
    },
    resetForm(state) {
      return initialState;
    },
  },
});

export const {
  setUsername,
  setEmail,
  setPassword,
  setAddress,
  setMobile,
  setAnnualSalary,
  setJobTitle,
  setUserRole,
  togglePasswordVisibility,
  setFile,
  resetForm,
} = formSlice.actions;

export default formSlice.reducer;
