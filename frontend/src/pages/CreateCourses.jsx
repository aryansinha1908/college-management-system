import { useState } from "react";
import { Box, Input, Button, VStack, Heading, FormControl, FormLabel, Textarea, Flex, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import api from '../api/axios';
import { useAuth } from "../context/AuthContext";

function CreateCourse() {
    const { user } = useAuth();
    const [title, setTitle] = useState("");
    const [code, setCode] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const toast = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await api.post("/courses", {
                title: title,
                code: code,
                description: description,
                professorId: user._id
            });
            
            toast({
                title: "Course Created",
                description: "The new course has been successfully published.",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            });
            
            navigate("/courses"); 
        } catch (error) {
            toast({
                title: "Creation Failed",
                description: error.response?.data?.message || "Could not create course. Check if code is exactly 6 characters.",
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
                    Create New Course
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
                                maxLength={6}
                                textTransform="uppercase"
                                onChange={(e) => setCode(e.target.value.toUpperCase())} 
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel color="gray.300">Course Title</FormLabel>
                            <Input 
                                placeholder="e.g. Intro to Data Structures" 
                                bg="gray.900" 
                                color="white" 
                                border="none"
                                minLength={3}
                                onChange={(e) => setTitle(e.target.value)} 
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel color="gray.300">Description</FormLabel>
                            <Textarea 
                                placeholder="Provide a brief overview of the course..." 
                                bg="gray.900" 
                                color="white" 
                                border="none"
                                rows={4}
                                onChange={(e) => setDescription(e.target.value)} 
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
                            Create Course
                        </Button>
                    </VStack>
                </form>
            </Box>
        </Flex>
    );
}

export default CreateCourse;
