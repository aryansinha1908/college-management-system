import { useState } from "react";
import { Box, Flex, Heading, Text, VStack, Button, Input, Image, useToast, FormControl, FormLabel, Divider, HStack, PinInput, PinInputField } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Setup2FA() {
    const { user } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    const [qrCode, setQrCode] = useState("");
    const [secret, setSecret] = useState("");
    const [token, setToken] = useState("");
    
    const [isGenerating, setIsGenerating] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isDisabling, setIsDisabling] = useState(false);

    const handleGenerate2FA = async () => {
        setIsGenerating(true);
        try {
            const response = await api.post("/auth/send-otp");
            
            setQrCode(response.data.qrCode); // Should be a base64 image data URL
            setSecret(response.data.secret); // The raw text secret (optional, as a backup)
            
            toast({
                title: "QR Code Generated",
                description: "Scan the code with your Authenticator app.",
                status: "info",
                duration: 4000,
                isClosable: true,
                position: "top-right"
            });
        } catch (error) {
            toast({
                title: "Generation Failed",
                description: error.response?.data?.message || "Could not generate 2FA setup.",
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "top-right"
            });
        } finally {
            setIsGenerating(false);
        }
    };

    // Step 2: Send the 6-digit code to the backend to confirm
    const handleVerify2FA = async (e) => {
        e.preventDefault();
        setIsVerifying(true);
        try {
            await api.post("/auth/2fa/verify", { token });
            
            toast({
                title: "2FA Enabled!",
                description: "Your account is now secured with Two-Factor Authentication.",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            });
            
            // Send them back to the dashboard after success
            navigate("/dashboard");
        } catch (error) {
            toast({
                title: "Verification Failed",
                description: error.response?.data?.message || "Invalid code. Please try again.",
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "top-right"
            });
        } finally {
            setIsVerifying(false);
        }
    };

    // Bonus: Let them turn it off
    const handleDisable2FA = async () => {
        if (!window.confirm("Are you sure you want to disable 2FA? This will make your account less secure.")) return;
        
        setIsDisabling(true);
        try {
            await api.post("/auth/2fa/disable");
            
            toast({
                title: "2FA Disabled",
                description: "Two-Factor Authentication has been removed.",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            });
            
            navigate("/dashboard");
        } catch (error) {
            toast({
                title: "Failed to Disable",
                description: error.response?.data?.message || "Could not disable 2FA.",
                status: "error",
                duration: 4000,
                isClosable: true,
                position: "top-right"
            });
        } finally {
            setIsDisabling(false);
        }
    };

    return (
        <Flex bg="gray.900" minH="100vh" align="center" justify="center" p={4}>
            <Box bg="gray.800" p={8} rounded="xl" shadow="2xl" maxW="md" w="full" border="1px solid" borderColor="gray.700">
                
                <Heading color="white" mb={2} size="lg" textAlign="center">
                    Two-Factor Authentication
                </Heading>
                
                {user?.twoFactorEnabled ? (
                    <VStack spacing={6} mt={6}>
                        <Box bg="green.900" p={4} rounded="md" border="1px solid" borderColor="green.600" w="full" textAlign="center">
                            <Text color="green.100" fontWeight="bold">✅ 2FA is currently ENABLED</Text>
                            <Text color="green.200" fontSize="sm" mt={1}>Your account is highly secure.</Text>
                        </Box>
                        <Button 
                            colorScheme="red" 
                            variant="outline" 
                            w="full" 
                            isLoading={isDisabling}
                            onClick={handleDisable2FA}
                        >
                            Disable 2FA
                        </Button>
                        <Button variant="ghost" colorScheme="gray" color="white" w="full" onClick={() => navigate("/dashboard")}>
                            Back to Dashboard
                        </Button>
                    </VStack>
                ) : (
                    <VStack spacing={6} mt={6}>
                        <Text color="gray.400" textAlign="center" fontSize="sm">
                            Protect your account by requiring a 6-digit code from your authenticator app every time you log in.
                        </Text>

                        {!qrCode ? (
                            <Button 
                                colorScheme="blue" 
                                w="full" 
                                size="lg"
                                isLoading={isGenerating}
                                onClick={handleGenerate2FA}
                            >
                                Get Started
                            </Button>
                        ) : (
                            <VStack spacing={5} w="full">
                                <Box bg="white" p={4} rounded="xl">
                                    <Image src={qrCode} alt="2FA QR Code" boxSize="200px" />
                                </Box>
                                
                                <Box textAlign="center">
                                    <Text color="gray.300" fontSize="sm" mb={1}>Can't scan the QR code?</Text>
                                    <Text color="blue.300" fontSize="xs" fontFamily="monospace" bg="gray.900" p={2} rounded="md">
                                        {secret}
                                    </Text>
                                </Box>

                                <Divider borderColor="gray.600" />

                                <form onSubmit={handleVerify2FA} style={{ width: '100%' }}>
                                    <VStack spacing={4}>
                                        <FormControl isRequired>
                                            <FormLabel color="gray.300" textAlign="center">Enter 6-Digit Code</FormLabel>
                                            <HStack justify="center">
                                                <PinInput 
                                                    otp 
                                                    value={token} 
                                                    onChange={(val) => setToken(val)}
                                                    colorScheme="blue"
                                                >
                                                    <PinInputField bg="gray.900" color="white" borderColor="gray.600" />
                                                    <PinInputField bg="gray.900" color="white" borderColor="gray.600" />
                                                    <PinInputField bg="gray.900" color="white" borderColor="gray.600" />
                                                    <PinInputField bg="gray.900" color="white" borderColor="gray.600" />
                                                    <PinInputField bg="gray.900" color="white" borderColor="gray.600" />
                                                    <PinInputField bg="gray.900" color="white" borderColor="gray.600" />
                                                </PinInput>
                                            </HStack>
                                        </FormControl>

                                        <Button type="submit" colorScheme="green" w="full" isLoading={isVerifying}>
                                            Verify & Enable
                                        </Button>
                                    </VStack>
                                </form>
                            </VStack>
                        )}

                        <Button variant="ghost" colorScheme="gray" color="white" w="full" onClick={() => navigate("/dashboard")}>
                            Cancel
                        </Button>
                    </VStack>
                )}
            </Box>
        </Flex>
    );
}

export default Setup2FA;
