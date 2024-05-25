import { Navigate } from "react-router-dom";
import getCurrentUser from "./utility/getUser";
// let CURRENT_USER_TYPE;

export const EmployeeElement = ({ children }) => {
  const CURRENT_USER = getCurrentUser();
  return !CURRENT_USER ? <Navigate to={"/login"} /> : <>{children}</>;
};
export const EmployerElement = ({ children }) => {
  const CURRENT_USER = getCurrentUser();
  return !CURRENT_USER ? <Navigate to={"/login"} /> : <>{children}</>;
};

export const AdminElement = ({ children }) => {
  const CURRENT_USER = getCurrentUser();
  return !CURRENT_USER ? <Navigate to={"/login"} /> : <>{children}</>;
};
