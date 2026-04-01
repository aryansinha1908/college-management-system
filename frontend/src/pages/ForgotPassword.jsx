import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Stack, Text, Alert, AlertIcon, useToast } from "@chakra-ui/react";
import api from "../api/axios";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const toast = useToast();
    
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post("/auth/forgot-password", {
                email: email
            });
            toast({
                title: "Reset Password",
                description: "Please Check Your Email For the Reset Password Link",
                status: "info",
                duration: 10000,
                isClosable: true,
                position: "top-right"
            });
        } catch (error) {
            console.error(error.response?.data?.message || "Reset Password Link Could Not be Sent");
        } finally {
            setIsLoading(false);
        }
   };

    return (
        <Flex
            minH="100vh"
            align="center"
            justify="center"
            bg="gray.900" 
            p={4}
        >
            <Box
                bg="gray.800" 
                p={8}
                rounded="xl"
                shadow="2xl"
                width="100%"
                maxW="md" 
                border="1px solid"
                borderColor="gray.700" 
            >
                <Stack spacing={6}>
                    <Stack align="center" spacing={2} textAlign="center">
                        <Heading fontSize="3xl" color="white" fontWeight="extrabold">
                            Reset Password
                        </Heading>
                    </Stack>

                    {isSubmitted ? (
                        <Alert status="success" borderRadius="md" py={3}>
                            <AlertIcon />
                            <Text fontSize="sm">
                                If an account exists for <b>{email}</b>, we have sent password reset link.
                            </Text>
                        </Alert>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <Stack spacing={4}>
                                <Text color="gray.400" textAlign="center" fontSize="sm" mb={2}>
                                    Enter your email address and we'll send you a link to reset your password.
                                </Text>

                                <FormControl id="email" isRequired>
                                    <FormLabel color="gray.300" fontWeight="medium">
                                        Email Address
                                    </FormLabel>
                                    <Input 
                                        type="email" 
                                        placeholder="e.g., abc@xyz.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        bg="gray.700"
                                        border="1px solid"
                                        borderColor="gray.600"
                                        color="white"
                                        _placeholder={{ color: 'gray.500' }}
                                        _focus={{
                                            borderColor: 'blue.400',
                                            boxShadow: '0 0 0 1px #63b3ed',
                                        }}
                                        _hover={{
                                            borderColor: 'gray.500'
                                        }}
                                    />
                                </FormControl>

                                <Button
                                    type="submit"
                                    colorScheme="blue" 
                                    size="lg"
                                    fontSize="md"
                                    fontWeight="bold"
                                    width="full"
                                    mt={2}
                                    _hover={{
                                        bg: 'blue.500', 
                                    }}
                                    _active={{
                                        bg: 'blue.600', 
                                    }}
                                    isLoading={isLoading}
                                    loadingText="Sending..."
                                >
                                    Send Reset Link
                                </Button>
                            </Stack>
                        </form>
                    )}

                    <Button 
                        variant="link" 
                        colorScheme="blue" 
                        fontSize="sm"
                        onClick={() => navigate('/login')}
                    >
                        Back to Login
                    </Button>
                </Stack>
            </Box>
        </Flex>
    );
};

export default ForgotPassword;
