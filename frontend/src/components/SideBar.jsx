import { useAuth } from '../context/AuthContext';
import { Box, Flex, VStack, Text, Button, Icon, Divider } from '@chakra-ui/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiUser, FiUsers, FiBookOpen, FiFileText, FiCalendar, FiLogOut, FiBook, } from 'react-icons/fi';
import { AiOutlineFileText } from "react-icons/ai";
import { FaRegCalendarAlt } from "react-icons/fa";
import api from '../api/axios';

function Sidebar() {
    const { user } = useAuth();
    const location = useLocation(); 
    const navigate = useNavigate();
    const { setUser, setIsAuthenticated } = useAuth();

    const navItems = [
        { id: 'profile', name: 'Profile', path: '/dashboard', roles:['student', 'professor', 'admin'], visible: true , protected:true, icon: FiUser },
        { id: 'users', name: 'Users', path: '/users', roles:['admin'], visible: true, protected:true, icon: FiUsers },
        { id: 'courses', name: 'Courses', path: '/courses', roles:['student', 'admin'], visible: true, protected:true, icon: FiBookOpen },
        { id: 'my-courses', name: 'My Courses', path: '/my-courses', roles:['student', 'professor', 'admin'], visible: true, protected: true, icon: FiBook},
        { id: 'assignments', name: 'Assignments', path: '/assignments', roles:['student', 'professor', 'admin'], visible: true, protected:true, icon: FiFileText },
        { id: 'attendance', name: 'Attendance', path: '/attendance', roles:['student'], visible: false , protected:false , icon: FaRegCalendarAlt},
    ];

    const visibleNavItems = navItems.filter((item) => item.roles.includes(user.role));

    const handleLogout = async () => {
        try {
            api.post("/auth/logout", {});

            setUser(null);
            setIsAuthenticated(false);

            navigate('/login', { replace: true });
        } catch (error) {
            console.error("Logout failed:", error);
            navigate('/login');
        }
    };

    return (
        <Flex
            as="nav"
            direction="column"
            justify="space-between" 
            w="250px"
            h="100vh"
            bg="gray.800"
            borderRight="1px solid"
            borderColor="gray.700"
            p={5}
            position="sticky"
            top="0"
        >
            <Box>
                <Text 
                    fontSize="2xl" 
                    fontWeight="extrabold" 
                    color="white" 
                    mb={8}
                    letterSpacing="wide"
                >
                    College CMS
                </Text>

                <VStack align="stretch" spacing={2}>
                    {visibleNavItems.map((item) => {
                        const isActive = (location.pathname === item.path) && (item.roles.includes(user.role));

                        return (
                            <Link to={item.path} key={item.name}>
                                <Flex
                                    align="center"
                                    p={3}
                                    borderRadius="md"
                                    role="group"
                                    cursor="pointer"
                                    bg={isActive ? "blue.500" : "transparent"}
                                    color={isActive ? "white" : "gray.400"}
                                    _hover={{
                                        bg: isActive ? "blue.600" : "gray.700",
                                        color: "white",
                                    }}
                                    transition="all 0.2s"
                                >
                                    <Icon 
                                        as={item.icon} 
                                        mr={4} 
                                        fontSize="18px" 
                                    />
                                    <Text fontWeight="medium">{item.name}</Text>
                                </Flex>
                            </Link>
                        );
                    })}
                </VStack>
            </Box>

            <Box>
                <Divider borderColor="gray.700" mb={4} />
                <Button
                    variant="ghost"
                    w="full"
                    justifyContent="flex-start"
                    color="red.400"
                    _hover={{ bg: "red.900", color: "red.200" }}
                    onClick={handleLogout}
                    leftIcon={<Icon as={FiLogOut} fontSize="18px" />}
                >
                    Log Out
                </Button>
            </Box>
        </Flex>
    );
}

export default Sidebar;
