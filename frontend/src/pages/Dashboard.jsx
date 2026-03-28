import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Box, Flex, Heading, Text, VStack, Spinner, Avatar, Badge, Alert, AlertIcon, CloseButton } from "@chakra-ui/react";

function Dashboard() {
    const { user, isLoading } = useAuth();
    // Local state to handle dismissing the notification
    const [hide2FAAlert, setHide2FAAlert] = useState(false);

    if (isLoading) {
        return (
            <Flex minH="100vh" bg="gray.900" align="center" justify="center">
                <Spinner size="xl" color="blue.500" thickness="4px" />
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
                w="full"
                textAlign="center"
            >
                <VStack spacing={5}>
                    <Avatar 
                        size="2xl" 
                        name={user?.name} 
                        bg="blue.500" 
                        color="white" 
                        showBorder 
                        borderColor="gray.800" 
                    />
                    
                    <VStack spacing={1}>
                        <Heading size="lg" color="white" fontWeight="bold">
                            {user?.name || "Unknown User"}
                        </Heading>
                        <Text color="gray.400" fontSize="md">
                            {user?.email || "No email available"}
                        </Text>
                    </VStack>
                    
                    <Badge 
                        colorScheme={user?.role === 'professor' ? 'purple' : 'blue'} 
                        fontSize="sm" 
                        px={4} 
                        py={1} 
                        rounded="full"
                    >
                        {user?.role ? user?.role.toUpperCase() : "STUDENT"}
                    </Badge>

                    {!user?.twoFactorEnabled && !hide2FAAlert && (
                        <Alert 
                            status="warning" 
                            variant="subtle" 
                            colorScheme="orange" 
                            rounded="md" 
                            mt={4} 
                            textAlign="left"
                            bg="orange.900"
                            color="orange.100"
                        >
                            <AlertIcon color="orange.300" />
                            <Box flex="1">
                                <Text fontSize="sm" fontWeight="medium">
                                    Enhance your account security! Please enable Two-Factor Authentication (2FA) in your settings.
                                </Text>
                            </Box>
                            <CloseButton 
                                alignSelf="flex-start" 
                                position="relative" 
                                right={-1} 
                                top={-1} 
                                onClick={() => setHide2FAAlert(true)} 
                            />
                        </Alert>
                    )}
                    
                </VStack>
            </Box>
        </Flex>
    );
}

export default Dashboard;
