import { useState, useEffect } from "react";
import { Box, Button, VStack, Heading, FormControl, FormLabel, Textarea, Flex, useToast, Spinner, Text, Badge, HStack, Link, Divider } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

function ViewSubmission() {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const { user } = useAuth();

    const [submission, setSubmission] = useState(null);
    const [feedback, setFeedback] = useState("");
    
    const [isFetching, setIsFetching] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const fetchSubmission = async () => {
            try {
                const response = await api.get(`/submissions/${id}`);
                const data = response.data.submission || response.data;
                
                setSubmission(data);
                if (data.feedback) setFeedback(data.feedback);
            } catch (error) {
                toast({
                    title: "Error Loading Submission",
                    description: "Could not fetch details.",
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

        fetchSubmission();
    }, [id, navigate, toast]);

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);

        try {
            await api.patch(`/submissions/${id}`, {
                feedback: feedback
            });
            
            toast({
                title: "Feedback Saved",
                description: "The student's feedback has been updated.",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            });
        } catch (error) {
            toast({
                title: "Failed to update",
                description: error.response?.data?.message || "Could not save feedback.",
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "top-right"
            });
        } finally {
            setIsUpdating(false);
        }
    };

    if (isFetching) {
        return (
            <Flex bg="gray.900" minH="100vh" align="center" justify="center">
                <Spinner size="xl" color="blue.500" thickness="4px" />
            </Flex>
        );
    }

    const isProfessor = user?.role === "professor" || user?.role === "admin";

    return (
        <Flex bg="gray.900" minH="100vh" align="center" justify="center" p={4}>
            <Box bg="gray.800" p={8} rounded="xl" shadow="2xl" maxW="lg" w="full" border="1px solid" borderColor="gray.700">
                <VStack spacing={6} align="stretch">
                    
                    <Flex justify="space-between" align="center">
                        <Heading color="white" size="lg">Submission Details</Heading>
                        <Badge colorScheme={submission?.feedback ? "green" : "yellow"} p={2} rounded="md">
                            {submission?.feedback ? "Reviewed" : "Pending Review"}
                        </Badge>
                    </Flex>

                    <Box bg="gray.900" p={4} rounded="md" border="1px solid" borderColor="gray.700">
                        <Text color="gray.400" fontSize="sm" mb={1}>Student ID</Text>
                        <Text color="white" fontWeight="bold" mb={4}>{submission?.studentId}</Text>

                        <Text color="gray.400" fontSize="sm" mb={1}>Submitted Link</Text>
                        <Link href={submission?.fileUrl} isExternal color="blue.400" fontWeight="bold">
                            {submission?.fileUrl} ↗
                        </Link>
                    </Box>

                    <Divider borderColor="gray.600" />

                    {isProfessor ? (
                        <form onSubmit={handleFeedbackSubmit} noValidate>
                            <VStack spacing={4}>
                                <FormControl>
                                    <FormLabel color="gray.300">Feedback</FormLabel>
                                    <Textarea 
                                        value={feedback}
                                        bg="gray.900" 
                                        color="white" 
                                        border="none"
                                        rows={5}
                                        placeholder="Leave feedback for the student here..."
                                        onChange={(e) => setFeedback(e.target.value)} 
                                    />
                                </FormControl>

                                <HStack w="full" pt={2} gap={4}>
                                    <Button type="button" variant="outline" colorScheme="gray" color="white" flex="1" onClick={() => navigate(-1)}>
                                        Back
                                    </Button>
                                    <Button type="submit" colorScheme="blue" flex="1" isLoading={isUpdating}>
                                        Save Feedback
                                    </Button>
                                </HStack>
                            </VStack>
                        </form>
                    ) : (
                        <VStack spacing={4} align="stretch">
                            <Box>
                                <Text color="gray.400" fontSize="sm" mb={1}>Professor's Feedback</Text>
                                <Box bg="gray.900" p={4} rounded="md" minH="100px" border="1px solid" borderColor="gray.700">
                                    {submission?.feedback ? (
                                        <Text color="white" whiteSpace="pre-wrap">{submission.feedback}</Text>
                                    ) : (
                                        <Text color="gray.500" fontStyle="italic">No feedback provided yet.</Text>
                                    )}
                                </Box>
                            </Box>
                            
                            <Button variant="outline" colorScheme="gray" color="white" w="full" onClick={() => navigate("/assignments")}>
                                Back to Assignments
                            </Button>
                        </VStack>
                    )}
                </VStack>
            </Box>
        </Flex>
    );
}

export default ViewSubmission;
