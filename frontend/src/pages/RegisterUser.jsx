import { useState } from "react";
import { Box, Input, Button, VStack, Heading, FormControl, FormLabel, Flex, useToast, Select, FormHelperText } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import api from '../api/axios';

function RegisterUser() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [rollno, setRollno] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const toast = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = {
            name,
            email,
            password,
            role,
            ...(role === 'student' && rollno && { rollno })
        };

        try {
            await api.post("/auth/register", payload);
            
            toast({
                title: "User Registered",
                description: "The new account has been successfully created.",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            });
            
            navigate("/users"); 
        } catch (error) {
            toast({
                title: "Registration Failed",
                description: error.response?.data?.error || error.response?.data?.message || "Could not create user. Check the input requirements.",
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
                    Register New User
                </Heading>

                <form onSubmit={handleSubmit}>
                    <VStack spacing={5}>
                        <FormControl isRequired>
                            <FormLabel color="gray.300">Full Name</FormLabel>
                            <Input 
                                placeholder="e.g. xyz" 
                                bg="gray.900" 
                                color="white" 
                                border="none"
                                minLength={2}
                                onChange={(e) => setName(e.target.value)} 
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel color="gray.300">Email Address</FormLabel>
                            <Input 
                                type="email"
                                placeholder="xyz@abc.com" 
                                bg="gray.900" 
                                color="white" 
                                border="none"
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel color="gray.300">Password</FormLabel>
                            <Input 
                                type="password"
                                placeholder="Assign a temporary password" 
                                bg="gray.900" 
                                color="white" 
                                border="none"
                                minLength={6}
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel color="gray.300">System Role</FormLabel>
                            <Select 
                                bg="gray.900" 
                                color="white" 
                                border="none"
                                value={role}
                                onChange={(e) => {
                                    setRole(e.target.value);
                                    if (e.target.value !== 'student') setRollno(""); 
                                }}
                            >
                                <option value="student" style={{ background: "#1A202C" }}>Student</option>
                                <option value="professor" style={{ background: "#1A202C" }}>Professor</option>
                                <option value="admin" style={{ background: "#1A202C" }}>Admin</option>
                            </Select>
                        </FormControl>

                        {role === "student" && (
                            <FormControl isRequired>
                                <FormLabel color="gray.300">Roll Number</FormLabel>
                                <Input 
                                    placeholder="e.g. 2025UGCS000" 
                                    bg="gray.900" 
                                    color="white" 
                                    border="none"
                                    maxLength={11}
                                    minLength={11}
                                    value={rollno}
                                    onChange={(e) => setRollno(e.target.value)} 
                                />
                                <FormHelperText color="gray.500">
                                    Must be exactly 11 characters long.
                                </FormHelperText>
                            </FormControl>
                        )}

                        <Flex w="full" gap={4} mt={4}>
                            <Button 
                                variant="outline" 
                                type="button"
                                colorScheme="gray" 
                                color="white"
                                flex="1"
                                onClick={() => navigate("/users")}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                colorScheme="blue" 
                                flex="1"
                                isLoading={isLoading}
                                loadingText="Creating..."
                            >
                                Register User
                            </Button>
                        </Flex>
                    </VStack>
                </form>
            </Box>
        </Flex>
    );
}

export default RegisterUser;
