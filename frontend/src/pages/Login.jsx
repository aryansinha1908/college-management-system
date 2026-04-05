import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Stack, Text, Alert, AlertIcon, useToast, VStack, HStack, PinInput, PinInputField } from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const LoginPage = () => {
    const { setUser, checkAuth } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [failed, setFailed] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showOtpStep, setShowOtpStep] = useState(false);
    const [otp, setOtp] = useState("");
    const [tempUserId, setTempUserId] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        // console.log("Submitting:", { email, password });
        setIsLoading(true);
        try {
            const loginResponse = await api.post("/auth/login", {
                email: email,
                password: password
            });
            // console.log(loginResponse.data.data.twoFactorEnabled);

            if (loginResponse.data?.data?.twoFactorEnabled) {
                console.log(loginResponse.data?.data);

                const userId = loginResponse.data.data.user._id;
                const userEmail = loginResponse.data.data.user.email;

                const sendOtpResponse = await api.post("/auth/send-otp", {
                    userId: userId,
                    email: userEmail
                });

                setTempUserId(userId);
                setShowOtpStep(true);

                toast({
                        title: "2FA Required",
                        description: "Please Check Your Email For the OTP",
                        status: "info",
                        duration: 4000,
                        isClosable: true,
                        position: "top-right"
                });
            } else {
                await checkAuth();
                navigate("/dashboard");
            }
        } catch (e) {
            console.log(e.response?.data?.message || "Login Failed");
            setErrorMessage(e.response?.data?.message);
            setFailed(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = () => {
        console.log("Forgot password clicked!");
        navigate("/forgot-password");
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post("/auth/verify-otp", { 
                userId: tempUserId, 
                otp: otp 
            });

            await checkAuth();
            
            toast({
                title: "Login Successful",
                description: "Welcome back!",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            });
            
            navigate("/dashboard");
        } catch (error) {
            toast({
                title: "Verification Failed",
                description: error.response?.data?.message || "Invalid OTP code.",
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
                <Stack align="center" spacing={2}>
                    <Heading fontSize="3xl" color="white" fontWeight="extrabold">
                        Sign in to your account
                    </Heading>
                    <Text fontSize="lg" color="gray.400">
                        College Management System
                    </Text>
                </Stack>

                { (!showOtpStep) ? ( 
                    <form onSubmit={handleLogin}>
                        <Stack spacing={4}>
                          
                            <FormControl id="email" isRequired>
                            <FormLabel color="gray.300" fontWeight="medium">
                              Email
                            </FormLabel>
                                <Input
                                    type="text"
                                    placeholder="e.g., abc@xyz.com"
                                    value={email}
                                    onChange={(e) => {
                                      setEmail(e.target.value);
                                      setFailed(false);
                                    }}
                                  
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

                            <FormControl id="password" isRequired>
                                <FormLabel color="gray.300" fontWeight="medium">
                                  Password
                                </FormLabel>
                                <Input
                                    type="password"
                                    placeholder="••••••••••"
                                    value={password}
                                    onChange={(e) => {
                                      setPassword(e.target.value);
                                      setFailed(false);
                                    }}
                                  
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
                                loadingText="Signing in..."
                            >
                                Sign In
                            </Button>
                        </Stack>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp}>
                        <VStack spacing={6}>
                            <Text color="gray.400" textAlign="center" fontSize="sm">
                                We've sent a 6-digit code to <b>{email}</b>. Please enter it below to securely log in.
                            </Text>

                            <FormControl isRequired>
                                <HStack justify="center">
                                    <PinInput 
                                        otp 
                                        value={otp} 
                                        onChange={(val) => setOtp(val)}
                                        colorScheme="blue"
                                    >
                                        <PinInputField bg="gray.900" color="white" borderColor="gray.600" />
                                        <PinInputField bg="gray.900" color="white" borderColor="gray.600" />
                                        <PinInputField bg="gray.900" color="white" borderColor="gray.600" />
                                        <PinInputField bg="gray.900" color="white" borderColor="gray.600" />
                                        <PinInputField bg="gray.900" color="white" borderColor="gray.600" />
                                        <PinInputField bg="gray.900" color="white" borderColor="gray.600" />
                                    </PinInput>
                                </HStack>
                            </FormControl>

                            <VStack w="full" spacing={3}>
                                <Button 
                                    type="submit" 
                                    colorScheme="green" 
                                    w="full" 
                                    isLoading={isLoading}
                                >
                                    Verify & Log In
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    colorScheme="gray" 
                                    color="gray.400" 
                                    size="sm"
                                    onClick={() => {
                                        setShowOtpStep(false);
                                        setOtp("");
                                    }}
                                >
                                    Cancel & go back
                                </Button>
                            </VStack>
                        </VStack>
                    </form>
                )}
                    {failed && (
                        <Alert status="error" borderRadius="md" py={2}>
                            <AlertIcon />
                            {errorMessage}
                        </Alert>
                        )}
                    <Button 
                        variant="link" 
                        colorScheme="blue" 
                        fontSize="sm"
                        onClick={handleForgotPassword}
                    >
                        Forgot your password?{' '}
                    </Button>
                </Stack>
            </Box>
        </Flex>
    );
};

export default LoginPage;
