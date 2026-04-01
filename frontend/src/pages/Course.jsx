import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useToast, Flex, Spinner, Grid, GridItem, Box, Heading, Text, Button, Badge, VStack, Divider, HStack } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";

function Course() {
    const { user } = useAuth();
    const toast = useToast();
    const { courseCode } = useParams(); 

    const [courseData, setCourseData] = useState({});
    const [enrolled, setEnrolled] = useState(false);
    
    const [assignments, setAssignments] = useState([]);
    const [isFetchingAssignments, setIsFetchingAssignments] = useState(false);
    
    const [isFetching, setIsFetching] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [courseResponse, enrollmentsResponse] = await Promise.all([
                    api.get(`/courses/${courseCode}`),
                    api.get("/enrollments")
                ]);

                const userEnrollments = enrollmentsResponse.data?.enrollments || [];
                setEnrolled(userEnrollments.includes(courseCode));
                
                setCourseData(courseResponse.data?.course || {});
            } catch (error) {
                toast({
                    title: "Error Fetching Data",
                    description: error.response?.data?.message || "Course details could not be fetched.",
                    status: "error",
                    duration: 4000,
                    isClosable: true,
                    position: "top-right"
                });
            } finally {
                setIsFetching(false);
            }
        }
        fetchData();
    }, [courseCode, toast]);

    useEffect(() => {
        if (!enrolled) {
            setAssignments([]); 
            return;
        }

        const fetchAssignments = async () => {
            setIsFetchingAssignments(true);
            try {
                const response = await api.get(`/assignments/${courseCode}/course`);
                setAssignments(response.data?.assignments || response.data || []);
            } catch (error) {
                console.error("Failed to fetch assignments:", error);
                toast({
                    title: "Could not load assignments",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                    position: "top-right"
                });
            } finally {
                setIsFetchingAssignments(false);
            }
        };

        fetchAssignments();
    }, [enrolled, courseCode, toast]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const toggleEnrollment = async () => {
        setIsSubmitting(true);
        try {
            if (enrolled) {
                await api.delete(`/enrollments`, { data: { code: courseCode }}); 
                setEnrolled(false);
                toast({
                    title: "Unenrolled",
                    description: "You have been removed from this course.",
                    status: "info",
                    duration: 3000,
                    isClosable: true,
                    position: "top-right"
                });
            } else {
                await api.post(`/enrollments`, { code: courseCode }); 
                setEnrolled(true);
                toast({
                    title: "Enrolled Successfully!",
                    description: "You now have access to course assignments.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                    position: "top-right"
                });
            }
        } catch (error) {
            toast({
                title: "Action Failed",
                description: error.response?.data?.message || "Could not change enrollment status.",
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "top-right"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isFetching) {
        return (
            <Flex minH="100vh" bg="gray.900" align="center" justify="center">
                <Spinner size="xl" color="blue.500" thickness="4px"/>
            </Flex>
        )
    }

    return (
        <Flex minH="100vh" bg="gray.900" color="white" align="flex-start" justify="center" px={4} pb={6} pt="12vh">
            <Grid 
                templateColumns={enrolled ? { base: "1fr", lg: "1fr 1fr" } : "1fr"} 
                gap={8} 
                maxW={enrolled ? "6xl" : "2xl"} 
                w="full"
            >
                <GridItem>
                    <Box bg="gray.800" p={8} rounded="2xl" shadow="2xl" border="1px solid" borderColor="gray.700" h="full">
                        <Flex direction="column" h="full" justify="space-between">
                            <VStack align="start" spacing={4}>
                                <HStack justify="space-between" w="full">
                                    <Heading size="xl" color="white">
                                        {courseData.title || "Unknown Course"}
                                    </Heading>
                                    <Badge colorScheme="purple" fontSize="md" px={3} py={1} rounded="md">
                                        {courseCode.toUpperCase()}
                                    </Badge>
                                </HStack>

                                <Text color="gray.400" fontSize="lg" pt={2}>
                                    {courseData.description || "No description provided for this course."}
                                </Text>

                            </VStack>

                            { (user.role === 'student')&& (
                            <Box mt="auto" pt={8}>
                                <Divider borderColor="gray.700" mb={6} />
                                <Button 
                                    w="full" 
                                    size="lg" 
                                    colorScheme={enrolled ? "red" : "blue"} 
                                    variant={enrolled ? "outline" : "solid"}
                                    isLoading={isSubmitting}
                                    onClick={toggleEnrollment}
                                >
                                    {enrolled ? "Unenroll from Course" : "Enroll Now"}
                                </Button>
                            </Box>
                            )}
                        </Flex>
                    </Box>
                </GridItem>

                {enrolled && (
                    <GridItem>
                        <Box bg="gray.800" p={8} rounded="2xl" shadow="2xl" border="1px solid" borderColor="gray.700" h="full">
                            <Heading size="lg" color="white" mb={6}>Assignments</Heading>
                            
                            {isFetchingAssignments ? (
                                <Flex justify="center" py={10}>
                                    <Spinner color="blue.400" />
                                </Flex>
                            ) : (
                                <VStack spacing={4} align="stretch">
                                    {assignments.length > 0 ? (
                                        assignments.map((assignment) => {
                                            const isPastDue = new Date(assignment.dueDate) < new Date();
                                            
                                            return (
                                                <Box key={assignment._id} p={5} bg="gray.900" rounded="xl" border="1px solid" borderColor="gray.700" _hover={{ borderColor: "gray.600" }} transition="all 0.2s">
                                                    <HStack justify="space-between" mb={2} align="start">
                                                        <Heading size="sm" color="white" fontWeight="bold">
                                                            {assignment.title}
                                                        </Heading>
                                                        <Badge colorScheme={isPastDue ? "red" : "green"} px={2} py={1} rounded="md">
                                                            Due: {formatDate(assignment.dueDate)}
                                                        </Badge>
                                                    </HStack>
                                                    <Text color="gray.400" fontSize="sm">
                                                        {assignment.description}
                                                    </Text>
                                                </Box>
                                            )
                                        })
                                    ) : (
                                        <Flex direction="column" align="center" justify="center" py={10} bg="gray.900" rounded="lg" border="1px dashed" borderColor="gray.600">
                                            <Text color="gray.400">No assignments posted yet.</Text>
                                        </Flex>
                                    )}
                                </VStack>
                            )}
                        </Box>
                    </GridItem>
                )}

            </Grid>
        </Flex>
    );
}

export default Course;
