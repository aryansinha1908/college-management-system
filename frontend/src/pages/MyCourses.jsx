import api from "../api/axios";
import { useEffect, useState } from "react";
import { Box, Button, Flex, Heading, Text, Spinner, Alert, AlertIcon, SimpleGrid, Badge, VStack, HStack, Icon, Menu, MenuButton, MenuList, MenuItem, IconButton, Portal } from "@chakra-ui/react";
import { FiBook, FiMoreVertical, FiEye, FiSettings, FiEdit, FiTrash } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

function MyCourses() {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect( () => {
        const fetchData = async () => {
            try {
                if (user.role === 'student'){
                    const coursesResponse = await api.get("/courses")
                    const enrollmentsResponse = await api.get("enrollments");

                    const enrolledCodes = enrollmentsResponse.data.enrollments;
                    const myFilteredCourses = coursesResponse.data.courses.filter(course => enrolledCodes.includes(course.code));

                    setCourses(myFilteredCourses);
                } else {
                    const coursesResponse = await api.get(`/courses/${user._id}/professors`);
                    const myFilteredCourses = coursesResponse.data.courses;

                    setCourses(myFilteredCourses);
                }
            } catch (e) {
                setErrorMessage(e.response?.data?.message || "Failed to load Courses. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [])

    const handleUnenroll = async (courseCode) => {
        console.log(`Unenrolling from ${courseCode}`);
        setIsLoading(true);
        try {
            const response = await api.delete("enrollments", {
                data: { code: courseCode }
            })

            setCourses((prev) => prev.filter((course) => course.code !== courseCode));
        } catch (error) {
            console.error(error.response?.data?.message || "Failed to enroll");
        } finally {
            setIsLoading(false);
        }
    }

    const handleDelete = async (courseCode) => {
        console.log(`Deleting ${courseCode}`);
        setIsLoading(true);
        try {
            const response = await api.delete(`/courses/${courseCode}`, {
                data: { code: courseCode }
            })

            setCourses((prev) => prev.filter((course) => course.code !== courseCode));
        } catch (error) {
            console.error(error.response?.data?.message || "Failed to Delete");
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return (
            <Flex minH="100vh" bg="gray.900" align="center" justify="center">
                <Spinner size="xl" color="blue.500" thickness="4px" />
            </Flex>
        );
    }

    if (errorMessage) {
        return (
            <Box minH="100vh" bg="gray.900" p={8} pt="15vh">
                <Alert status="error" bg="red.900" color="red.100" borderRadius="md" border="1px solid" borderColor="red.800">
                    <AlertIcon color="red.400" />
                    <Text>{errorMessage}</Text>
                </Alert>
            </Box>
        );
    }

        return (
        <Box minH="100vh" bg="gray.900" p={8}>
            <Heading color="white" mb={2}>All Your Courses</Heading>
            { (user.role === "student") ?
                (
                <Text color="gray.400" mb={8}>View and enroll in Courses.</Text>
                ) : (
                <Text color="gray.400" mb={8}>View and Manage Your Courses.</Text>
                )
            }

            {courses.length === 0 ? (
                <Flex bg="gray.800" p={10} rounded="xl" justify="center" border="1px dashed" borderColor="gray.600">
                    { (user.role === "student") ? (
                            <Text color="gray.500" fontSize="lg">You have not Enrolled in Any Course</Text>
                        ): (
                            <Text color="gray.500" fontSize="lg">You are not Instructor of Any Course</Text>
                        )
                    }
                </Flex>
            ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    
                    {courses.map((course) => (
                        <Box
                            key={course._id}
                            bg="gray.800"
                            p={6}
                            rounded="xl"
                            shadow="lg"
                            border="1px solid"
                            borderColor="gray.700"
                            transition="all 0.2s"
                            _hover={{
                                transform: "translateY(-4px)",  
                                shadow: "2xl",
                                borderColor: "blue.500",
                                cursor: "pointer"
                            }}
                        >
                            <VStack align="start" spacing={4}>
                                <HStack w="full" justify="space-between" align="start">
                                    <Badge colorScheme="blue" px={2} py={1} rounded="md">
                                        {course.code || "CODE"}
                                    </Badge>

                                    <Menu placement="bottom-end">
                                        <MenuButton
                                            as={IconButton}
                                            icon={<FiMoreVertical />}
                                            variant="ghost"
                                            size="sm"
                                            color="gray.400"
                                            aria-label="Options"
                                            onClick={(e) => e.stopPropagation()} 
                                            _hover={{ 
                                                bg: "whiteAlpha.200", 
                                                color: "white" 
                                            }}
                                        />
                                        <Portal>
                                            <MenuList 
                                                bg="gray.800" 
                                                borderColor="gray.700" 
                                                shadow="xl"
                                                p={1} 
                                                color="gray.100"
                                                zIndex={10}
                                            >
                                                <MenuItem 
                                                    icon={<FiEye />} 
                                                    bg="transparent" 
                                                    _hover={{ bg: "gray.700", rounded: "md" }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        console.log(`Viewing ${course._id}`);
                                                    }}
                                                >
                                                    View Course
                                                </MenuItem>
                                                <MenuItem 
                                                    icon={<FiSettings />} 
                                                    bg="transparent" 
                                                    _hover={{ bg: "gray.700", rounded: "md" }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        console.log(`Managing ${course._id}`);
                                                    }}
                                                >
                                                    Manage
                                                </MenuItem>
                                                { (user.role === "student") ? (
                                                        <MenuItem 
                                                            icon={<FiTrash />} 
                                                            bg="transparent" 
                                                            _hover={{ bg: "red.700", rounded: "md" }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleUnenroll(course.code);
                                                            }}
                                                        >
                                                                Unenroll
                                                        </MenuItem>
                                                    ) : (
                                                        <MenuItem 
                                                            icon={<FiTrash />} 
                                                            bg="transparent" 
                                                            _hover={{ bg: "red.700", rounded: "md" }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(course.code);
                                                            }}
                                                        >
                                                                Delete
                                                        </MenuItem>
                                                    )
                                                }
                                            </MenuList>
                                        </Portal>
                                    </Menu>
                                </HStack>
                                <Box>
                                    <Heading size="md" color="white" mb={1}>
                                        {course.name || course.title || "Course Title"}
                                    </Heading>
                                    <Text color="gray.400" fontSize="sm" noOfLines={2}>
                                        {course.description || "No description provided for this course."}
                                    </Text>
                                </Box>

                                <HStack
                                    pt={4}
                                    mt="auto"
                                    w="full"
                                    justify="space-between"
                                    borderTop="1px solid"
                                    borderColor="gray.700"
                                >
                                    <Text color="gray.500" fontSize="xs" fontWeight="bold">
                                        CREDITS: {course.credits || 3}
                                    </Text>
                                </HStack>
                            </VStack>
                        </Box>
                    ))}
                    
                </SimpleGrid>
            )}
        </Box>
    );
}

export default MyCourses;
