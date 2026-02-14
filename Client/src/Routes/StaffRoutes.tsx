import { Route ,Routes } from "react-router-dom"
import StaffLogin from "../Pages/staff/StaffLogin"
import Dashboard from "../Pages/staff/Dashboard"
import StaffPrivateRoute from "./staff/StaffPrivateRoute"
import StaffPublicRoute from "./staff/StaffPublicRoute"
import Items from "../Pages/staff/Items"
const StaffRoutes = () => {
  return (
    <div>
        <Routes>
          <Route element={<StaffPublicRoute/>}>
           <Route path="/login" element={<StaffLogin/>}/>
          </Route>         
          <Route path="/dashboard" element={<StaffPrivateRoute><Dashboard/></StaffPrivateRoute>}/>
          <Route path ="/items" element={<StaffPrivateRoute><Items/></StaffPrivateRoute>}/>
        </Routes>
    </div>
  )
}

export default StaffRoutes