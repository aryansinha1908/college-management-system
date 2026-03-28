import { useState, useEffect } from "react";
import { Box, Heading, Text, Flex, Spinner, useToast, Button, Table, Thead, Tbody, Tr, Th, Td, Badge, HStack, VStack, TableContainer, Select, Input, Switch } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function ManageUsers() {
    const navigate = useNavigate();
    const toast = useToast();

    const [users, setUsers] = useState([]);
    const [isFetching, setIsFetching] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get("/users");
                setUsers(response.data.users || response.data);
            } catch (error) {
                toast({
                    title: "Access Denied",
                    description: "Could not fetch users. Make sure you have Admin privileges.",
                    status: "error",
                    duration: 4000,
                    isClosable: true,
                    position: "top-right"
                });
                navigate("/");
            } finally {
                setIsFetching(false);
            }
        };

        fetchUsers();
    }, [navigate, toast]);

    const handleUpdateUser = async (userId, updates) => {
        setUpdatingId(userId);
        try {
            await api.patch(`/users/${userId}`, updates);
            
            setUsers(users.map(u => u._id === userId ? { ...u, ...updates } : u));
            
            toast({
                title: "User Updated",
                description: "The account information has been successfully updated.",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            });
        } catch (error) {
            toast({
                title: "Update Failed",
                description: error.response?.data?.message || "Could not update user.",
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "top-right"
            });
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you absolutely sure you want to delete this user? This cannot be undone.")) return;

        setUpdatingId(userId);
        try {
            await api.delete(`/users/${userId}`);
            
            setUsers(users.filter(u => u._id !== userId));
            
            toast({
                title: "User Deleted",
                description: "The account has been removed from the system.",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            });
        } catch (error) {
            toast({
                title: "Delete Failed",
                description: error.response?.data?.message || "Could not delete user.",
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "top-right"
            });
            setUpdatingId(null);
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'red';
            case 'professor': return 'purple';
            default: return 'green';
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
        <Box bg="gray.900" minH="100vh" p={8}>
            <VStack align="stretch" spacing={6} maxW="7xl" mx="auto">
                <HStack justify="space-between" flexWrap="wrap" gap={4}>
                    <Box>
                        <Heading color="white" size="lg" mb={2}>
                            User Management
                        </Heading>
                        <Text color="gray.400">
                            View, update roles, edit details, and manage system access for all accounts.
                        </Text>
                    </Box>
                    <Button colorScheme="blue" fontWeight="bold" onClick={() => navigate("/register")}>
                        + Register New User
                    </Button>
                </HStack>

                <Box bg="gray.800" rounded="xl" shadow="2xl" border="1px solid" borderColor="gray.700" overflow="hidden">
                    {users.length === 0 ? (
                        <Flex p={10} justify="center">
                            <Text color="gray.500" fontSize="lg">No users found in the database.</Text>
                        </Flex>
                    ) : (
                        <TableContainer>
                            <Table variant="simple" colorScheme="gray" size="md">
                                <Thead bg="gray.900">
                                    <Tr>
                                        <Th color="gray.400" borderBottomColor="gray.700">Name</Th>
                                        <Th color="gray.400" borderBottomColor="gray.700">Email</Th>
                                        <Th color="gray.400" borderBottomColor="gray.700">Role</Th>
                                        <Th color="gray.400" borderBottomColor="gray.700">Verified</Th>
                                        <Th color="gray.400" borderBottomColor="gray.700" textAlign="center">2FA</Th>
                                        <Th color="gray.400" borderBottomColor="gray.700" isNumeric>Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {users.map((u) => (
                                        <Tr key={u._id} _hover={{ bg: "gray.750" }} transition="background 0.2s">
                                            <Td borderBottomColor="gray.700">
                                                <Input 
                                                    defaultValue={u.name}
                                                    size="sm"
                                                    bg="gray.900"
                                                    color="white"
                                                    borderColor="gray.600"
                                                    isDisabled={updatingId === u._id}
                                                    onBlur={(e) => {
                                                        if (e.target.value !== u.name && e.target.value.trim() !== "") {
                                                            handleUpdateUser(u._id, { name: e.target.value });
                                                        }
                                                    }}
                                                />
                                            </Td>
                                            <Td color="gray.300" fontSize="sm" borderBottomColor="gray.700">
                                                {u.email}
                                            </Td>
                                            <Td borderBottomColor="gray.700">
                                                <HStack>
                                                    <Select 
                                                        size="sm" 
                                                        bg="gray.900" 
                                                        color="white" 
                                                        borderColor="gray.600"
                                                        value={u.role}
                                                        isDisabled={updatingId === u._id}
                                                        onChange={(e) => handleUpdateUser(u._id, { role: e.target.value })}
                                                        w="auto"
                                                    >
                                                        <option value="student" style={{ background: "#1A202C" }}>Student</option>
                                                        <option value="professor" style={{ background: "#1A202C" }}>Professor</option>
                                                        <option value="admin" style={{ background: "#1A202C" }}>Admin</option>
                                                    </Select>
                                                    <Badge colorScheme={getRoleColor(u.role)} rounded="md" px={2}>
                                                        {u.role.charAt(0).toUpperCase()}
                                                    </Badge>
                                                </HStack>
                                            </Td>
                                            <Td borderBottomColor="gray.700">
                                                {u.isVerified? (
                                                    <Text color="green.400" fontSize="xl" fontWeight="black" title="Verified">
                                                        ✔
                                                    </Text>
                                                ) : (
                                                    <Text color="red.500" fontSize="xl" fontWeight="black" title="Not Verified">
                                                        ✖
                                                    </Text>
                                                )}
                                            </Td>
                                            <Td borderBottomColor="gray.700" textAlign="center">
                                                {u.twoFactorEnabled ? (
                                                    <Text color="green.400" fontSize="xl" fontWeight="black" title="2FA Enabled">
                                                        ✔
                                                    </Text>
                                                ) : (
                                                    <Text color="red.500" fontSize="xl" fontWeight="black" title="2FA Disabled">
                                                        ✖
                                                    </Text>
                                                )}
                                            </Td>
                                            <Td isNumeric borderBottomColor="gray.700">
                                                <Button 
                                                    size="sm" 
                                                    colorScheme="red" 
                                                    variant="outline"
                                                    isLoading={updatingId === u._id}
                                                    onClick={() => handleDeleteUser(u._id)}
                                                >
                                                    Delete
                                                </Button>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            </VStack>
        </Box>
    );
}

export default ManageUsers;
