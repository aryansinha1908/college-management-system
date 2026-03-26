import { useEffect, useState } from "react";
import { useAuth } from '../context/AuthContext';
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    } 
    if (!isAuthenticated) {
        return <Navigate to="/login"/>
    } 

    return children;
}

export default ProtectedRoute;
