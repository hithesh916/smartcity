import { useState, useEffect } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Box,
    Flex,
    Heading,
    Text,
    Badge,
    VStack,
    HStack,
    Select,
    SimpleGrid,
    Icon,
    Spinner,
    useColorModeValue,
} from "@chakra-ui/react";
import {
    MapPin,
    Zap,
    CheckCircle2,
    AlertCircle,
    Activity,
} from "lucide-react";

const CITIES = [
    { name: "New Delhi", lat: 28.6139, lng: 77.2090 },
    { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
    { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
    { name: "Chennai", lat: 13.0827, lng: 80.2707 },
    { name: "London", lat: 51.5074, lng: -0.1278 },
    { name: "New York", lat: 40.7128, lng: -74.0060 }
];

const CITY_STATS: Record<string, Record<string, string>> = {
    "New Delhi": { air: "Bad", water: "Moderate", traffic: "Bad", crime: "Moderate", humidity: "Moderate", parks: "Good", hospital: "Good" },
    "Mumbai": { air: "Moderate", water: "Good", traffic: "Bad", crime: "Moderate", humidity: "Bad", parks: "Moderate", hospital: "Good" },
    "Bengaluru": { air: "Moderate", water: "Bad", traffic: "Bad", crime: "Good", humidity: "Good", parks: "Good", hospital: "Good" },
    "Chennai": { air: "Moderate", water: "Bad", traffic: "Moderate", crime: "Good", humidity: "Bad", parks: "Moderate", hospital: "Good" },
    "London": { air: "Good", water: "Good", traffic: "Moderate", crime: "Good", humidity: "Good", parks: "Good", hospital: "Good" },
    "New York": { air: "Good", water: "Good", traffic: "Bad", crime: "Moderate", humidity: "Moderate", parks: "Good", hospital: "Good" }
};

const FILTER_CATEGORIES = ["air", "water", "traffic", "crime", "humidity", "parks", "hospital"];

const LEVEL_WEIGHT: Record<string, number> = {
    "Good": 3,
    "Moderate": 2,
    "Bad": 1
};

export function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [selectedCity, setSelectedCity] = useState(CITIES[0]);
    const [prediction, setPrediction] = useState<any>(null);
    const [predicting, setPredicting] = useState(false);
    const [preferences, setPreferences] = useState<Record<string, string>>({
        air: "Moderate",
        water: "Moderate",
        traffic: "Moderate",
        crime: "Moderate",
        humidity: "Moderate",
        parks: "Moderate",
        hospital: "Moderate"
    });

    useEffect(() => {
        if (!isOpen) return;
        const savedCity = localStorage.getItem("adminSelectedCity");
        if (savedCity) {
            const match = CITIES.find(c => c.name === savedCity);
            if (match) setSelectedCity(match);
        }

        const savedPrefs = localStorage.getItem("adminPreferences");
        if (savedPrefs) {
            try { setPreferences(JSON.parse(savedPrefs)); } catch { }
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const fetchPrediction = async () => {
            setPredicting(true);
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
        fetchPrediction();
    }, [selectedCity, isOpen]);

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const city = CITIES.find((c) => c.name === e.target.value);
        if (city) {
            setSelectedCity(city);
            localStorage.setItem("adminSelectedCity", city.name);
        }
    };

    const updatePreference = (cat: string, val: string) => {
        const newPrefs = { ...preferences, [cat]: val };
        setPreferences(newPrefs);
        localStorage.setItem("adminPreferences", JSON.stringify(newPrefs));
    };

    const getRecommendation = () => {
        const stats = CITY_STATS[selectedCity.name];
        let mismatches = 0;
        FILTER_CATEGORIES.forEach(cat => {
            const cityGrade = stats[cat];
            const prefGrade = preferences[cat];
            if ((LEVEL_WEIGHT[cityGrade] || 0) < (LEVEL_WEIGHT[prefGrade] || 0)) {
                mismatches++;
            }
        });
        if (mismatches > 2) return { status: "Bad", msg: "This place is BAD for you based on your preferences." };
        if (mismatches > 0) return { status: "Moderate", msg: "This place is MODERATE for you. Some factors fall below your standards." };
        return { status: "Good", msg: "This place is GOOD for you! It matches your preferences perfectly." };
    };

    const recommendation = getRecommendation();

    const mutedColor = useColorModeValue("gray.500", "gray.400");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
    const inputBg = useColorModeValue("white", "whiteAlpha.200");
    const modalBg = useColorModeValue("white", "gray.800");

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="5xl" isCentered>
            <ModalOverlay backdropFilter="blur(4px)" bg="blackAlpha.600" />
            <ModalContent bg={modalBg} borderColor={borderColor} borderWidth={1}>
                <ModalHeader pb={2}>
                    <HStack justify="space-between" pr={6}>
                        <HStack>
                            <Icon as={MapPin} boxSize={5} color="blue.500" />
                            <Heading size="md">Global Filter & Preference Settings</Heading>
                        </HStack>
                        <Badge colorScheme="purple" variant="subtle" display="flex" alignItems="center" gap={1}>
                            <Icon as={Zap} w={3} h={3} /> Live Connection
                        </Badge>
                    </HStack>
                    <Text fontSize="sm" color={mutedColor} mt={1} fontWeight="normal">
                        Select a region and configure your personal standards (water, air, crime, etc.). We'll evaluate if the region is a good match for you globally across the application.
                    </Text>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6} pt={2}>
                    <Flex direction={{ base: "column", lg: "row" }} gap={8}>
                        {/* Left Side: City & Satellite Model */}
                        <VStack align="stretch" spacing={4} flex={1}>
                            <Text fontSize="sm" fontWeight="bold">1. Select Target Region</Text>
                            <Select
                                bg={inputBg}
                                borderColor={borderColor}
                                value={selectedCity.name}
                                onChange={handleCityChange}
                                size="lg"
                            >
                                {CITIES.map(c => (
                                    <option key={c.name} value={c.name}>
                                        {c.name}
                                    </option>
                                ))}
                            </Select>

                            {predicting ? (
                                <HStack justify="center" p={4} borderWidth={1} borderColor={borderColor} borderRadius="md" h="115px">
                                    <Spinner size="sm" color="blue.500" />
                                    <Text fontSize="sm" color={mutedColor}>Fetching Telemetry...</Text>
                                </HStack>
                            ) : prediction ? (
                                <Box p={4} borderWidth={1} borderColor={prediction.prediction_category?.includes('Good') || prediction.prediction_category?.includes('Satisfactory') ? 'green.500' : 'red.500'} borderRadius="md" bg={useColorModeValue("gray.50", "gray.900")}>
                                    <VStack align="stretch" spacing={2}>
                                        <HStack justify="space-between">
                                            <Text fontSize="sm" color={mutedColor}>Satellite Model Air Rating</Text>
                                            <Badge colorScheme={prediction.prediction_category?.includes('Good') || prediction.prediction_category?.includes('Satisfactory') ? 'green' : 'red'}>
                                                {prediction.prediction_category || 'Moderate'}
                                            </Badge>
                                        </HStack>
                                        <HStack justify="space-between">
                                            <Text fontSize="sm" color={mutedColor}>Prediction Engine</Text>
                                            <Text fontWeight="bold" fontSize="sm" color="blue.500">{prediction.confidence}</Text>
                                        </HStack>
                                        <Text fontSize="xs" color="gray.500" mt={1}>
                                            {prediction.message}
                                        </Text>
                                    </VStack>
                                </Box>
                            ) : null}
                        </VStack>

                        {/* Right Side: Preferences */}
                        <VStack align="stretch" spacing={4} flex={2}>
                            <Text fontSize="sm" fontWeight="bold">2. Minimum Preference Requirements</Text>
                            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3}>
                                {FILTER_CATEGORIES.map(cat => (
                                    <Box key={cat}>
                                        <Text fontSize="xs" color={mutedColor} textTransform="capitalize" mb={1}>{cat}</Text>
                                        <Select
                                            size="sm"
                                            bg={inputBg}
                                            value={preferences[cat]}
                                            onChange={e => updatePreference(cat, e.target.value)}
                                        >
                                            <option value="Good">Good</option>
                                            <option value="Moderate">Moderate</option>
                                            <option value="Bad">Bad</option>
                                        </Select>
                                    </Box>
                                ))}
                            </SimpleGrid>

                            <Box p={4} mt={3} bg={recommendation.status === 'Good' ? 'green.50' : recommendation.status === 'Bad' ? 'red.50' : 'orange.50'}
                                _dark={{ bg: recommendation.status === 'Good' ? 'green.900' : recommendation.status === 'Bad' ? 'red.900' : 'orange.900' }}
                                borderRadius="md" borderWidth={1} borderColor={recommendation.status === 'Good' ? 'green.200' : recommendation.status === 'Bad' ? 'red.200' : 'orange.200'}>
                                <VStack align="start" spacing={1}>
                                    <HStack>
                                        <Icon as={recommendation.status === 'Good' ? CheckCircle2 : recommendation.status === 'Bad' ? AlertCircle : Activity}
                                            color={recommendation.status === 'Good' ? 'green.500' : recommendation.status === 'Bad' ? 'red.500' : 'orange.500'} />
                                        <Text fontWeight="bold" color={useColorModeValue("black", "white")}>
                                            Overall Match: {recommendation.status}
                                        </Text>
                                    </HStack>
                                    <Text fontSize="sm" color={useColorModeValue("gray.700", "gray.300")}>
                                        {recommendation.msg} {recommendation.status !== 'Good' && <Text as="span" fontSize="xs">({selectedCity.name} stats: Water is {CITY_STATS[selectedCity.name].water}, Crime is {CITY_STATS[selectedCity.name].crime}, etc.)</Text>}
                                    </Text>
                                </VStack>
                            </Box>
                        </VStack>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
