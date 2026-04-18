"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Input,
  Button,
  SimpleGrid,
  Card,
  CardBody,
  Icon,
  useToast,
  Flex,
  Badge,
  Progress,
  Divider,
  useColorModeValue,
  useColorMode,
  CircularProgress,
  CircularProgressLabel,
  Tooltip,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Tag,
  TagLabel,
  TagLeftIcon,
  Grid,
  GridItem,
  Container
} from "@chakra-ui/react";
import {
  Activity,
  Droplets,
  Car,
  AlertTriangle,
  Stethoscope,
  Trees,
  ArrowRight,
  MapPin,
  Search,
  Zap,
  Shield,
  BarChart2,
  Globe,
  Cpu,
  Wind,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  Wifi,
  Map,
  Home as HomeIcon,
  XCircle,
  Info,
  Star,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Layers,
  Sparkles,
  Database,
  Radio,
  Eye,
  ArrowUpRight,
} from "lucide-react";
import { useIntelligence } from "@/components/providers/IntelligenceContext";

const iconMap: Record<string, typeof Activity> = {
  Activity, Droplets, Car, AlertTriangle, Stethoscope, Trees,
};

// ── Animated number counter ───────────────────────────────────────
function CountUp({ to, unit = "", duration = 1200 }: { to: number; unit?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const totalSteps = 40;
    const step = Math.ceil(to / totalSteps);
    const interval = duration / totalSteps;
    const timer = setInterval(() => {
      start = Math.min(start + step, to);
      setVal(start);
      if (start >= to) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, [to, duration]);
  return <>{val.toLocaleString()}{unit}</>;
}

// ── Live pulse indicator ──────────────────────────────────────────
function LiveBadge() {
  return (
    <HStack spacing={1.5}>
      <Box position="relative" w={2} h={2}>
        <Box position="absolute" inset={0} borderRadius="full" bg="green.400"
          sx={{ animation: "pulse 1.8s ease-out infinite" }} />
        <Box position="absolute" inset="2px" borderRadius="full" bg="green.400" />
      </Box>
      <Text fontSize="xs" fontWeight="bold" color="green.400" letterSpacing="wider" textTransform="uppercase">
        Live
      </Text>
    </HStack>
  );
}

// ── Animated gradient orb (background decoration) ─────────────────
function GradientOrb({
  size, top, left, right, bottom, color1, color2, delay = "0s", opacity = 0.15
}: {
  size: string; top?: string; left?: string; right?: string; bottom?: string;
  color1: string; color2: string; delay?: string; opacity?: number;
}) {
  return (
    <Box
      position="absolute"
      w={size} h={size}
      top={top} left={left} right={right} bottom={bottom}
      borderRadius="full"
      bgGradient={`radial(${color1}, ${color2}, transparent)`}
      opacity={opacity}
      filter="blur(40px)"
      pointerEvents="none"
      sx={{ animation: `float-slow 8s ease-in-out infinite`, animationDelay: delay }}
    />
  );
}

// ── KPI Stat Box ─────────────────────────────────────────────────
function KPIBox({ icon, label, value, suffix, color, delay }: any) {
  const bg = useColorModeValue("white", "rgba(17, 17, 27, 0.7)");
  const border = useColorModeValue("gray.200", "whiteAlpha.100");
  const headCol = useColorModeValue("gray.900", "white");
  const mutCol = useColorModeValue("gray.500", "gray.400");
  const iconBg = useColorModeValue(`${color}.50`, `${color}.900`);

  return (
    <Box
      bg={bg}
      borderWidth={1}
      borderColor={border}
      borderRadius="2xl"
      p={5}
      backdropFilter="blur(12px)"
      position="relative"
      overflow="hidden"
      _hover={{
        borderColor: `${color}.400`,
        shadow: `0 8px 30px rgba(0,0,0,0.12)`,
        transform: "translateY(-2px)",
      }}
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      sx={{ animation: `slide-up 0.6s ease-out both`, animationDelay: delay }}
    >
      {/* Subtle corner glow */}
      <Box
        position="absolute"
        top="-20px" right="-20px"
        w="80px" h="80px"
        borderRadius="full"
        bg={`${color}.400`}
        opacity={0.06}
        filter="blur(20px)"
      />
      <Flex align="center" gap={3}>
        <Box
          p={2.5}
          borderRadius="xl"
          bg={iconBg}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Icon as={icon} color={`${color}.500`} boxSize={5} />
        </Box>
        <Box>
          <Text fontSize="2xl" fontWeight="800" color={headCol} lineHeight={1}>
            {value}{suffix && <Text as="span" fontSize="sm" fontWeight="600" color={mutCol}>{suffix}</Text>}
          </Text>
          <Text fontSize="xs" color={mutCol} fontWeight="500" mt={0.5}>{label}</Text>
        </Box>
      </Flex>
    </Box>
  );
}

// ── Metric card with glassmorphism ───────────────────────────────
function MetricCard({ metric, index }: { metric: any; index: number }) {
  const MetricIcon = iconMap[metric.icon] || Activity;
  const cardBg = useColorModeValue("white", "rgba(17, 17, 27, 0.6)");
  const cardBorder = useColorModeValue("gray.200", "whiteAlpha.100");
  const headCol = useColorModeValue("gray.900", "white");
  const mutedCol = useColorModeValue("gray.500", "gray.400");
  const trackCol = useColorModeValue("gray.100", "whiteAlpha.100");

  const ringVal = metric._pct ?? 72;
  const ringScheme = metric.color?.startsWith("green") ? "green"
    : metric.color?.startsWith("red") ? "red"
      : metric.color?.startsWith("blue") ? "blue"
        : metric.color?.startsWith("orange") ? "orange" : "purple";

  return (
    <Card
      bg={cardBg}
      borderColor={cardBorder}
      borderWidth={1}
      shadow="none"
      backdropFilter="blur(12px)"
      _hover={{
        shadow: "0 20px 60px rgba(0,0,0,0.15)",
        transform: "translateY(-4px)",
        borderColor: `${ringScheme}.400`,
      }}
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      position="relative"
      overflow="hidden"
      borderRadius="2xl"
      sx={{ animation: `slide-up 0.5s ease-out both`, animationDelay: `${index * 0.08}s` }}
    >
      {/* Top accent line */}
      <Box h="3px" bgGradient={`linear(to-r, ${metric.color}, transparent)`} />

      {/* Decorative corner */}
      <Box
        position="absolute"
        top="-30px" right="-30px"
        w="100px" h="100px"
        borderRadius="full"
        bg={metric.color}
        opacity={0.04}
        filter="blur(20px)"
      />

      <CardBody p={5}>
        <Flex justify="space-between" align="flex-start">
          <VStack align="start" spacing={1.5} flex={1} mr={3}>
            <HStack spacing={2}>
              <Box p={1.5} borderRadius="lg" bg={useColorModeValue(`${ringScheme}.50`, `${ringScheme}.900`)}>
                <Icon as={MetricIcon} color={metric.color} boxSize={4} />
              </Box>
              <Text fontSize="xs" fontWeight="600" color={mutedCol} textTransform="uppercase" letterSpacing="wider">
                {metric.title}
              </Text>
            </HStack>
            <Heading size="lg" color={headCol} lineHeight={1.1} fontWeight="800">
              {metric.value}
            </Heading>
            <HStack spacing={2} mt={0.5}>
              <Badge
                colorScheme={ringScheme}
                variant="subtle"
                fontSize="9px"
                borderRadius="full"
                px={2.5}
                py={0.5}
              >
                {metric.status}
              </Badge>
              <Text fontSize="xs" color={mutedCol}>{metric.description}</Text>
            </HStack>
          </VStack>
          <CircularProgress
            value={ringVal}
            color={metric.color}
            size="64px"
            thickness="8px"
            trackColor={trackCol}
            capIsRound
          >
            <CircularProgressLabel fontSize="11px" fontWeight="bold" color={headCol}>
              {ringVal}%
            </CircularProgressLabel>
          </CircularProgress>
        </Flex>
        <Progress
          value={ringVal}
          colorScheme={ringScheme}
          size="xs"
          mt={4}
          borderRadius="full"
          bg={trackCol}
        />
      </CardBody>
    </Card>
  );
}

// ── Platform stat pill ────────────────────────────────────────────
function StatPill({ icon, label, value, color }: any) {
  const pillBg = useColorModeValue("white", "rgba(17, 17, 27, 0.6)");
  const pilBd = useColorModeValue("gray.200", "whiteAlpha.100");
  const headCol = useColorModeValue("gray.900", "white");
  const mutCol = useColorModeValue("gray.500", "gray.400");
  return (
    <Flex
      align="center" gap={3} px={5} py={3.5}
      bg={pillBg} borderWidth={1} borderColor={pilBd}
      borderRadius="2xl" backdropFilter="blur(12px)"
      _hover={{ shadow: "lg", transform: "translateY(-2px)", borderColor: `${color}.400` }}
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
    >
      <Box p={2} borderRadius="xl" bg={useColorModeValue(`${color}.50`, `${color}.900`)}>
        <Icon as={icon} color={`${color}.500`} boxSize={4} />
      </Box>
      <Box>
        <Text fontSize="xs" color={mutCol} fontWeight="500">{label}</Text>
        <Text fontSize="md" fontWeight="700" color={headCol}>{value}</Text>
      </Box>
    </Flex>
  );
}

// ── Migration Verdict ─────────────────────────────────────────────
function MigrationVerdict({ metrics, location }: { metrics: any[]; location: string }) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const cardBg = useColorModeValue("white", "rgba(17, 17, 27, 0.6)");
  const cardBd = useColorModeValue("gray.200", "whiteAlpha.100");
  const headCol = useColorModeValue("gray.900", "white");
  const mutedCol = useColorModeValue("gray.500", "gray.400");
  const trackCol = useColorModeValue("gray.100", "whiteAlpha.100");
  const rowHov = useColorModeValue("gray.50", "whiteAlpha.50");
  const strengthBg = useColorModeValue("green.50", "green.900");
  const strengthBd = useColorModeValue("green.200", "green.800");
  const concernBg = useColorModeValue("red.50", "red.900");
  const concernBd = useColorModeValue("red.200", "red.800");

  if (!metrics || metrics.length < 4) return null;

  const factors = [
    { key: "Air Quality", icon: Activity, pct: metrics[0]?._pct ?? 72, weight: 0.20, category: "Environment" },
    { key: "Water Quality", icon: Droplets, pct: metrics[1]?._pct ?? 72, weight: 0.15, category: "Environment" },
    { key: "Safety", icon: Shield, pct: metrics[3]?._pct ?? 72, weight: 0.25, category: "Safety" },
    { key: "Traffic", icon: Car, pct: metrics[2]?._pct ?? 72, weight: 0.15, category: "Mobility" },
    { key: "Medical Access", icon: Stethoscope, pct: metrics[4]?._pct ?? 88, weight: 0.15, category: "Healthcare" },
    { key: "Green Spaces", icon: Trees, pct: metrics[5]?._pct ?? 76, weight: 0.10, category: "Lifestyle" },
  ];

  const score = Math.round(factors.reduce((sum, f) => sum + f.pct * f.weight, 0));

  const verdict =
    score >= 75 ? { label: "Recommended", emoji: "✅", color: "green", icon: ThumbsUp, desc: "Strong scores across all key livability factors. A great choice for relocation." }
      : score >= 50 ? { label: "Moderate", emoji: "⚠️", color: "yellow", icon: Minus, desc: "Some factors meet expectations but there are areas of concern. Research further." }
        : { label: "Not Recommended", emoji: "❌", color: "red", icon: ThumbsDown, desc: "Multiple critical factors score poorly. This area may pose challenges." };

  const good = factors.filter(f => f.pct >= 70);
  const poor = factors.filter(f => f.pct < 50);

  return (
    <Card
      bg={cardBg}
      borderColor={cardBd}
      borderWidth={1}
      shadow="none"
      borderRadius="2xl"
      overflow="hidden"
      backdropFilter="blur(12px)"
      mt={6}
      sx={{ animation: "slide-up 0.6s ease-out both" }}
    >
      <Box h="3px" bgGradient={`linear(to-r, ${verdict.color}.400, ${verdict.color}.600, transparent)`} />

      <CardBody p={0}>
        <Flex direction={{ base: "column", md: "row" }} align={{ md: "stretch" }}>

          {/* LEFT: Score ring + verdict */}
          <Box
            px={6} py={6}
            borderRightWidth={{ md: 1 }} borderColor={cardBd}
            minW={{ md: "240px" }}
            display="flex" flexDir="column" justifyContent="center" alignItems="center"
            textAlign="center"
          >
            <HStack mb={2} spacing={2} justify="center">
              <Icon as={HomeIcon} boxSize={3.5} color={mutedCol} />
              <Text fontSize="xs" fontWeight="bold" color={mutedCol} textTransform="uppercase" letterSpacing="wider">
                Migration Verdict
              </Text>
            </HStack>
            <Text fontSize="xs" color={mutedCol} mb={3} isTruncated maxW="180px">{location}</Text>

            <CircularProgress
              value={score}
              color={`${verdict.color}.400`}
              trackColor={trackCol}
              size="120px"
              thickness="10px"
              capIsRound
            >
              <CircularProgressLabel>
                <VStack spacing={0}>
                  <Text fontSize="2xl" fontWeight="900" color={headCol} lineHeight={1}>{score}</Text>
                  <Text fontSize="8px" color={mutedCol} textTransform="uppercase" letterSpacing="wide">/ 100</Text>
                </VStack>
              </CircularProgressLabel>
            </CircularProgress>

            <HStack mt={3} spacing={2} justify="center">
              <Icon as={verdict.icon} color={`${verdict.color}.500`} boxSize={4} />
              <Badge
                colorScheme={verdict.color}
                variant="solid"
                borderRadius="full"
                px={3} py={1}
                fontSize="sm"
                fontWeight="bold"
              >
                {verdict.emoji} {verdict.label}
              </Badge>
            </HStack>
            <Text fontSize="xs" color={mutedCol} mt={2} maxW="180px" lineHeight="tall">
              {verdict.desc}
            </Text>
          </Box>

          {/* RIGHT: Factor breakdown */}
          <Box flex={1} px={6} py={6}>
            <Text fontSize="xs" fontWeight="bold" color={mutedCol} textTransform="uppercase" letterSpacing="wider" mb={3}>
              Factor Breakdown
            </Text>
            <VStack spacing={2.5} align="stretch">
              {factors.map((f) => {
                const fc = f.pct >= 70 ? "green" : f.pct >= 50 ? "yellow" : "red";
                const StatusIcon = f.pct >= 70 ? CheckCircle : f.pct >= 50 ? Minus : XCircle;
                return (
                  <Box
                    key={f.key}
                    px={3} py={2.5}
                    borderRadius="xl"
                    borderWidth={1}
                    borderColor={cardBd}
                    _hover={{ bg: rowHov }}
                    transition="background 0.2s"
                  >
                    <Flex align="center" gap={3}>
                      <Box p={1.5} borderRadius="lg" bg={isDark ? `${fc}.900` : `${fc}.50`} flexShrink={0}>
                        <Icon as={f.icon} color={`${fc}.500`} boxSize={3.5} />
                      </Box>
                      <Box flex={1} minW={0}>
                        <Flex justify="space-between" align="center" mb={1}>
                          <Text fontSize="xs" fontWeight="600" color={headCol}>{f.key}</Text>
                          <HStack spacing={1}>
                            <Icon as={StatusIcon} color={`${fc}.500`} boxSize={3} />
                            <Text fontSize="xs" fontWeight="bold" color={`${fc}.500`}>{f.pct}%</Text>
                          </HStack>
                        </Flex>
                        <Progress
                          value={f.pct}
                          colorScheme={fc}
                          size="xs"
                          borderRadius="full"
                          bg={trackCol}
                        />
                      </Box>
                    </Flex>
                  </Box>
                );
              })}
            </VStack>

            {/* Pros / Cons */}
            {(good.length > 0 || poor.length > 0) && (
              <SimpleGrid columns={2} spacing={3} mt={4}>
                {good.length > 0 && (
                  <Box bg={strengthBg} borderRadius="xl" p={3} borderWidth={1} borderColor={strengthBd}>
                    <Text fontSize="10px" fontWeight="bold" color="green.500" textTransform="uppercase" mb={1.5}>
                      👍 Strengths
                    </Text>
                    <VStack align="start" spacing={0.5}>
                      {good.map(f => (
                        <Text key={f.key} fontSize="xs" color={isDark ? "green.200" : "green.700"} opacity={0.9}>• {f.key}</Text>
                      ))}
                    </VStack>
                  </Box>
                )}
                {poor.length > 0 && (
                  <Box bg={concernBg} borderRadius="xl" p={3} borderWidth={1} borderColor={concernBd}>
                    <Text fontSize="10px" fontWeight="bold" color="red.500" textTransform="uppercase" mb={1.5}>
                      ⚠️ Concerns
                    </Text>
                    <VStack align="start" spacing={0.5}>
                      {poor.map(f => (
                        <Text key={f.key} fontSize="xs" color={isDark ? "red.200" : "red.700"} opacity={0.9}>• {f.key}</Text>
                      ))}
                    </VStack>
                  </Box>
                )}
              </SimpleGrid>
            )}

            <HStack mt={4} justify="flex-end">
              <Button
                as={Link}
                href="/analytics"
                size="sm"
                colorScheme={verdict.color}
                variant="outline"
                rightIcon={<Icon as={ArrowRight} boxSize={3} />}
                borderRadius="full"
                fontWeight="semibold"
              >
                See Full Analytics
              </Button>
            </HStack>
          </Box>
        </Flex>
      </CardBody>
    </Card>
  );
}

// ── Feature card ─────────────────────────────────────────────────
function FeatureCard({ icon, title, desc, href, accent, index }: any) {
  const cardBg = useColorModeValue("white", "rgba(17, 17, 27, 0.6)");
  const cardBd = useColorModeValue("gray.200", "whiteAlpha.100");
  const headCol = useColorModeValue("gray.900", "white");
  const mutCol = useColorModeValue("gray.500", "gray.400");

  return (
    <Link href={href}>
      <Card
        bg={cardBg}
        borderColor={cardBd}
        borderWidth={1}
        shadow="none"
        backdropFilter="blur(12px)"
        _hover={{
          shadow: "0 20px 60px rgba(0,0,0,0.15)",
          borderColor: `${accent}.400`,
          transform: "translateY(-4px)",
        }}
        transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        cursor="pointer"
        h="full"
        borderRadius="2xl"
        overflow="hidden"
        sx={{ animation: `slide-up 0.5s ease-out both`, animationDelay: `${index * 0.1}s` }}
      >
        {/* Top accent gradient line */}
        <Box h="3px" bgGradient={`linear(to-r, ${accent}.400, ${accent}.300, transparent)`} />
        <CardBody p={6}>
          <Box
            w={12} h={12} borderRadius="2xl"
            bgGradient={`linear(135deg, ${accent}.500, ${accent}.400)`}
            display="flex" alignItems="center" justifyContent="center"
            mb={4}
            shadow={`0 8px 24px ${accent === "blue" ? "rgba(66,153,225,0.25)" : accent === "purple" ? "rgba(128,90,213,0.25)" : accent === "green" ? "rgba(72,187,120,0.25)" : "rgba(237,100,166,0.25)"}`}
          >
            <Icon as={icon} color="white" boxSize={6} />
          </Box>
          <Heading size="sm" color={headCol} mb={2} fontWeight="700">{title}</Heading>
          <Text fontSize="sm" color={mutCol} lineHeight="tall">{desc}</Text>
          <HStack mt={4} color={`${accent}.500`} fontSize="xs" fontWeight="600" spacing={1.5}
            _groupHover={{ gap: 2 }}
          >
            <Text>Explore</Text>
            <Icon as={ArrowUpRight} boxSize={3.5} />
          </HStack>
        </CardBody>
      </Card>
    </Link>
  );
}

// ── Main Page ─────────────────────────────────────────────────────
export default function Home() {
  const { globalStats, setGlobalStats } = useIntelligence();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const toast = useToast();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  // Live clock
  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Theme tokens
  const pageBg = useColorModeValue("#f8fafc", "#050508");
  const heroBg = useColorModeValue("white", "rgba(10, 10, 18, 0.95)");
  const heroBorder = useColorModeValue("gray.200", "whiteAlpha.50");
  const headingCol = useColorModeValue("gray.900", "white");
  const mutedCol = useColorModeValue("gray.500", "gray.400");
  const inputBg = useColorModeValue("white", "rgba(17, 17, 27, 0.8)");
  const inputBorder = useColorModeValue("gray.200", "whiteAlpha.100");
  const sectionTitle = useColorModeValue("gray.800", "gray.200");
  const dividerCol = useColorModeValue("gray.200", "whiteAlpha.100");
  const tagBg = useColorModeValue("blue.50", "blue.900");
  const tagCol = useColorModeValue("blue.600", "blue.200");
  const subtleBg = useColorModeValue("gray.50", "rgba(17, 17, 27, 0.4)");

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
      const geoRes = await fetch(`${apiUrl}/api/geocode/search?q=${encodeURIComponent(searchQuery)}`);
      const geoData = await geoRes.json();
      if (geoData && geoData.length > 0) {
        const { lat, lon, display_name } = geoData[0];
        const city = display_name.split(",")[0];
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
        const probeRes = await fetch(`${apiUrl}/api/probe/analyze?lat=${lat}&lng=${lon}`);
        const data = await probeRes.json();
        const newMetrics = [
          {
            title: "Air Quality", value: `AQI ${data.environment.aqi.value}`,
            status: data.environment.aqi.status,
            description: data.environment.aqi.value > 100 ? "Needs attention" : "Healthy air",
            icon: "Activity", color: data.environment.aqi.value > 100 ? "red.500" : "green.500",
            _pct: Math.max(10, 100 - data.environment.aqi.value / 3),
          },
          {
            title: "Water Quality", value: data.environment.water.status,
            status: data.environment.water.value > 80 ? "Optimal" : "Check",
            description: `Index: ${data.environment.water.value}/100`,
            icon: "Droplets", color: data.environment.water.value > 80 ? "blue.500" : "orange.500",
            _pct: data.environment.water.value,
          },
          {
            title: "Traffic Load", value: data.traffic.status,
            status: `${data.traffic.congestion.toFixed(0)}% Load`,
            description: `Avg Speed: ${data.traffic.speed.toFixed(1)} km/h`,
            icon: "Car", color: data.traffic.congestion > 40 ? "red.500" : "green.500",
            _pct: Math.max(5, 100 - data.traffic.congestion),
          },
          {
            title: "Safety Index", value: data.safety.rating,
            status: data.safety.crime_rate,
            description: `Safety Score: ${data.safety.score}/100`,
            icon: "AlertTriangle", color: data.safety.score > 70 ? "green.500" : "red.500",
            _pct: data.safety.score,
          },
          {
            title: "Medical Access", value: `${data.nearby.hospitals} Hospitals`,
            status: "Available", description: "Emergency services accessible",
            icon: "Stethoscope", color: "purple.500", _pct: 88,
          },
          {
            title: "Green Spaces", value: `${data.nearby.parks} Parks`,
            status: "Active", description: "Open green areas nearby",
            icon: "Trees", color: "green.500", _pct: 76,
          },
        ];
        const locName = data.location?.address?.split(",")[0] || city;
        setGlobalStats({ location: locName, address: data.location?.address || display_name, metrics: newMetrics });
        toast({ title: `📍 ${locName} loaded`, status: "success", duration: 2500, isClosable: true });
      } else {
        toast({ title: "No results found", description: "Try a different location.", status: "warning", duration: 3000, isClosable: true });
      }
    } catch {
      toast({ title: "Search failed", description: "Please ensure the backend is running.", status: "error", duration: 5000, isClosable: true });
    } finally {
      setLoading(false);
    }
  };

  const hasData = globalStats.metrics.length > 0;

  const features = [
    { icon: Map, title: "City Map", desc: "Interactive real-time map with street-level intelligence, traffic overlays, and probe scanning.", href: "/map", accent: "blue" },
    { icon: BarChart2, title: "Analytics", desc: "Hybrid Ensemble ML analytics — AQI trends, crime heatmaps, regional comparisons & more.", href: "/analytics", accent: "purple" },
    { icon: Cpu, title: "AI Engine", desc: "95% accuracy Hybrid Ensemble model combining Random Forest, LSTM, XGBoost & Isolation Forest.", href: "/analytics", accent: "pink" },
    { icon: Globe, title: "Admin Panel", desc: "Configure sensors, manage data feeds, set alert thresholds and review audit logs.", href: "/admin", accent: "green" },
  ];

  return (
    <Box bg={pageBg} minH="100vh">

      {/* ── Hero Section ─────────────────────────────────────────── */}
      <Box
        position="relative"
        overflow="hidden"
        borderBottomWidth={1}
        borderColor={heroBorder}
      >
        {/* Animated background mesh */}
        <Box position="absolute" inset={0} overflow="hidden" pointerEvents="none">
          <GradientOrb size="400px" top="-100px" right="-50px" color1="blue.500" color2="purple.500" opacity={isDark ? 0.08 : 0.06} delay="0s" />
          <GradientOrb size="300px" bottom="-80px" left="10%" color1="purple.500" color2="pink.500" opacity={isDark ? 0.06 : 0.04} delay="2s" />
          <GradientOrb size="200px" top="20%" left="60%" color1="cyan.400" color2="blue.400" opacity={isDark ? 0.05 : 0.03} delay="4s" />

          {/* Grid pattern overlay */}
          <Box
            position="absolute" inset={0}
            opacity={isDark ? 0.03 : 0.015}
            backgroundImage="linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)"
            backgroundSize="60px 60px"
          />
        </Box>

        <Box
          bg={heroBg}
          backdropFilter="blur(20px)"
          px={{ base: 4, md: 8, lg: 12 }}
          pt={{ base: 8, md: 12, lg: 14 }}
          pb={{ base: 8, md: 12 }}
          position="relative"
        >
          <Flex direction={{ base: "column", lg: "row" }} align={{ lg: "center" }} justify="space-between" gap={10}>
            {/* Left: Branding & Search */}
            <VStack align="flex-start" spacing={6} flex={1} maxW={{ lg: "640px" }}>

              {/* Status tags */}
              <HStack spacing={3} flexWrap="wrap" sx={{ animation: "fade-in 0.8s ease-out" }}>
                <LiveBadge />
                <Tag size="sm" bg={tagBg} color={tagCol} borderRadius="full" px={3}>
                  <TagLeftIcon as={Clock} boxSize={3} />
                  <TagLabel fontSize="xs" minW="140px">
                    {mounted ? `${currentTime.toLocaleTimeString("en-IN", { hour12: true })} · ${currentTime.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}` : "Connecting..."}
                  </TagLabel>
                </Tag>
                <Tag size="sm" colorScheme="green" variant="subtle" borderRadius="full" px={3}>
                  <TagLeftIcon as={Wifi} boxSize={3} />
                  <TagLabel fontSize="xs">All Systems Operational</TagLabel>
                </Tag>
              </HStack>

              {/* Heading */}
              <Box sx={{ animation: "slide-up 0.6s ease-out" }}>
                <Heading
                  as="h1"
                  fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                  fontWeight="900"
                  letterSpacing="-0.04em"
                  lineHeight={1.05}
                  color={headingCol}
                >
                  {globalStats.location !== "City Overview" ? (
                    <>
                      <Box
                        as="span"
                        bgGradient="linear(135deg, blue.400, purple.500, pink.400)"
                        bgClip="text"
                        bgSize="200% auto"
                        sx={{ animation: "text-gradient 4s linear infinite" }}
                      >
                        {globalStats.location}
                      </Box>
                      <br />
                      <Box as="span" color={headingCol}>Dashboard</Box>
                    </>
                  ) : (
                    <>
                      <Box
                        as="span"
                        bgGradient="linear(135deg, blue.400, purple.500, pink.400)"
                        bgClip="text"
                        bgSize="200% auto"
                        sx={{ animation: "text-gradient 4s linear infinite" }}
                      >
                        Smart City
                      </Box>
                      <br />
                      <Box as="span" color={headingCol}>Intelligence</Box>
                    </>
                  )}
                </Heading>
                {globalStats.address && globalStats.address !== "General City Area" && (
                  <HStack color="purple.500" fontSize="sm" fontFamily="mono" mt={3} spacing={2}>
                    <Icon as={MapPin} boxSize={3.5} />
                    <Text isTruncated maxW="420px">{globalStats.address}</Text>
                  </HStack>
                )}
                <Text fontSize={{ base: "md", md: "lg" }} color={mutedCol} mt={3} maxW="480px" lineHeight="tall">
                  Real-time AI-powered urban intelligence for smarter, safer, and more efficient cities.
                </Text>
              </Box>

              {/* Search bar */}
              <Box w="full" maxW="540px" sx={{ animation: "slide-up 0.7s ease-out" }}>
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none" h="full" pl={1}>
                    <Icon as={Search} color={mutedCol} boxSize={5} />
                  </InputLeftElement>
                  <Input
                    placeholder="Search city, street, or district…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    bg={inputBg}
                    borderColor={inputBorder}
                    borderRadius="2xl"
                    h="56px"
                    backdropFilter="blur(12px)"
                    _focus={{
                      borderColor: "blue.400",
                      boxShadow: "0 0 0 3px rgba(66,153,225,0.15), 0 8px 30px rgba(0,0,0,0.1)",
                    }}
                    _placeholder={{ color: mutedCol }}
                    pr={loading ? "3.5rem" : "7.5rem"}
                    fontSize="md"
                  />
                  <InputRightElement w="auto" pr={1.5} h="full">
                    <Button
                      size="md"
                      colorScheme="blue"
                      borderRadius="xl"
                      onClick={handleSearch}
                      isLoading={loading}
                      loadingText="Scanning…"
                      px={6}
                      fontWeight="600"
                      shadow="md"
                      _hover={{ shadow: "lg", transform: "translateY(-1px)" }}
                      transition="all 0.2s"
                    >
                      <HStack spacing={2}>
                        <Icon as={Search} boxSize={4} />
                        <Text>Analyse</Text>
                      </HStack>
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </Box>

              {/* CTA buttons */}
              <HStack spacing={3} flexWrap="wrap" sx={{ animation: "slide-up 0.8s ease-out" }}>
                <Button
                  as={Link}
                  href="/map"
                  size="lg"
                  bgGradient="linear(135deg, blue.500, blue.600)"
                  color="white"
                  rightIcon={<ArrowRight size={18} />}
                  borderRadius="xl"
                  fontWeight="600"
                  h="48px"
                  px={7}
                  shadow="0 8px 24px rgba(66,153,225,0.3)"
                  _hover={{
                    bgGradient: "linear(135deg, blue.600, blue.700)",
                    shadow: "0 12px 36px rgba(66,153,225,0.4)",
                    transform: "translateY(-2px)",
                  }}
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                >
                  Open City Map
                </Button>
                <Button
                  as={Link}
                  href="/analytics"
                  size="lg"
                  variant="outline"
                  colorScheme="purple"
                  borderRadius="xl"
                  fontWeight="600"
                  h="48px"
                  px={7}
                  borderWidth={2}
                  _hover={{
                    bg: useColorModeValue("purple.50", "whiteAlpha.100"),
                    transform: "translateY(-2px)",
                    shadow: "lg",
                  }}
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                >
                  View Analytics
                </Button>
              </HStack>
            </VStack>

            {/* Right: KPI Grid */}
            <SimpleGrid columns={2} spacing={4} w={{ base: "full", lg: "340px" }} flexShrink={0}>
              <KPIBox icon={Cpu} label="Model Accuracy" value="95.0" suffix="%" color="purple" delay="0.2s" />
              <KPIBox icon={Database} label="Data Sources" value="3.4" suffix=" PB" color="blue" delay="0.3s" />
              <KPIBox icon={Zap} label="Avg Response" value="48" suffix=" ms" color="green" delay="0.4s" />
              <KPIBox
                icon={Shield}
                label="Safety Score"
                value={globalStats.metrics[3]?._pct ? `${globalStats.metrics[3]._pct}` : "97"}
                suffix="%"
                color="pink"
                delay="0.5s"
              />
            </SimpleGrid>
          </Flex>
        </Box>
      </Box>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <Box px={{ base: 4, md: 8, lg: 12 }} py={10}>
        <VStack align="stretch" spacing={12}>

          {/* ── Metric Cards ──────────────────────────────────────── */}
          {hasData ? (
            <Box>
              <Flex align="center" justify="space-between" mb={6}>
                <HStack spacing={3}>
                  <Box
                    p={2}
                    borderRadius="lg"
                    bgGradient="linear(135deg, blue.500, purple.500)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={Activity} color="white" boxSize={4} />
                  </Box>
                  <Box>
                    <Heading size="md" color={sectionTitle} letterSpacing="-0.02em" fontWeight="800">
                      Live City Metrics
                    </Heading>
                    <Text fontSize="xs" color={mutedCol} mt={0.5}>Real-time environmental & urban data</Text>
                  </Box>
                  <LiveBadge />
                </HStack>
                <HStack spacing={2}>
                  <Badge colorScheme="blue" variant="subtle" borderRadius="full" px={3} py={1}>
                    📍 {globalStats.location}
                  </Badge>
                  <Tag size="sm" colorScheme="green" variant="subtle" borderRadius="full">
                    <TagLeftIcon as={CheckCircle} boxSize={3} />
                    <TagLabel fontSize="xs">Updated now</TagLabel>
                  </Tag>
                </HStack>
              </Flex>
              <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={5}>
                {globalStats.metrics.map((metric: any, idx: number) => (
                  <MetricCard key={idx} metric={metric} index={idx} />
                ))}
              </SimpleGrid>

              {/* Migration Verdict */}
              <MigrationVerdict metrics={globalStats.metrics} location={globalStats.location} />
            </Box>
          ) : (
            /* Empty state — before search */
            <Box
              borderWidth={1}
              borderStyle="dashed"
              borderColor={dividerCol}
              borderRadius="2xl"
              p={{ base: 10, md: 14 }}
              textAlign="center"
              bg={subtleBg}
              backdropFilter="blur(8px)"
              sx={{ animation: "fade-in 0.8s ease-out" }}
            >
              <Box
                w={16} h={16}
                borderRadius="2xl"
                bgGradient="linear(135deg, blue.400, purple.500)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mx="auto"
                mb={5}
                shadow="0 8px 24px rgba(99,102,241,0.25)"
                sx={{ animation: "float 4s ease-in-out infinite" }}
              >
                <Icon as={MapPin} boxSize={7} color="white" />
              </Box>
              <Heading size="md" color={headingCol} mb={2} fontWeight="700">No location selected</Heading>
              <Text color={mutedCol} fontSize="sm" maxW="360px" mx="auto" lineHeight="tall">
                Search for a city, street, or district above to load real-time intelligence data and urban analytics for that area.
              </Text>
            </Box>
          )}

          <Divider borderColor={dividerCol} />

          {/* ── Platform Features ────────────────────────────────── */}
          <Box>
            <Flex align="center" justify="space-between" mb={6}>
              <HStack spacing={3}>
                <Box
                  p={2}
                  borderRadius="lg"
                  bgGradient="linear(135deg, purple.500, pink.500)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={Layers} color="white" boxSize={4} />
                </Box>
                <Box>
                  <Heading size="md" color={sectionTitle} letterSpacing="-0.02em" fontWeight="800">
                    Platform Modules
                  </Heading>
                  <Text fontSize="xs" color={mutedCol} mt={0.5}>Everything you need in one place</Text>
                </Box>
              </HStack>
            </Flex>
            <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={5}>
              {features.map((f, i) => (
                <FeatureCard key={f.href + f.title} {...f} index={i} />
              ))}
            </SimpleGrid>
          </Box>

          <Divider borderColor={dividerCol} />

          {/* ── Platform Stats Footer ───────────────────────────── */}
          <Box>
            <HStack spacing={3} mb={6}>
              <Box
                p={2}
                borderRadius="lg"
                bgGradient="linear(135deg, green.500, teal.500)"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={BarChart2} color="white" boxSize={4} />
              </Box>
              <Box>
                <Heading size="md" color={sectionTitle} letterSpacing="-0.02em" fontWeight="800">
                  Platform Performance
                </Heading>
                <Text fontSize="xs" color={mutedCol} mt={0.5}>Infrastructure metrics & system health</Text>
              </Box>
            </HStack>
            <SimpleGrid columns={{ base: 2, sm: 3, md: 6 }} spacing={4}>
              {[
                { icon: Zap, label: "TTFB", value: "48 ms", color: "yellow" },
                { icon: Globe, label: "Bundle Size", value: "1.2 MB", color: "blue" },
                { icon: Activity, label: "Lighthouse", value: "98 / 100", color: "green" },
                { icon: Cpu, label: "ML Accuracy", value: "95.0%", color: "purple" },
                { icon: Shield, label: "Uptime", value: "99.98%", color: "teal" },
                { icon: BarChart2, label: "Sensors", value: "12,400+", color: "pink" },
              ].map((s) => (
                <StatPill key={s.label} {...s} />
              ))}
            </SimpleGrid>
          </Box>

        </VStack>
      </Box>
    </Box>
  );
}
