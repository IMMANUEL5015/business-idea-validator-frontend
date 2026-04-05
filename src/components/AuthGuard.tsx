import { Navigate, Outlet } from "react-router-dom";

const AuthGuard = () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default AuthGuard;