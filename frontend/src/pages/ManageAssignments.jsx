import { useState, useEffect, useRef } from "react";
import { Box, Input, Button, VStack, Heading, FormControl, FormLabel, Textarea, Flex, useToast, Spinner, useDisclosure, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

function ManageAssignment() {
    const { assignmentId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [courseId, setCourseId] = useState("");
    const [dueDate, setDueDate] = useState("");
    
    const [isFetching, setIsFetching] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchAssignmentDetails = async () => {
            try {
                const response = await api.get(`/assignments/${assignmentId}`);
                const assignment = response.data.assignment;
                
                setTitle(assignment.title || "");
                setDescription(assignment.description || "");
                setCourseId(assignment.courseId || "");
                
                if (assignment.dueDate) {
                    const formattedDate = new Date(assignment.dueDate).toISOString().split('T')[0];
                    setDueDate(formattedDate);
                }
            } catch (error) {
                toast({
                    title: "Error Loading Assignment",
                    description: "Could not fetch assignment details.",
                    status: "error",
                    duration: 4000,
                    isClosable: true,
                    position: "top-right"
                });
                navigate("/assignments");
            } finally {
                setIsFetching(false);
            }
        };

        fetchAssignmentDetails();
    }, [assignmentId, navigate, toast]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);

        try {
            await api.patch(`/assignments/${assignmentId}`, 
                {
                    title: title,
                    description: description,
                    courseId: courseId,
                    dueDate: dueDate
                }
            )
            
            toast({
                title: "Assignment Updated",
                description: "Your changes have been saved.",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            });
            
            navigate("/assignments");
        } catch (error) {
            toast({
                title: "Update Failed",
                description: error.response?.data?.message || "Could not update assignment.",
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "top-right"
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await api.delete(`/assignments/${assignmentId}`);

            toast({
                title: "Assignment Deleted",
                description: "The assignment has been permanently removed.",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            });
            
            onClose();
            navigate("/assignments");
        } catch (error) {
            toast({
                title: "Delete Failed",
                description: error.response?.data?.message || "Could not delete assignment.",
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "top-right"
            });
            setIsDeleting(false);
            onClose();
        }
    };

    if (isFetching) {
        return (
            <Flex bg="gray.900" minH="100vh" align="center" justify="center">
                <Spinner size="xl" color="blue.500" thickness="4px" />
            </Flex>
        );
    }

    return (
        <Flex bg="gray.900" minH="100vh" align="center" justify="center" p={4}>
            <Box bg="gray.800" p={8} rounded="xl" shadow="2xl" maxW="lg" w="full" border="1px solid" borderColor="gray.700">
                <Heading color="white" mb={6} size="lg" textAlign="center">
                    Manage Assignment
                </Heading>

                <form onSubmit={handleSubmit} noValidate>
                    <VStack spacing={5}>
                        <FormControl isRequired>
                            <FormLabel color="gray.300">Course Code</FormLabel>
                            <Input 
                                value={courseId}
                                bg="gray.900" 
                                color="white" 
                                border="none"
                                onChange={(e) => setCourseId(e.target.value)} 
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel color="gray.300">Title</FormLabel>
                            <Input 
                                value={title}
                                bg="gray.900" 
                                color="white" 
                                border="none"
                                onChange={(e) => setTitle(e.target.value)} 
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel color="gray.300">Description</FormLabel>
                            <Textarea 
                                value={description}
                                bg="gray.900" 
                                color="white" 
                                border="none"
                                rows={4}
                                onChange={(e) => setDescription(e.target.value)} 
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel color="gray.300">Due Date</FormLabel>
                            <Input 
                                type="date" 
                                value={dueDate}
                                bg="gray.900" 
                                color="white" 
                                border="none"
                                css={{
                                    '&::-webkit-calendar-picker-indicator': {
                                        filter: 'invert(1)'
                                    }
                                }}
                                onChange={(e) => setDueDate(e.target.value)} 
                            />
                        </FormControl>

                        <Flex w="full" gap={4} mt={4}>
                            <Button 
                                variant="outline" 
                                type="button"
                                colorScheme="gray" 
                                color="white"
                                w="full" 
                                flex="1"
                                onClick={() => navigate("/assignments")}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="button" 
                                colorScheme="red" 
                                variant="outline" 
                                flex="1"
                                onClick={onOpen}
                            >
                                Delete
                            </Button>

                            <Button 
                                type="submit" 
                                colorScheme="blue" 
                                w="full" 
                                flex="1"
                                isLoading={isUpdating}
                                loadingText="Saving..."
                            >
                                Save Changes
                            </Button>
                        </Flex>
                    </VStack>
                </form>
            </Box>

            <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
                <AlertDialogOverlay>
                    <AlertDialogContent bg="gray.800" color="white" border="1px solid" borderColor="gray.700">
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Assignment
                        </AlertDialogHeader>

                        <AlertDialogBody color="gray.400">
                            Are you sure? You can't undo this action afterwards.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose} bg="gray.700" color="white" _hover={{ bg: "gray.600" }}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={handleDelete} ml={3} isLoading={isDeleting}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Flex>
    );
}

export default ManageAssignment;
