import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login";
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import MyCourses from './pages/MyCourses';
import Assignments from './pages/Assignments';
import CreateAssignments from './pages/CreateAssignments';
import ManageAssignments from './pages/ManageAssignments';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import SubmitAssignment from "./pages/SubmitAssignment";
import ViewSubmission from "./pages/ViewSubmission";
import ViewSubmissions from "./pages/ViewSubmissions";

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
            <Route 
                path="/assignments"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Assignments />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route 
                path="/create-assignments"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <CreateAssignments />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route 
                path="/manage-assignments/:assignmentId"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <ManageAssignments />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route 
                path="/submit-assignments/:assignmentId"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <SubmitAssignment />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route 
                path="/submissions/:id"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <ViewSubmission />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route 
                path="/assignments/:assignmentId/submissions"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <ViewSubmissions />
                        </Layout>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;
