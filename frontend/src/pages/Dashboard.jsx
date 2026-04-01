import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Box, Flex, Heading, Text, VStack, Spinner, Avatar, Badge, Alert, AlertIcon, CloseButton, Divider, SimpleGrid, Button, Grid, GridItem, CircularProgress, CircularProgressLabel, HStack } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function Dashboard() {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();

    const [totalClasses, setTotalClasses] = useState(0);
    const [attendedClasses, setAttendedClasses] = useState(0);
    const [hide2FAAlert, setHide2FAAlert] = useState(false);

    useEffect(() => {
        try {
            if (user?.role !== 'student') return;
            
            const fetchData = async () => {
                const enrollmentsResponse = await api.get("/enrollments");
                const courses = enrollmentsResponse.data.enrollments;

                if (!courses || courses.length === 0) return;
                
                const attendancePromises = courses.map(async (course) => {
                    const response = await api.get(`/attendance/${course}/student`);

                    return [course, response.data.attendance];
                });

                const attendanceArray = await Promise.all(attendancePromises);
                const totalAttendanceResponse = Object.fromEntries(attendanceArray);

                const allCoursesAttendance = Object.values(totalAttendanceResponse);

                setTotalClasses(allCoursesAttendance.reduce((sum, course) => sum + course.totalClasses, 0));
                setAttendedClasses(allCoursesAttendance.reduce((sum, course) => sum + course.attendedClasses, 0));
            }
            fetchData();
        } catch (error) {
            console.error(error.response?.data?.message || "Failed to Fetch Data");
        }
    }, []);

    if (isLoading) {
        return (
            <Flex minH="100vh" bg="gray.900" align="center" justify="center">
                <Spinner size="xl" color="blue.500" thickness="4px" />
            </Flex>
        );
    }

    const ProfileTile = () => (
        <Box 
            bg="gray.800" 
            p={10} 
            rounded="2xl" 
            shadow="2xl" 
            border="1px solid" 
            borderColor="gray.700" 
            textAlign="center" 
            w="full" 
            h="full"
        >
            <Flex direction="column" h="full" justify="center" align="center" w="full">
                
                <VStack spacing={5} w="full">
                    <Avatar size="2xl" name={user?.name} bg="blue.500" color="white" showBorder borderColor="gray.800" />
                    
                    <VStack spacing={1} w="full">
                        <Heading size="lg" color="white" fontWeight="bold">
                            {user?.name || "Unknown User"}
                        </Heading>
                        <Text color="gray.400" fontSize="md">
                            {user?.email || "No email available"}
                        </Text>
                        {user?.role === 'student' && user?.rollno && (
                            <Text color="gray.500" fontSize="sm" fontFamily="monospace">
                                {user.rollno}
                            </Text>
                        )}
                    </VStack>
                    
                    <Badge colorScheme={user?.role === 'admin' ? 'red' : user?.role === 'professor' ? 'purple' : 'blue'} fontSize="sm" px={4} py={1} rounded="full">
                        {user?.role ? user?.role.toUpperCase() : "STUDENT"}
                    </Badge>

                    {!user?.isVerified && !hide2FAAlert && (
                        <Alert status="warning" variant="subtle" colorScheme="orange" rounded="md" mt={4} textAlign="left" bg="orange.900" color="orange.100" w="full">
                            <AlertIcon color="orange.300" />
                            <Box flex="1">
                                <Text fontSize="sm" fontWeight="medium">
                                    Enhance your account security! Please verify your account using your email.
                                </Text>
                            </Box>
                            <CloseButton alignSelf="flex-start" position="relative" right={-1} top={-1} onClick={() => setHide2FAAlert(true)} />
                        </Alert>
                    )}
                </VStack>

                {user?.role !== 'student' && (
                    <Box mt="auto" pt={6} w="full">
                        <Divider borderColor="gray.700" w="full" mb={4} />

                        <Box w="full" textAlign="left">
                            <Heading size="sm" color="gray.400" mb={4} textTransform="uppercase" letterSpacing="wide">
                                Quick Actions
                            </Heading>

                            {user?.role === 'admin' && (
                                <SimpleGrid columns={2} spacing={4} w="full">
                                    <Button colorScheme="red" variant="outline" onClick={() => navigate("/register")}>Register User</Button>
                                    <Button colorScheme="red" variant="outline" onClick={() => navigate("/create-course")}>New Course</Button>
                                </SimpleGrid>
                            )}

                            {user?.role === 'professor' && (
                                <SimpleGrid columns={2} spacing={4} w="full">
                                    <Button colorScheme="purple" variant="outline" onClick={() => navigate("/create-course")}>Create Course</Button>
                                    <Button colorScheme="purple" variant="outline" onClick={() => navigate("/create-assignment")}>New Assignment</Button>
                                    <Button colorScheme="purple" variant="outline" onClick={() => navigate("/create-test")}>New Test</Button>
                                    <Button colorScheme="purple" variant="outline" onClick={() => navigate("/grades")}>Grade Tests</Button>
                                </SimpleGrid>
                            )}
                        </Box>
                    </Box>
                )}
            </Flex>
        </Box>
    );

    return (
        <Flex minH="100vh" bg="gray.900" align="flex-start" justify="center" px={4} pt="12vh" pb={10}>
            
            {user?.role === 'student' ? (
                <Grid 
                    templateColumns={{ base: "1fr", lg: "1fr 1fr" }} 
                    gap={6} 
                    maxW="7xl" 
                    w="full"
                >
                    <GridItem>
                        <ProfileTile />
                    </GridItem>

                    <GridItem>
                        <VStack spacing={6} h="full">
                            
                            <Box bg="gray.800" p={8} rounded="2xl" shadow="2xl" border="1px solid" borderColor="gray.700" w="full" flex={1}>
                                <Heading size="md" color="white" mb={6}>Attendance Overview</Heading>
                                <Flex justify="center" align="center" direction="column">
                                    <CircularProgress value={(totalClasses > 0) ? Math.round((attendedClasses / totalClasses) * 100) : 0} color="green.400" size="140px" thickness="12px" trackColor="gray.700">
                                        <CircularProgressLabel color="white" fontWeight="bold" fontSize="2xl">
                                            {totalClasses > 0 ? Math.round((attendedClasses/ totalClasses) * 100) : 0}%
                                        </CircularProgressLabel>
                                    </CircularProgress>
                                    <Text color="gray.400" mt={4} fontSize="sm">You have attended {attendedClasses} out of {totalClasses} classes this semester.</Text>
                                </Flex>
                            </Box>

                            <Box bg="gray.800" p={8} rounded="2xl" shadow="2xl" border="1px solid" borderColor="gray.700" w="full" flex={1}>
                                <Heading size="md" color="white" mb={6}>Recent Grades</Heading>
                                <VStack spacing={4} align="stretch">
                                    <HStack justify="space-between" p={3} bg="gray.900" rounded="md" border="1px solid" borderColor="gray.700">
                                        <Text color="white" fontWeight="medium">Data Structures Midterm</Text>
                                        <Badge colorScheme="green" px={3} py={1} rounded="md">A (92/100)</Badge>
                                    </HStack>
                                    <HStack justify="space-between" p={3} bg="gray.900" rounded="md" border="1px solid" borderColor="gray.700">
                                        <Text color="white" fontWeight="medium">Linear Algebra Quiz 3</Text>
                                        <Badge colorScheme="yellow" px={3} py={1} rounded="md">B (84/100)</Badge>
                                    </HStack>
                                    <HStack justify="space-between" p={3} bg="gray.900" rounded="md" border="1px solid" borderColor="gray.700">
                                        <Text color="white" fontWeight="medium">OS Programming Assignment</Text>
                                        <Badge colorScheme="green" px={3} py={1} rounded="md">A+ (100/100)</Badge>
                                    </HStack>
                                </VStack>
                            </Box>

                        </VStack>
                    </GridItem>
                </Grid>
            ) : (
                <Box maxW="xl" w="full">
                    <ProfileTile />
                </Box>
            )}
        </Flex>
    );
}

export default Dashboard;
