import React from "react";
import { Navigate } from "react-router";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const username = localStorage.getItem("username");
    if (!username) {
        return <Navigate to="/login" replace />;
    }
    return <div>{children}</div>;
};

export default ProtectedRoute;
