import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login";
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import MyCourses from './pages/MyCourses';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Navigate 
                        to="/login"
                    />} 
            />
            <Route 
                path="/login"
                element={
                    <LoginPage />
                } 
            />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Dashboard />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/courses"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Courses />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/my-courses"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <MyCourses/>
                        </Layout>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;
