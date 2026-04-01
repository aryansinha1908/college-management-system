import { useState } from "react";
import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, VStack, Text, useToast } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

function ResetPassword() {
    const { setUser } = useAuth();
    const { token } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        if (password.length < 6) {
            return toast({
                title: "Password too short",
                description: "Your password must be at least 6 characters long.",
                status: "warning",
                duration: 4000,
                isClosable: true,
                position: "top-right"
            });
        }

        if (password !== confirmPassword) {
            return toast({
                title: "Passwords do not match",
                description: "Please ensure both password fields are identical.",
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "top-right"
            });
        }

        setIsLoading(true);

        try {
            const response = await api.post(`/auth/reset-password/${token}`, {
                password: password,
            });

            if (response.data?.user) {
                setUser(response.data.user);
            }

            toast({
                title: "Password Has been Reset",
                description: "Your password has been reset.",
                status: "success",
                duration: 4000,
                isClosable: true,
                position: "top-right"
            });

            navigate("/login");

        } catch (error) {
            toast({
                title: "Verification Failed",
                description: error.response?.data?.message || "Could not reset you Accounts's Password. The link may have expired.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-right"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Flex minH="100vh" align="center" justify="center" bg="gray.900" p={4}>
            <Box w="full" maxW="md" bg="gray.800" p={8} rounded="xl" shadow="2xl" border="1px solid" borderColor="gray.700">
                <VStack spacing={2} mb={8} textAlign="center">
                    <Heading color="white" size="lg">
                        Reset Your Password
                    </Heading>
                    <Text color="gray.400" fontSize="sm">
                        Welcome! Please reset your password.
                    </Text>
                </VStack>

                <form onSubmit={handleSubmit}>
                    <VStack spacing={5}>
                        <FormControl isRequired>
                            <FormLabel color="gray.300">New Password</FormLabel>
                            <Input 
                                type="password" 
                                placeholder="Minimum 6 characters"
                                bg="gray.900" 
                                color="white" 
                                border="none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel color="gray.300">Confirm Password</FormLabel>
                            <Input 
                                type="password" 
                                placeholder="Re-type your password"
                                bg="gray.900" 
                                color="white" 
                                border="none"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                            />
                        </FormControl>

                        <Button 
                            type="submit" 
                            colorScheme="blue" 
                            w="full" 
                            mt={4} 
                            size="lg"
                            isLoading={isLoading}
                            loadingText="Verifying..."
                        >
                            Reset Password 
                        </Button>
                    </VStack>
                </form>
            </Box>
        </Flex>
    );
}

export default ResetPassword;
