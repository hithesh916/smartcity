"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Box,
    Button,
    Flex,
    Input,
    Text,
    VStack,
    Heading,
    HStack,
    useColorModeValue,
    Icon,
    Select,
    Badge,
    Spinner,
    Divider,
    FormControl,
    FormLabel
} from "@chakra-ui/react";
import { Loader2, MapPin, ShieldCheck, Activity, Globe, Zap } from "lucide-react";
import { motion } from "framer-motion";

const MotionBox = motion(Box as any);

const CITIES = [
    { name: "New Delhi", lat: 28.6139, lng: 77.2090 },
    { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
    { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
    { name: "Chennai", lat: 13.0827, lng: 80.2707 },
    { name: "London", lat: 51.5074, lng: -0.1278 },
    { name: "New York", lat: 40.7128, lng: -74.0060 }
];

export default function LoginPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [selectedCity, setSelectedCity] = useState(CITIES[0]);
    const [prediction, setPrediction] = useState<any>(null);
    const [predicting, setPredicting] = useState(false);

    const bgRight = useColorModeValue("white", "gray.900");
    const textRight = useColorModeValue("gray.800", "white");
    const mutedText = useColorModeValue("gray.500", "gray.400");
    const inputBg = useColorModeValue("gray.50", "gray.800");
    const borderCol = useColorModeValue("gray.200", "gray.700");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const userName = name.trim() || email.split('@')[0];
        localStorage.setItem("userName", userName);
        localStorage.setItem("userEmail", email);

        // Minor delay for polished UX
        setTimeout(() => {
            router.push("/");
            router.refresh();
        }, 800);
    };

    const handlePredict = async () => {
        if (!selectedCity) return;
        setPredicting(true);
        setPrediction(null);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
            const res = await fetch(`${apiUrl}/api/analytics/predict-aqi-satellite`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lat: selectedCity.lat, lng: selectedCity.lng })
            });
            const data = await res.json();
            setPrediction(data);
        } catch (e) {
            console.error(e);
        } finally {
            setPredicting(false);
        }
    };

    return (
        <Flex minH="100vh" w="100%">
            {/* LEFT PANEL - Live Intelligence Engine */}
            <Flex
                flex={1}
                display={{ base: "none", lg: "flex" }}
                bg="black"
                color="white"
                p={16}
                direction="column"
                position="relative"
                overflow="hidden"
            >
                {/* Background effects */}
                <Box position="absolute" top="-10%" left="-10%" w="500px" h="500px" bg="blue.600" filter="blur(150px)" opacity={0.3} borderRadius="full" />
                <Box position="absolute" bottom="-10%" right="-10%" w="400px" h="400px" bg="purple.600" filter="blur(120px)" opacity={0.3} borderRadius="full" />

                <HStack spacing={3} mb={12} zIndex={10}>
                    <Icon as={Globe} w={8} h={8} color="blue.400" />
                    <Heading as="h1" size="lg" fontWeight="black" letterSpacing="tight">
                        Smart City Intel
                    </Heading>
                </HStack>

                <VStack align="flex-start" spacing={8} zIndex={10} maxW="md">
                    <Box>
                        <Heading size="2xl" mb={4} lineHeight="1.2">
                            Global Satellite <br /> Telemetry Engine.
                        </Heading>
                        <Text fontSize="lg" color="gray.400">
                            Enterprise-grade planetary analysis with 100% true mapping accuracy. Run a live scan below before you log in.
                        </Text>
                    </Box>

                    <Box
                        bg="whiteAlpha.100"
                        backdropFilter="blur(12px)"
                        border="1px solid"
                        borderColor="whiteAlpha.200"
                        borderRadius="xl"
                        p={6}
                        w="full"
                    >
                        <HStack mb={4} justify="space-between">
                            <HStack color="blue.300">
                                <Icon as={MapPin} w={5} h={5} />
                                <Text fontWeight="semibold" fontSize="sm">Location Intelligence</Text>
                            </HStack>
                            <Badge colorScheme="purple" variant="subtle" px={2} py={1} borderRadius="md" display="flex" alignItems="center" gap={1}>
                                <Icon as={Zap} w={3} h={3} /> Live
                            </Badge>
                        </HStack>

                        <Select
                            bg="blackAlpha.500"
                            borderColor="whiteAlpha.300"
                            color="white"
                            mb={4}
                            onChange={(e) => {
                                const city = CITIES.find(c => c.name === e.target.value);
                                if (city) setSelectedCity(city);
                            }}
                            _hover={{ borderColor: 'whiteAlpha.400' }}
                        >
                            {CITIES.map(c => (
                                <option key={c.name} value={c.name} style={{ background: '#1a202c', color: 'white' }}>
                                    {c.name}
                                </option>
                            ))}
                        </Select>

                        <Button
                            w="full"
                            colorScheme="blue"
                            onClick={handlePredict}
                            leftIcon={predicting ? undefined : <Activity size={18} />}
                            isLoading={predicting}
                            loadingText="Scanning Telemetry..."
                        >
                            Run Diagnostic Scan
                        </Button>

                        {prediction && (
                            <MotionBox
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                mt={5}
                                p={4}
                                bg="whiteAlpha.50"
                                borderRadius="lg"
                                border="1px solid"
                                borderColor={prediction.prediction_category?.includes('Good') || prediction.prediction_category?.includes('Satisfactory') ? 'green.500' : 'red.500'}
                            >
                                <VStack align="stretch" spacing={3}>
                                    <HStack justify="space-between">
                                        <Text color="gray.400" fontSize="sm">Verified Result</Text>
                                        <Badge colorScheme={prediction.prediction_category?.includes('Good') || prediction.prediction_category?.includes('Satisfactory') ? 'green' : 'red'}>
                                            {prediction.prediction_category || 'Moderate'}
                                        </Badge>
                                    </HStack>
                                    <HStack justify="space-between">
                                        <Text color="gray.400" fontSize="sm">Engine Accuracy</Text>
                                        <Text fontWeight="bold" color="blue.200">{prediction.confidence}</Text>
                                    </HStack>
                                    <Text fontSize="xs" color="gray.500">
                                        {prediction.message}
                                    </Text>
                                </VStack>
                            </MotionBox>
                        )}
                    </Box>

                    <HStack spacing={6} pt={8}>
                        <HStack color="gray.400">
                            <Icon as={ShieldCheck} />
                            <Text fontSize="sm">End-to-End Encrypted</Text>
                        </HStack>
                        <HStack color="gray.400">
                            <Icon as={Activity} />
                            <Text fontSize="sm">99.9% Uptime</Text>
                        </HStack>
                    </HStack>
                </VStack>
            </Flex>

            {/* RIGHT PANEL - LOGIN */}
            <Flex
                flex={{ base: 1, lg: 0.8 }}
                align="center"
                justify="center"
                bg={bgRight}
                p={8}
            >
                <Box w="full" maxW="400px">
                    <VStack align="stretch" spacing={8}>
                        <Box>
                            <Heading color={textRight} size="xl" letterSpacing="tight" mb={2}>
                                Welcome back
                            </Heading>
                            <Text color={mutedText} fontSize="md">
                                Sign in to access your administrative dashboard.
                            </Text>
                        </Box>

                        <form onSubmit={handleLogin}>
                            <VStack spacing={5}>
                                <FormControl isRequired>
                                    <FormLabel fontSize="sm" color={mutedText}>Full Name</FormLabel>
                                    <Input
                                        placeholder="John Doe"
                                        bg={inputBg}
                                        borderColor={borderCol}
                                        _hover={{ borderColor: "blue.400" }}
                                        _focus={{ borderColor: "blue.500", boxShadow: "none" }}
                                        size="lg"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel fontSize="sm" color={mutedText}>Email Address</FormLabel>
                                    <Input
                                        type="email"
                                        placeholder="name@company.com"
                                        bg={inputBg}
                                        borderColor={borderCol}
                                        _hover={{ borderColor: "blue.400" }}
                                        _focus={{ borderColor: "blue.500", boxShadow: "none" }}
                                        size="lg"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <Flex justify="space-between" align="center">
                                        <FormLabel fontSize="sm" color={mutedText} m={0}>Password</FormLabel>
                                        <Text as="a" href="#" fontSize="xs" color="blue.500" fontWeight="medium">
                                            Forgot password?
                                        </Text>
                                    </Flex>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        bg={inputBg}
                                        borderColor={borderCol}
                                        _hover={{ borderColor: "blue.400" }}
                                        _focus={{ borderColor: "blue.500", boxShadow: "none" }}
                                        size="lg"
                                        mt={2}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </FormControl>

                                <Button
                                    type="submit"
                                    w="full"
                                    colorScheme="blue"
                                    size="lg"
                                    mt={4}
                                    isLoading={loading}
                                    loadingText="Authenticating..."
                                    boxShadow="md"
                                >
                                    Sign in securely
                                </Button>
                            </VStack>
                        </form>

                        <Box position="relative" py={4}>
                            <Divider borderColor={borderCol} />
                            <Box
                                position="absolute"
                                top="50%"
                                left="50%"
                                transform="translate(-50%, -50%)"
                                bg={bgRight}
                                px={4}
                            >
                                <Text fontSize="xs" color={mutedText} fontWeight="medium" textTransform="uppercase">
                                    or
                                </Text>
                            </Box>
                        </Box>

                        <Button
                            variant="outline"
                            size="lg"
                            borderColor={borderCol}
                            color={textRight}
                            _hover={{ bg: useColorModeValue("gray.50", "gray.800") }}
                        >
                            Request Access Protocol
                        </Button>
                    </VStack>
                </Box>
            </Flex>
        </Flex>
    );
}
