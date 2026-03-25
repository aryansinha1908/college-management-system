import axios from "axios";
import { useEffect, useState } from "react";
import { Box, Flex, Heading, Text, VStack, Spinner, Avatar, Badge, Alert, AlertIcon, Button } from "@chakra-ui/react";

function Dashboard() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3000/api/v1/users/profile",
                    { withCredentials: true }
                );
                
                setUser(response.data.user); 
                console.log(response.data);
                setIsLoading(false); 
            } catch (e) {
                // console.log(e.response?.data?.message);
                setErrorMessage(e.response?.data?.message || "Failed to load profile. Please try again later.");
                setIsLoading(false); 
            }
        };
        fetchProfile();
    }, []);

    if (isLoading) {
        return (
            <Flex minH="100vh" bg="gray.900" align="center" justify="center">
                <Spinner size="xl" color="blue.500" thickness="4px" />
            </Flex>
        );
    }

    if (errorMessage) {
        return (
            <Flex 
                minH="100vh" 
                bg="gray.900" 
                align="flex-start" 
                justify="center" 
                px={4} 
                pt="20vh"
            >
                {/* A dark-themed error alert */}
                <Alert 
                    status="error" 
                    bg="red.900" 
                    color="red.100" 
                    borderRadius="md" 
                    maxW="md"
                    border="1px solid"
                    borderColor="red.800"
                >
                    <AlertIcon color="red.400" />
                    <Flex direction="column">
                        <Text fontWeight="bold">Error Loading Dashboard</Text>
                        <Text fontSize="sm">{errorMessage}</Text>
                    </Flex>
                </Alert>
            </Flex>
        );
    }

    return (
        <Flex 
            minH="100vh"
            bg="gray.900"
            align="flex-start"
            justify="center"
            px={4}
            pt="20vh"    
        >
            <Box 
                bg="gray.800" 
                p={10} 
                rounded="2xl" 
                shadow="2xl" 
                border="1px solid" 
                borderColor="gray.700"
                maxW="xl" 
                maxH="xl"
                w="full"
                textAlign="center"
            >
                <VStack spacing={5}>
                    <Avatar 
                        size="2xl" 
                        name={user.name} 
                        bg="blue.500" 
                        color="white" 
                        showBorder 
                        borderColor="gray.800" 
                    />
                    
                    <VStack spacing={1}>
                        <Heading size="lg" color="white" fontWeight="bold">
                            {user.name || "Unknown User"}
                        </Heading>
                        <Text color="gray.400" fontSize="md">
                            {user.email || "No email available"}
                        </Text>
                    </VStack>
                    
                    <Badge 
                        colorScheme={user.role === 'professor' ? 'purple' : 'blue'} 
                        fontSize="sm" 
                        px={4} 
                        py={1} 
                        rounded="full"
                    >
                        {user.role ? user.role.toUpperCase() : "STUDENT"}
                    </Badge>
                    
                </VStack>
            </Box>
        </Flex>
    );
}

export default Dashboard;
