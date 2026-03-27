import { useState, useEffect } from "react";
import { Box, Input, Button, VStack, Heading, FormControl, FormLabel, Flex, useToast, Spinner, Text, Badge } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

function SubmitAssignment() {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const [assignment, setAssignment] = useState(null);
    const [fileUrl, setFileUrl] = useState("");
    
    const [isFetching, setIsFetching] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchAssignmentDetails = async () => {
            try {
                const response = await api.get(`/assignments/${assignmentId}`);
                setAssignment(response.data.assignment || response.data);
            } catch (error) {
                toast({
                    title: "Error Loading Assignment",
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

        fetchAssignmentDetails();
    }, [assignmentId, navigate, toast]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await api.post("/submissions",
                {
                    assignmentId: assignmentId,
                    fileUrl: fileUrl
                }
            );
            
            toast({
                title: "Assignment Submitted!",
                description: "Your work has been successfully turned in.",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            });
            
            navigate("/assignments");
        } catch (error) {
            toast({
                title: "Submission Failed",
                description: error.response?.data?.message || "Could not submit assignment.",
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "top-right"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isFetching) {
        return (
            <Flex bg="gray.900" minH="100vh" align="center" justify="center">
                <Spinner size="xl" color="blue.500" thickness="4px" />
            </Flex>
        );
    }

    return (
        <Flex bg="gray.900" minH="100vh" align="center" justify="center" p={4}>
            <Box bg="gray.800" p={8} rounded="xl" shadow="2xl" maxW="lg" w="full" border="1px solid" borderColor="gray.700">
                <VStack spacing={4} align="start" mb={8} pb={6} borderBottom="1px solid" borderColor="gray.700">
                    <Flex w="full" justify="space-between" align="center">
                        <Badge colorScheme="purple">{assignment?.courseId}</Badge>
                        <Text color="gray.400" fontSize="sm">
                            Due: {assignment?.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : "No Date"}
                        </Text>
                    </Flex>
                    <Heading color="white" size="lg">
                        {assignment?.title}
                    </Heading>
                    <Text color="gray.300">
                        {assignment?.description}
                    </Text>
                </VStack>

                <form onSubmit={handleSubmit} noValidate>
                    <VStack spacing={5}>
                        <FormControl isRequired>
                            <FormLabel color="gray.300">Submission Link (URL)</FormLabel>
                            <Input 
                                type="url"
                                placeholder="https://github.com/..."
                                value={fileUrl}
                                bg="gray.900" 
                                color="white" 
                                border="none"
                                onChange={(e) => setFileUrl(e.target.value)} 
                            />
                        </FormControl>

                        <Flex w="full" gap={4} mt={4}>
                            <Button 
                                variant="outline" 
                                type="button"
                                colorScheme="gray" 
                                color="white"
                                flex="1"
                                onClick={() => navigate("/assignments")}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                colorScheme="green" 
                                flex="1"
                                isLoading={isSubmitting}
                                loadingText="Submitting..."
                            >
                                Submit
                            </Button>
                        </Flex>
                    </VStack>
                </form>
            </Box>
        </Flex>
    );
}

export default SubmitAssignment;
