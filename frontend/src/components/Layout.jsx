import { Flex, Box } from "@chakra-ui/react";
import Sidebar from "./SideBar"; 

function Layout({ children }) {
    return (
        <Flex minH="100vh" bg="gray.900">
            
            <Box
                w="250px"
                bg="gray.800"
                borderRight="1px solid"
                borderColor="gray.700"
            >
                <Sidebar />
            </Box>

            <Box
                flex="1"
                p={6}
                overflowY="auto"
            >
                {children}
            </Box>

        </Flex>
    );
}

export default Layout;
