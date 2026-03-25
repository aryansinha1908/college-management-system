import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(
                    "http://localhost:3000/api/v1/users/profile",
                    { withCredentials: true }
                );
                setIsAuthenticated(true);
            } catch (e) {
                console.log(e.response?.data);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    } 
    if (!isAuthenticated) {
        return <Navigate to="/login"/>
    } 

    return children;
}

export default ProtectedRoute;
