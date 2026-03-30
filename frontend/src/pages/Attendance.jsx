import { Grid, GridItem, VStack, Text, useToast, Flex, Spinner, TableContainer, Table, Thead, Tr, Th, Td, Tbody, Box, Heading, CircularProgress, CircularProgressLabel } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Attendance() {
    const [attendanceData, setAttendanceData] = useState([]);
    const [isFetching, setIsFetching] = useState(true); 
    
    const { isLoading } = useAuth();
    const toast = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const enrollementsResponse = await api.get(`/enrollments`);
                const courses = enrollementsResponse.data?.enrollments || [];

                if (courses.length === 0) {
                    setIsFetching(false);
                    return; 
                }

                const attendancePromises = courses.map(async (course) => {
                    const response = await api.get(`/attendance/${course}/student`);
                    return [course, response.data.attendance]; 
                });

                const attendanceArray = await Promise.all(attendancePromises);
                
                setAttendanceData(attendanceArray);

            } catch (error) {
                toast({
                    title: "Error Fetching Data",
                    description: error.response?.data?.message || "Attendance Could Not be Fetched",
                    status: "error",
                    duration: 4000,
                    isClosable: true,
                    position: "top-right"
                });
            } finally {
                setIsFetching(false);
            }
        };
        fetchData();
    }, [toast]);

    const AttendancePieChart = () => {
        let totalClasses = 0;
        let attendedClasses = 0;

        for (let i = 0; i < attendanceData.length; i++) {
            totalClasses += attendanceData[i][1].totalClasses;
            attendedClasses += attendanceData[i][1].attendedClasses;
        }

        return (
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
        );
    }

    if (isLoading || isFetching) {
        return (
            <Flex minH="100vh" bg="gray.900" align="center" justify="center">
                <Spinner size="xl" color="blue.500" thickness="4px"/>
            </Flex>
        )
    }

return (
        <Flex minH="100vh" bg="gray.900" color="white" align="flex-start" justify="center" px={4} pb={6} pt="12vh"> 
            <Grid templateColumns={{ base: "1fr", lg: "1.5fr 1fr" }} gap={6} maxW="6xl" w="full">
                <GridItem>
                    <TableContainer bg="gray.800" rounded="xl" border="1px solid" borderColor="gray.700" h="full">
                        <Table variant="simple" colorScheme="gray">
                            <Thead bg="gray.900">
                                <Tr>
                                    <Th color="gray.400" borderBottomColor="gray.700">Course</Th>
                                    <Th color="gray.400" borderBottomColor="gray.700">Attended</Th>
                                    <Th color="gray.400" borderBottomColor="gray.700">Total</Th>
                                    <Th color="gray.400" borderBottomColor="gray.700" isNumeric>Percentage</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {attendanceData.length === 0 ? (
                                    <Tr>
                                        <Td colSpan={4} textAlign="center" color="gray.500" py={8}>
                                            No attendance data available.
                                        </Td>
                                    </Tr>
                                ) : (
                                    attendanceData.map((a) => {
                                        const courseName = a[0];
                                        const stats = a[1];
                                        const percentage = stats.totalClasses > 0 
                                            ? Math.round((stats.attendedClasses / stats.totalClasses) * 100) 
                                            : 0;

                                        return (
                                            <Tr key={courseName} _hover={{ bg: "gray.700" }} transition="background 0.2s">
                                                <Td fontWeight="medium" borderBottomColor="gray.700">
                                                    {courseName}
                                                </Td>
                                                <Td color="green.400" fontWeight="bold" borderBottomColor="gray.700">
                                                    {stats.attendedClasses}
                                                </Td>
                                                <Td color="gray.300" borderBottomColor="gray.700">
                                                    {stats.totalClasses}
                                                </Td>
                                                <Td isNumeric borderBottomColor="gray.700" fontWeight="bold" color={percentage >= 75 ? "green.400" : "orange.400"}>
                                                    {percentage}%
                                                </Td>
                                            </Tr>
                                        );
                                    })
                                )}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </GridItem>

                <GridItem>
                    <AttendancePieChart />
                </GridItem>

            </Grid>
        </Flex>
    );
}

export default Attendance;
