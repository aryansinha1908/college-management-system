import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Stack, Text, Alert, AlertIcon } from '@chakra-ui/react';
import axios from 'axios';

const LoginPage = () => {
    const navigate = useNavigate();
    const [rollNumber, setRollNumber] = useState('');
    const [password, setPassword] = useState('');
    const [failed, setFailed] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("Submitting:", { rollNumber, password });
        setIsLoading(true);
        try {
            const response = await axios.post(
                "http://localhost:3000/api/v1/auth/login",
                { 
                    rollno: rollNumber,
                    password: password 
                },
                { withCredentials: true }
            );

            navigate("/dashboard");
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

          <form onSubmit={handleLogin}>
            <Stack spacing={4}>
              
              <FormControl id="rollNumber" isRequired>
                <FormLabel color="gray.300" fontWeight="medium">
                  Roll Number
                </FormLabel>
                <Input
                  type="text"
                  placeholder="e.g., 2025UGCS000"
                  value={rollNumber}
                  onChange={(e) => {
                      setRollNumber(e.target.value);
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
