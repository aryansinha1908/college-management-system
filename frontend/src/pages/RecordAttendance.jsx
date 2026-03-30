import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Flex, Heading, VStack, HStack, Text, Button, Checkbox, useToast, Spinner, Input, Divider, Badge } from "@chakra-ui/react";
import api from "../api/axios";

function RecordAttendance() {
    const { courseCode } = useParams(); 
    const navigate = useNavigate();
    const toast = useToast();

    const [students, setStudents] = useState([]);
    const [presentees, setPresentees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [date, setDate] = useState(new Date().toLocaleDateString('en-CA'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const enrollmentsResponse = await api.get(`/enrollments/${courseCode}/students`);
                const enrolledIds = enrollmentsResponse.data?.students || [];

                const allStudentsResponse = await api.get("/users/students");
                const allStudentsList = allStudentsResponse.data?.students || [];

                const courseStudentsData = allStudentsList.filter(student => 
                    enrolledIds.includes(student._id)
                );
                console.log(courseStudentsData);

                setStudents(courseStudentsData);
                
                setPresentees(courseStudentsData.map(student => student._id));

            } catch (error) {
                toast({
                    title: "Error fetching students",
                    description: error.response?.data?.message || "Could not load the class list.",
                    status: "error",
                    duration: 4000,
                    isClosable: true,
                    position: "top-right"
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [courseCode, toast]);

    const handleToggleStudent = (studentId) => {
        setPresentees((prev) => {
            if (prev.includes(studentId)) {
                return prev.filter(id => id !== studentId); 
            } else {
                return [...prev, studentId]; 
            }
        });
    };

    const handleSelectAll = () => setPresentees(students.map(s => s._id || s));
    const handleDeselectAll = () => setPresentees([]);

    const recordAttendance = async () => {
        if (!date) {
            return toast({
                title: "Date Required",
                description: "Please select a date for this attendance record.",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            });
        }

        setIsSubmitting(true);
        try {
            await api.post(`/attendance`, {
                courseCode: courseCode,
                date: new Date(`${date}T00:00:00`), 
                presentees: presentees
            });

            toast({
                title: "Attendance Saved!",
                description: `Successfully recorded attendance for ${presentees.length} students.`,
                status: "success",
                duration: 4000,
                isClosable: true,
                position: "top-right"
            });

            navigate("/dashboard");
        } catch (error) {
            toast({
                title: "Submission Failed",
                description: error.response?.data?.message || "Could not save attendance. Did you already take attendance for this date?",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-right"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <Flex minH="100vh" bg="gray.900" align="center" justify="center">
                <Spinner size="xl" color="purple.500" thickness="4px" />
            </Flex>
        );
    }

    return (
        <Flex minH="100vh" bg="gray.900" align="flex-start" justify="center" p={6} pt="12vh">
            <Box bg="gray.800" p={8} rounded="2xl" shadow="2xl" border="1px solid" borderColor="gray.700" w="full" maxW="3xl">
                
                <Flex justify="space-between" align="center" mb={6}>
                    <VStack align="start" spacing={1}>
                        <Heading color="white" size="lg">Record Attendance</Heading>
                        <Badge colorScheme="purple" fontSize="sm" px={3} py={1} rounded="md">
                            {courseCode.toUpperCase()}
                        </Badge>
                    </VStack>

                    <Input 
                        type="date" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                        bg="gray.900" 
                        color="white" 
                        border="1px solid" 
                        borderColor="gray.600"
                        w="auto"
                    />
                </Flex>

                <Divider borderColor="gray.700" mb={6} />

                <HStack justify="space-between" mb={4}>
                    <Text color="gray.400" fontWeight="medium">
                        {presentees.length} / {students.length} Present
                    </Text>
                    <HStack>
                        <Button size="sm" colorScheme="purple" variant="ghost" onClick={handleSelectAll}>
                            Select All
                        </Button>
                        <Button size="sm" colorScheme="red" variant="ghost" onClick={handleDeselectAll}>
                            Deselect All
                        </Button>
                    </HStack>
                </HStack>

                <VStack align="stretch" spacing={3} maxH="50vh" overflowY="auto" pr={2}>
                    {students.length === 0 ? (
                        <Text color="gray.500" textAlign="center" py={10}>No students enrolled in this course yet.</Text>
                    ) : (
                        students.map((student) => {
                            const studentId = student._id || student; 
                            const displayName = student.name || "Unknown Student";
                            const displayRoll = student.rollno || studentId;

                            return (
                                <HStack key={studentId} p={4} bg="gray.900" rounded="lg" border="1px solid" borderColor="gray.700" justify="space-between" _hover={{ bg: "gray.700" }} transition="all 0.2s">
                                    <VStack align="start" spacing={0}>
                                        <Text color="white" fontWeight="bold">{displayName}</Text>
                                        <Text color="gray.400" fontSize="sm" fontFamily="monospace">{displayRoll}</Text>
                                    </VStack>
                                    
                                    <Checkbox 
                                        size="lg" 
                                        colorScheme="green" 
                                        isChecked={presentees.includes(studentId)}
                                        onChange={() => handleToggleStudent(studentId)}
                                    />
                                </HStack>
                            );
                        })
                    )}
                </VStack>

                <Button 
                    mt={8} 
                    w="full" 
                    colorScheme="purple" 
                    size="lg" 
                    onClick={recordAttendance}
                    isLoading={isSubmitting}
                    loadingText="Saving..."
                    isDisabled={students.length === 0}
                >
                    Save Attendance Record
                </Button>

            </Box>
        </Flex>
    );
}

export default RecordAttendance;
