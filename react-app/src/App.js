import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import EmployerLogin from "./pages/EmployerLogin";
import EmployeeLogin from "./pages/EmployeeLogin";
import AdminDashBoard from "./pages/AdminDashBoard";
import { EmployeeElement,EmployerElement, AdminElement } from "./ProtectedRoutes";
import EmployeeDashBoard from "./pages/EmployeeDashBoard";
import EmployerDashBoard from "./pages/EmployerDashBoard";
import AddMultipleEmployee from "./pages/AddMultipleEmployee";
import EditDetails from "./pages/EditDetails";

function App() {
  return (
    <div className="App">
        <Navbar />
        <Routes>
          <Route path="/register" exact element={<Register />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/edit/me" exact element={<EditDetails />} />
          <Route path="/add-multiple-employess" exact element={<AddMultipleEmployee />} /> 
          <Route path="/admin-login" exact element={<AdminLogin/>} />
          <Route path="/employer-login" exact element={<EmployerLogin />} />
          <Route path="/employee-login" exact element={<EmployeeLogin />} />
          <Route path="/employee-dashboard" exact element={<EmployeeElement><EmployeeDashBoard /></EmployeeElement>} />
          <Route path="/employer-dashboard" exact element={<EmployerElement><EmployerDashBoard /></EmployerElement>} />
          <Route path="/" exact element={<AdminElement><AdminDashBoard /></AdminElement>} />
        </Routes>
    </div>
  );
}

export default App;