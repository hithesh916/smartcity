"use client";

import {
    Box,
    Flex,
    VStack,
    HStack,
    Text,
    Heading,
    Spinner,
    Button,
    Divider,
    SimpleGrid,
    Icon,
    useColorModeValue,
} from "@chakra-ui/react";
import {
    Loader2,
    Shield,
    Cloud,
    Activity,
    MapPin,
    History,
    Navigation,
} from "lucide-react";

export default function IntelligenceSidebar({
    data,
    loading,
    history,
    onSelectHistory,
}: {
    data: any;
    loading: boolean;
    history: any[];
    onSelectHistory: (item: any) => void;
}) {
    // ── Theme tokens ────────────────────────────────────────────
    const sidebarBg = useColorModeValue("white", "gray.900");
    const headerBg = useColorModeValue("gray.50", "blackAlpha.300");
    const borderCol = useColorModeValue("gray.200", "gray.800");
    const headingCol = useColorModeValue("gray.900", "white");
    const mutedCol = useColorModeValue("gray.500", "gray.400");
    const faintCol = useColorModeValue("gray.400", "gray.500");
    const cardBg = useColorModeValue("gray.50", "gray.800");
    const cardBorder = useColorModeValue("gray.200", "gray.700");
    const btnHover = useColorModeValue("gray.100", "gray.700");
    const btnBorder = useColorModeValue("gray.300", "gray.700");
    const histBtnBg = useColorModeValue("gray.100", "gray.800");
    const histBtnHov = useColorModeValue("gray.200", "gray.700");
    const histHeadCol = useColorModeValue("gray.700", "gray.300");

    return (
        <Flex h="full" w="full" direction="column" bg={sidebarBg} color={headingCol} borderLeftWidth={1} borderColor={borderCol}>
            {/* Header */}
            <Box p={4} borderBottomWidth={1} borderColor={borderCol} bg={headerBg}>
                <HStack mb={1}>
                    <Box h={2} w={2} borderRadius="full" bg="green.400" className="animate-pulse" />
                    <Text fontSize="xs" fontWeight="bold" color="green.400" textTransform="uppercase" letterSpacing="wider">
                        Live Signal
                    </Text>
                </HStack>
                <Heading size="sm" color={headingCol} isTruncated title={data?.location?.address}>
                    {data?.location?.address
                        ? data.location.address.split(",")[0]
                        : data?.location?.lat
                            ? `Loc: ${data.location.lat.toFixed(4)}, ${data.location.lng.toFixed(4)}`
                            : "Area Intelligence"}
                </Heading>
                <Text fontSize="xs" color={mutedCol} fontFamily="mono" mt={1} isTruncated>
                    {data?.location?.address ||
                        (data?.location?.lat
                            ? `${data.location.lat.toFixed(4)}, ${data.location.lng.toFixed(4)}`
                            : "Select a location")}
                </Text>
            </Box>

            {/* Main Content Area */}
            <Box flex={1} overflowY="auto" overflowX="hidden" css={{
                "&::-webkit-scrollbar": { width: "4px" },
                "&::-webkit-scrollbar-track": { width: "6px" },
                "&::-webkit-scrollbar-thumb": { background: "#4A5568", borderRadius: "24px" },
            }}>
                <Box p={4}>
                    {loading ? (
                        <VStack h="full" justify="center" align="center" color={mutedCol} pt={20} spacing={4}>
                            <Spinner size="xl" />
                            <Text fontSize="sm">Analyzing Street Data...</Text>
                        </VStack>
                    ) : !data ? (
                        <VStack justify="center" align="center" color={mutedCol} pt={20}>
                            <Icon as={Navigation} boxSize={12} mb={4} opacity={0.5} />
                            <Text fontSize="sm" textAlign="center">
                                Click on the map to scan<br />a specific street.
                            </Text>
                        </VStack>
                    ) : (
                        <VStack spacing={4} align="stretch" className="animate-in fade-in duration-500">
                            {/* STREET VIEW BUTTON */}
                            <Button
                                variant="outline"
                                size="sm"
                                w="full"
                                borderColor={btnBorder}
                                color="blue.400"
                                _hover={{ bg: btnHover }}
                                onClick={() =>
                                    window.open(
                                        `https://www.google.com/maps?layer=c&cbll=${data.location.lat},${data.location.lng}`,
                                        "_blank"
                                    )
                                }
                            >
                                <Icon as={MapPin} mr={2} boxSize={4} /> Open Street View
                            </Button>

                            {/* VERDICT SECTION — always stays green/red themed */}
                            <SimpleGrid columns={2} spacing={2}>
                                <Box bg="green.900" p={2} borderRadius="md" borderWidth={1} borderColor="green.800">
                                    <Text fontSize="xs" fontWeight="bold" color="green.300" textTransform="uppercase" mb={1}>
                                        The Good
                                    </Text>
                                    <VStack align="start" spacing={1}>
                                        {data.verdict?.pros?.length > 0 ? (
                                            data.verdict.pros.map((p: string, i: number) => (
                                                <HStack align="start" key={i} spacing={1}>
                                                    <Text color="green.200" fontSize="xs">•</Text>
                                                    <Text fontSize="xs" color="green.100" opacity={0.8}>{p}</Text>
                                                </HStack>
                                            ))
                                        ) : (
                                            <Text fontSize="xs" color="green.100" opacity={0.8}>No major pros detected</Text>
                                        )}
                                    </VStack>
                                </Box>
                                <Box bg="red.900" p={2} borderRadius="md" borderWidth={1} borderColor="red.800">
                                    <Text fontSize="xs" fontWeight="bold" color="red.300" textTransform="uppercase" mb={1}>
                                        The Bad
                                    </Text>
                                    <VStack align="start" spacing={1}>
                                        {data.verdict?.cons?.length > 0 ? (
                                            data.verdict.cons.map((c: string, i: number) => (
                                                <HStack align="start" key={i} spacing={1}>
                                                    <Text color="red.200" fontSize="xs">•</Text>
                                                    <Text fontSize="xs" color="red.100" opacity={0.8}>{c}</Text>
                                                </HStack>
                                            ))
                                        ) : (
                                            <Text fontSize="xs" color="red.100" opacity={0.8}>No major issues</Text>
                                        )}
                                    </VStack>
                                </Box>
                            </SimpleGrid>

                            {/* TOP ROW: Safety & Env */}
                            <SimpleGrid columns={2} spacing={2}>
                                <Flex
                                    direction="column"
                                    align="center"
                                    justify="center"
                                    bg={cardBg}
                                    p={3}
                                    borderRadius="md"
                                    borderWidth={1}
                                    borderColor={cardBorder}
                                    textAlign="center"
                                >
                                    <Icon as={Shield} color="pink.500" boxSize={5} mb={1} />
                                    <Text fontSize="xs" fontWeight="bold" color={mutedCol} textTransform="uppercase" letterSpacing="widest">
                                        Safety
                                    </Text>
                                    <Heading size="lg" mt={1} color={headingCol}>
                                        {data.safety?.score}
                                    </Heading>
                                    <Text
                                        fontSize="xs"
                                        fontWeight="bold"
                                        color={data.safety?.score > 70 ? "green.400" : "yellow.400"}
                                    >
                                        {data.safety?.rating}
                                    </Text>
                                </Flex>

                                <Flex
                                    direction="column"
                                    bg={cardBg}
                                    p={3}
                                    borderRadius="md"
                                    borderWidth={1}
                                    borderColor={cardBorder}
                                >
                                    <HStack color={mutedCol} mb={2}>
                                        <Icon as={Cloud} color="blue.400" boxSize={4} />
                                        <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="widest">
                                            Env
                                        </Text>
                                    </HStack>
                                    <VStack align="stretch" spacing={1}>
                                        <Flex justify="space-between">
                                            <Text fontSize="xs" color={faintCol}>AQI</Text>
                                            <Text fontSize="xs" fontFamily="mono" fontWeight="bold" color={data.environment?.aqi?.value > 150 ? "red.400" : "green.400"}>
                                                {data.environment?.aqi?.value}
                                            </Text>
                                        </Flex>
                                        <Flex justify="space-between">
                                            <Text fontSize="xs" color={faintCol}>Noise</Text>
                                            <Text fontSize="xs" fontFamily="mono" fontWeight="bold" color={parseInt(data.environment?.noise?.value) > 70 ? "yellow.400" : "green.400"}>
                                                {data.environment?.noise?.value}
                                            </Text>
                                        </Flex>
                                        <Flex justify="space-between">
                                            <Text fontSize="xs" color={faintCol}>Temp</Text>
                                            <Text fontSize="xs" fontFamily="mono" color={mutedCol}>
                                                {data.environment?.weather?.temp}
                                            </Text>
                                        </Flex>
                                    </VStack>
                                </Flex>
                            </SimpleGrid>

                            {/* URBAN PULSE */}
                            <Box bg={cardBg} p={3} borderRadius="md" borderWidth={1} borderColor={cardBorder}>
                                <HStack mb={2}>
                                    <Icon as={Activity} boxSize={3} color={mutedCol} />
                                    <Text fontSize="xs" fontWeight="bold" color={mutedCol} textTransform="uppercase" letterSpacing="widest">
                                        Urban Pulse
                                    </Text>
                                </HStack>
                                <SimpleGrid columns={4} spacing={2} textAlign="center">
                                    <Box borderRightWidth={1} borderColor={cardBorder} pr={2}>
                                        <Text fontSize="2xs" color={faintCol} textTransform="uppercase">Traffic</Text>
                                        <Text fontSize="sm" fontWeight="black" color={data.traffic?.congestion > 40 ? "red.500" : "green.500"}>
                                            {data.traffic?.congestion?.toFixed(0)}%
                                        </Text>
                                    </Box>
                                    <Box borderRightWidth={1} borderColor={cardBorder} px={1}>
                                        <Text fontSize="2xs" color={faintCol} textTransform="uppercase">Crime</Text>
                                        <Text fontSize="sm" fontWeight="black" color="pink.500">
                                            {data.safety?.crime_rate}
                                        </Text>
                                    </Box>
                                    <Box borderRightWidth={1} borderColor={cardBorder} px={1}>
                                        <Text fontSize="2xs" color={faintCol} textTransform="uppercase">Transit</Text>
                                        <Text fontSize="sm" fontWeight="black" color="blue.400">
                                            {data.nearby?.transport_score || 85}
                                        </Text>
                                    </Box>
                                    <Box pl={2}>
                                        <Text fontSize="2xs" color={faintCol} textTransform="uppercase">Parking</Text>
                                        <Text fontSize="sm" fontWeight="black" color="purple.400">
                                            {data.nearby?.parking_score || 50}%
                                        </Text>
                                    </Box>
                                </SimpleGrid>
                            </Box>

                            {/* NEARBY ACCESS */}
                            <Box>
                                <Text fontSize="xs" fontWeight="bold" color={mutedCol} textTransform="uppercase" mb={2}>
                                    Nearby Access
                                </Text>
                                <SimpleGrid columns={3} spacing={2}>
                                    {[
                                        { val: data.nearby?.hospitals, label: "Medical" },
                                        { val: data.nearby?.parks, label: "Parks" },
                                        { val: data.nearby?.malls, label: "Shops" },
                                    ].map((item) => (
                                        <Flex key={item.label} direction="column" justify="center" align="center" bg={cardBg} p={2} borderRadius="md" borderWidth={1} borderColor={cardBorder}>
                                            <Heading size="md" color={headingCol}>{item.val}</Heading>
                                            <Text fontSize="2xs" color={faintCol} textTransform="uppercase">{item.label}</Text>
                                        </Flex>
                                    ))}
                                </SimpleGrid>
                            </Box>
                        </VStack>
                    )}

                    {/* HISTORY SECTION */}
                    {history.length > 0 && (
                        <Box mt={6} pt={6} borderTopWidth={1} borderColor={borderCol}>
                            <HStack mb={3}>
                                <Icon as={History} boxSize={4} color={histHeadCol} />
                                <Text fontSize="sm" fontWeight="bold" color={histHeadCol} textTransform="uppercase">
                                    Recent Scans
                                </Text>
                            </HStack>
                            <VStack spacing={2} align="stretch">
                                {history.map((item, idx) => (
                                    <Button
                                        key={idx}
                                        variant="ghost"
                                        justifyContent="flex-start"
                                        h="auto"
                                        py={2}
                                        px={3}
                                        bg={histBtnBg}
                                        _hover={{ bg: histBtnHov }}
                                        borderWidth={1}
                                        borderColor={cardBorder}
                                        onClick={() => onSelectHistory(item)}
                                    >
                                        <Icon as={MapPin} boxSize={4} mr={2} color={mutedCol} flexShrink={0} />
                                        <Box overflow="hidden" textAlign="left">
                                            <Text fontSize="xs" fontWeight="bold" color={headingCol} isTruncated>
                                                {item.location?.address?.split(",")[0] || "Unknown Location"}
                                            </Text>
                                            <Text fontSize="10px" color={faintCol} fontFamily="mono" isTruncated>
                                                {item.safety?.score ? `Safety: ${item.safety.score}` : "Scanned"}
                                            </Text>
                                        </Box>
                                    </Button>
                                ))}
                            </VStack>
                        </Box>
                    )}
                </Box>
            </Box>
        </Flex>
    );
}
