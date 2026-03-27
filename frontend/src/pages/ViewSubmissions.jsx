import { useState, useEffect } from "react";
import { Box, Heading, Text, Flex, Spinner, useToast, Button, Table, Thead, Tbody, Tr, Th, Td, Badge, HStack, VStack, TableContainer } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

function ViewSubmissions() {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const [submissions, setSubmissions] = useState([]);
    const [assignment, setAssignment] = useState(null);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [assignmentRes, submissionsRes] = await Promise.all([
                    api.get(`/assignments/${assignmentId}`),
                    api.get(`/submissions/${assignmentId}/submissions`)
                ]);

                setAssignment(assignmentRes.data.assignment || assignmentRes.data);
                setSubmissions(submissionsRes.data.submissions || []);
            } catch (error) {
                toast({
                    title: "Error Loading Data",
                    description: "Could not fetch submissions.",
                    status: "error",
                    duration: 4000,
                    isClosable: true,
                    position: "top-right"
                });
                navigate("/assignments");
            } finally {
                setIsFetching(false);
            }
        };

        fetchData();
    }, [assignmentId, navigate, toast]);

    if (isFetching) {
        return (
            <Flex bg="gray.900" minH="100vh" align="center" justify="center">
                <Spinner size="xl" color="blue.500" thickness="4px" />
            </Flex>
        );
    }

    return (
        <Box bg="gray.900" minH="100vh" p={8}>
            <VStack align="stretch" spacing={6} maxW="5xl" mx="auto">
                <HStack justify="space-between" flexWrap="wrap" gap={4}>
                    <Box>
                        <Heading color="white" size="lg" mb={2}>
                            {assignment?.title || "Assignment"} Submissions
                        </Heading>
                        <Text color="gray.400">
                            Review and provide feedback for student submissions.
                        </Text>
                    </Box>
                    <Button variant="outline" colorScheme="gray" color="white" onClick={() => navigate("/assignments")}>
                        Back to Assignments
                    </Button>
                </HStack>

                <Box bg="gray.800" rounded="xl" shadow="2xl" border="1px solid" borderColor="gray.700" overflow="hidden">
                    {submissions.length === 0 ? (
                        <Flex p={10} justify="center">
                            <Text color="gray.500" fontSize="lg">No students have submitted this assignment yet.</Text>
                        </Flex>
                    ) : (
                        <TableContainer>
                            <Table variant="simple" colorScheme="gray">
                                <Thead bg="gray.900">
                                    <Tr>
                                        <Th color="gray.400" borderBottomColor="gray.700">Student ID</Th>
                                        <Th color="gray.400" borderBottomColor="gray.700">Submitted At</Th>
                                        <Th color="gray.400" borderBottomColor="gray.700">Status</Th>
                                        <Th color="gray.400" borderBottomColor="gray.700" isNumeric>Action</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {submissions.map((sub) => (
                                        <Tr key={sub._id} _hover={{ bg: "gray.750" }} transition="background 0.2s">
                                            <Td color="white" fontWeight="medium" borderBottomColor="gray.700">
                                                {sub.studentId}
                                            </Td>
                                            <Td color="gray.300" borderBottomColor="gray.700">
                                                {new Date(sub.createdAt).toLocaleDateString()} at {new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Td>
                                            <Td borderBottomColor="gray.700">
                                                <Badge colorScheme={sub.feedback ? "green" : "yellow"} rounded="md" px={2} py={1}>
                                                    {sub.feedback ? "Reviewed" : "Pending"}
                                                </Badge>
                                            </Td>
                                            <Td isNumeric borderBottomColor="gray.700">
                                                <Button 
                                                    size="sm" 
                                                    colorScheme="teal" 
                                                    variant={sub.feedback ? "ghost" : "outline"}
                                                    onClick={() => navigate(`/submissions/${sub._id}`)}
                                                >
                                                    {sub.feedback ? "View" : "Review"}
                                                </Button>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            </VStack>
        </Box>
    );
}

export default ViewSubmissions;
