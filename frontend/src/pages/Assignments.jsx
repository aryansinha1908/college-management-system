import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Heading, Text, Spinner, Flex, Button, HStack, VStack, Badge, SimpleGrid, Alert, AlertIcon } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

function Assignments() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const assignmentsResponse = await api.get("/assignments");
                setAssignments(assignmentsResponse.data.assignments || []);
                const submissionsResponse = await api.get(`/submissions/${user._id}/submissions`);
                setSubmissions(submissionsResponse.data.submissions || []);
            } catch (e) {
                console.error("Failed to fetch Data:", e);
                setErrorMessage(e.response?.data?.message || "Failed to load Data.");
            } finally {
                setLoading(false);
            }
        };
        fetchAssignments();
    }, [user._id]);

    if (loading) {
        return (
            <Flex minH="100vh" align="center" justify="center" bg="gray.900">
                <Spinner size="xl" color="blue.500" thickness="4px" />
            </Flex>
        );
    }

    if (errorMessage) {
        return (
            <Box minH="100vh" bg="gray.900" p={8}>
                <Alert status="error" bg="red.900" color="red.100" rounded="md">
                    <AlertIcon color="red.400" />
                    {errorMessage}
                </Alert>
            </Box>
        );
    }

    return (
        <Box bg="gray.900" minH="100vh" p={8}>
            <HStack justify="space-between" align="flex-start" mb={8}>
                <Box>
                    <Heading color="white" mb={2}>Assignments</Heading>
                    <Text color="gray.400">
                        {user?.role === 'student' 
                            ? "View and submit your pending Assignments." 
                            : "Manage course assignments."}
                    </Text>
                </Box>

                {(user?.role === "admin" || user?.role === "professor") && (
                    <Button colorScheme="blue" fontWeight="bold" onClick={() => navigate("/create-assignments")}>
                        + Create Assignment
                    </Button>
                )}
            </HStack>

            {assignments.length === 0 ? (
                <Flex bg="gray.800" p={10} rounded="xl" justify="center" border="1px dashed" borderColor="gray.600">
                    <Text color="gray.500" fontSize="lg">No assignments found at this time.</Text>
                </Flex>
            ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {assignments.map((a) => {
                            const studentSubmission = submissions.find(sub => sub.assignmentId === a._id);
                            return (
                                <Box 
                                    key={a._id} 
                                    bg="gray.800" 
                                    p={6} 
                                    rounded="xl" 
                                    shadow="lg"
                                    border="1px solid"
                                    borderColor="gray.700"
                                    display="flex"
                                    flexDirection="column"
                                    transition="all 0.2s"
                                    _hover={{ transform: "translateY(-4px)", shadow: "2xl", borderColor: "blue.500" }}
                                >
                                    <VStack align="start" spacing={3} flex="1">
                                        <HStack w="full" justify="space-between">
                                            <Badge colorScheme="purple" rounded="md" px={2} py={1}>
                                                {a.courseId || "COURSE"}
                                            </Badge>
                                            <Badge colorScheme={new Date(a.dueDate) < new Date() ? "red" : "green"}>
                                                {new Date(a.dueDate) < new Date() ? "OVERDUE" : "ACTIVE"}
                                            </Badge>
                                        </HStack>

                                        <Heading size="md" color="white" mt={2}>{a.title}</Heading>
                                        <Text color="gray.400" fontSize="sm" noOfLines={3}>
                                            {a.description}
                                        </Text>
                                    </VStack>

                                    <HStack 
                                        mt={6} 
                                        pt={4} 
                                        w="full" 
                                        justify="space-between" 
                                        borderTop="1px solid" 
                                        borderColor="gray.700"
                                    >
                                        <Text color="gray.500" fontSize="sm" fontWeight="bold">
                                            Due: {new Date(a.dueDate).toLocaleDateString()}
                                        </Text>

                                        {user?.role === "student" ? (
                                            studentSubmission ? (
                                                <Button size="sm" colorScheme="teal" variant="outline" onClick={() => navigate(`/submissions/${studentSubmission._id || a._id}`)}>
                                                    View Submission
                                                </Button>
                                            ) : (
                                                <Button size="sm" colorScheme="green" onClick={() => navigate(`/submit-assignments/${a._id}`)}>
                                                    Submit
                                                </Button>
                                            )
                                        ) : (
                                            <HStack spacing={2}>
                                                <Button size="sm" variant="outline" colorScheme="teal" onClick={() => navigate(`/assignments/${a._id}/submissions`)}>
                                                    View Submissions
                                                </Button>
                                                <Button size="sm" variant="outline" colorScheme="blue" onClick={() => navigate(`/manage-assignments/${a._id}`)}>
                                                    Edit
                                                </Button>
                                            </HStack>
                                        )}
                                    </HStack>
                                </Box>
                            );
                        }
                    )}
                </SimpleGrid>
            )}
        </Box>
    );
}

export default Assignments;
