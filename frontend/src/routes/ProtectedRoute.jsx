import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { authContext } from "../context/AuthContext";
import { getToken } from "../utils/auth";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { role } = useContext(authContext);
    const token = getToken();

    const isAllowed = allowedRoles.includes(role);
    const accessibleRoute =
        token && isAllowed ? children : <Navigate to="/login" replace={true} />;

    return accessibleRoute;
};

export default ProtectedRoute;