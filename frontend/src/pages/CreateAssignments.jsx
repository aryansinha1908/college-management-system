import { useState } from "react";
import { Box, Input, Button, VStack, Heading, FormControl, FormLabel, Textarea, Flex, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import api from '../api/axios';
import { useAuth } from "../context/AuthContext";

function CreateAssignment() {
    const { user } = useAuth();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [courseId, setCourseId] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const toast = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await api.post("/assignments",
                {
                    title: title,
                    description: description,
                    courseId: courseId,
                    dueDate: dueDate,
                    createdBy: user._id
                }
            )
            
            toast({
                title: "Assignment Created",
                description: "The assignment has been successfully published.",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            });
            
            navigate("/assignments");
        } catch (error) {
            toast({
                title: "Creation Failed",
                description: error.response?.data?.message || "Could not create assignment.",
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "top-right"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Flex bg="gray.900" minH="100vh" align="center" justify="center" p={4}>
            <Box bg="gray.800" p={8} rounded="xl" shadow="2xl" maxW="lg" w="full" border="1px solid" borderColor="gray.700">
                <Heading color="white" mb={6} size="lg" textAlign="center">
                    Create Assignment
                </Heading>

                <form onSubmit={handleSubmit}>
                    <VStack spacing={5}>
                        <FormControl isRequired>
                            <FormLabel color="gray.300">Course Code</FormLabel>
                            <Input 
                                placeholder="e.g. CS1201" 
                                bg="gray.900" 
                                color="white" 
                                border="none"
                                onChange={(e) => setCourseId(e.target.value)} 
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel color="gray.300">Title</FormLabel>
                            <Input 
                                placeholder="Assignment Title" 
                                bg="gray.900" 
                                color="white" 
                                border="none"
                                onChange={(e) => setTitle(e.target.value)} 
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel color="gray.300">Description</FormLabel>
                            <Textarea 
                                placeholder="Provide detailed instructions..." 
                                bg="gray.900" 
                                color="white" 
                                border="none"
                                rows={4}
                                onChange={(e) => setDescription(e.target.value)} 
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel color="gray.300">Due Date</FormLabel>
                            <Input 
                                type="date" 
                                bg="gray.900" 
                                color="white" 
                                border="none"
                                css={{
                                    '&::-webkit-calendar-picker-indicator': {
                                        filter: 'invert(1)'
                                    }
                                }}
                                onChange={(e) => setDueDate(e.target.value)} 
                            />
                        </FormControl>

                        <Button 
                            type="submit" 
                            colorScheme="blue" 
                            w="full" 
                            mt={4}
                            isLoading={isLoading}
                            loadingText="Publishing..."
                        >
                            Publish Assignment
                        </Button>
                    </VStack>
                </form>
            </Box>
        </Flex>
    );
}

export default CreateAssignment;
