import { Navigate } from "react-router-dom";

const ProtectedRoute = ({children}: {children: React.ReactNode }) => {
    const isLoggedIn = !!localStorage.getItem("token");
    return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;