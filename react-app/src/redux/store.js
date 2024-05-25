import {configureStore} from "@reduxjs/toolkit";
import userReducer from './UserSlice';
import EmployerSlice from "./EmployerSlice";
import formSlice from "./FormSlice";
import EmployeeSlice from "./EmployeeSlice";

const store = configureStore({
    reducer:{
        form: formSlice,
        user: userReducer,
        employers: EmployerSlice,
        employees: EmployeeSlice,
    }
});

export default store;