import { Route, Routes } from "react-router-dom";
import StaffPrivateRoute from "./staff/StaffPrivateRoute";
import Items from "../Pages/staff/Items";
import Dashboard1 from "../Pages/staff/Dashboard1";
import Profile from "../Pages/staff/StaffProfile";
import ChefHistory from "../Pages/staff/ChefHistory";
import ChefAnalytics from "../Pages/staff/ChefAnalytics";

const ChefRoutes = () => {
    return (
        <div>
            <Routes>
                <Route
                    path="/dashboard"
                    element={
                        <StaffPrivateRoute>
                            <Dashboard1 />
                        </StaffPrivateRoute>
                    }
                />
                <Route
                    path="/items"
                    element={
                        <StaffPrivateRoute>
                            <Items />
                        </StaffPrivateRoute>
                    }
                />
                <Route path="/profile" element={<Profile />} />
                <Route
                    path="/history"
                    element={
                        <StaffPrivateRoute>
                            <ChefHistory />
                        </StaffPrivateRoute>
                    }
                />
                <Route
                    path="/analytics"
                    element={
                        <StaffPrivateRoute>
                            <ChefAnalytics />
                        </StaffPrivateRoute>
                    }
                />
            </Routes>
        </div>
    );
};

export default ChefRoutes;
