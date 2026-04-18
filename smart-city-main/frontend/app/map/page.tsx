"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  Flex,
  Input,
  IconButton,
  Card,
  useToast,
  HStack,
  Spinner,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { Search, Loader2 } from "lucide-react";
import { useIntelligence } from "@/components/providers/IntelligenceContext";

// @ts-ignore
import { useDebouncedCallback } from "use-debounce";
import IntelligenceSidebar from "@/components/map/IntelligenceSidebar";

// Dynamically import Map to avoid SSR issues
const CityMap = dynamic(() => import("@/components/map/CityMap"), {
  ssr: false,
  loading: () => (
    <Flex h="full" w="full" align="center" justify="center" bg="gray.100">
      <Spinner size="xl" color="blue.500" />
    </Flex>
  ),
});

export default function MapPage() {
  const { setGlobalStats } = useIntelligence();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  // Theme-aware colours
  const pageBg = useColorModeValue("gray.50", "black");
  const sideBg = useColorModeValue("white", "black");
  const borderColor = useColorModeValue("gray.200", "gray.800");
  const cardBg = useColorModeValue("whiteAlpha.900", "blackAlpha.800");
  const cardBorder = useColorModeValue("gray.200", "whiteAlpha.300");
  const inputColor = useColorModeValue("gray.800", "white");
  const inputPlaceholder = useColorModeValue("gray.500", "gray.400");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<[number, number] | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const [places, setPlaces] = useState([]);
  const [trafficData, setTrafficData] = useState([]);

  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [currentBBox, setCurrentBBox] = useState<any>(null);

  const [showTraffic, setShowTraffic] = useState(true);
  const [showPlaces, setShowPlaces] = useState(true);

  useEffect(() => {
    if (!searchResult) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            setSearchResult([latitude, longitude]);
            handleProbeUpdate(latitude, longitude);
          },
          (err) => {
            console.warn("Geolocation failed", err);
            handleProbeUpdate(28.6139, 77.209);
          }
        );
      } else {
        handleProbeUpdate(28.6139, 77.209);
      }
    }
  }, []);

  const fetchMapData = useDebouncedCallback(async (bounds: any) => {
    if (!bounds) return;

    const min_lat = bounds.getSouth();
    const max_lat = bounds.getNorth();
    const min_lng = bounds.getWest();
    const max_lng = bounds.getEast();

    setSummaryLoading(true);
    setCurrentBBox({ min_lat, max_lat, min_lng, max_lng });

    try {
      const params = `min_lat=${min_lat}&max_lat=${max_lat}&min_lng=${min_lng}&max_lng=${max_lng}`;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
      const [trafficRes, summaryRes] = await Promise.all([
        fetch(`${apiUrl}/api/data/traffic?${params}`),
        fetch(`${apiUrl}/api/analytics/summary?${params}`),
      ]);

      if (trafficRes.ok) {
        const data = await trafficRes.json();
        setTrafficData(data.features || []);
      }
    } catch (e) {
      console.error("Failed to fetch map data", e);
    } finally {
      setSummaryLoading(false);
    }
  }, 800);

  const handleSearch = async () => {
    if (!searchQuery) return;
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
      const res = await fetch(
        `${apiUrl}/api/geocode/search?q=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setSearchResult([parseFloat(lat), parseFloat(lon)]);
      } else {
        toast({
          title: "Not found",
          status: "warning",
          duration: 2000,
        });
      }
    } catch (e) {
      console.error("Search failed", e);
    } finally {
      setLoading(false);
    }
  };

  const [history, setHistory] = useState<any[]>([]);

  const handleProbeUpdate = async (lat: number, lng: number) => {
    setSummaryLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
      const res = await fetch(
        `${apiUrl}/api/probe/analyze?lat=${lat}&lng=${lng}`
      );
      if (res.ok) {
        const data = await res.json();
        setSummary(data);

        const newMetrics = [
          {
            title: "Air Pollution",
            value: `AQI ${data.environment.aqi.value}`,
            status: data.environment.aqi.status,
            description:
              data.environment.aqi.status === "Good"
                ? "Air quality is healthy."
                : "Air quality is poor.",
            icon: "Activity",
            color: data.environment.aqi.value > 100 ? "red.500" : "green.500",
          },
          {
            title: "Water Quality",
            value: data.environment.water.status,
            status: data.environment.water.value > 80 ? "Optimal" : "Check",
            description: `Index: ${data.environment.water.value}/100.`,
            icon: "Droplets",
            color: data.environment.water.value > 80 ? "blue.500" : "orange.500",
          },
          {
            title: "Traffic Congestion",
            value: data.traffic.status,
            status: `${data.traffic.congestion.toFixed(0)}% Load`,
            description: `Avg Speed: ${data.traffic.speed.toFixed(1)} km/h.`,
            icon: "Car",
            color: data.traffic.congestion > 40 ? "red.500" : "green.500",
          },
          {
            title: "Crime Rate",
            value: data.safety.rating,
            status: data.safety.crime_rate,
            description: `Safety Score: ${data.safety.score}/100.`,
            icon: "AlertTriangle",
            color: data.safety.score > 70 ? "green.500" : "red.500",
          },
          {
            title: "Medical Facilities",
            value: `${data.nearby.hospitals} Nearby`,
            status: "Avail",
            description: "Emergency services accessible.",
            icon: "Stethoscope",
            color: "green.500",
          },
          {
            title: "Parks & Open Land",
            value: `${data.nearby.parks}`,
            status: "Active",
            description: "Green spaces in vicinity.",
            icon: "Trees",
            color: "green.600",
          },
        ];

        const locName =
          data.location?.address?.split(",")[0] || `Lat ${lat.toFixed(2)}`;
        setGlobalStats({
          location: locName,
          address: data.location?.address || "Unknown Address",
          metrics: newMetrics,
        });

        setHistory((prev) => {
          const newEntry = data;
          return [newEntry, ...prev].slice(0, 10);
        });
      }
    } catch (e) {
      console.error("Probe fetch failed", e);
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleHistorySelect = (item: any) => {
    setSummary(item);
    setSearchResult([item.location.lat, item.location.lng]);
    handleProbeUpdate(item.location.lat, item.location.lng);
  };

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      h="calc(100vh - 3.5rem)"
      w="full"
      overflow="hidden"
      bg={pageBg}
    >
      <Box flex={1} position="relative" borderRightWidth={1} borderColor={borderColor}>
        <CityMap
          flyToPosition={searchResult}
          places={places}
          trafficData={trafficData}
          showPlaces={showPlaces}
          showTraffic={showTraffic}
          onBoundsChange={fetchMapData}
          onProbeUpdate={handleProbeUpdate}
          isDark={isDark}
          selectedLocation={
            summary?.location
              ? {
                lat: summary.location.lat,
                lng: summary.location.lng,
                address: summary.location.address,
              }
              : null
          }
        />

        <Box
          position="absolute"
          top={6}
          left="50%"
          transform="translateX(-50%)"
          zIndex={2000}
          w="full"
          maxW="md"
          pointerEvents="auto"
        >
          <Card
            p={2}
            direction="row"
            align="center"
            bg={cardBg}
            backdropFilter="blur(16px)"
            borderColor={cardBorder}
            borderWidth={1}
            borderRadius="full"
            shadow="2xl"
          >
            <Input
              placeholder="Search location (e.g., 'Chennai')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              variant="unstyled"
              px={4}
              color={inputColor}
              _placeholder={{ color: inputPlaceholder }}
            />
            <IconButton
              aria-label="Search"
              icon={loading ? <Loader2 /> : <Search size={18} />}
              onClick={handleSearch}
              isLoading={loading}
              variant="ghost"
              colorScheme={isDark ? "whiteAlpha" : "gray"}
              color={inputColor}
              rounded="full"
            />
            <IconButton
              aria-label="Use Current Location"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
              }
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition((pos) => {
                    const { latitude, longitude } = pos.coords;
                    setSearchResult([latitude, longitude]);
                    handleProbeUpdate(latitude, longitude);
                  });
                }
              }}
              variant="ghost"
              colorScheme="blue"
              rounded="full"
            />
          </Card>
        </Box>
      </Box>

      <Box
        w={{ base: "full", md: "md" }}
        h={{ base: "40%", md: "full" }}
        position="relative"
        zIndex={20}
        flexShrink={0}
        borderTopWidth={{ base: 1, md: 0 }}
        borderLeftWidth={{ base: 0, md: 1 }}
        borderColor={borderColor}
        bg={sideBg}
      >
        <IntelligenceSidebar
          data={summary}
          loading={summaryLoading}
          history={history}
          onSelectHistory={handleHistorySelect}
        />
      </Box>
    </Flex>
  );
}
