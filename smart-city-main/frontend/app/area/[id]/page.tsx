"use client";

import {
  Box,
  Button,
  Card,
  CardHeader,
  CardBody,
  Flex,
  Heading,
  Text,
  Badge,
  Progress,
  SimpleGrid,
  VStack,
  HStack,
  Icon,
} from "@chakra-ui/react";
import {
  ArrowLeft,
  ShieldCheck,
  Zap,
  Leaf as LeafIcon,
  Wind,
  Droplets,
  Thermometer,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

function Leaf(props: any) {
  return <LeafIcon {...props} />;
}

export default function AreaDetailsPage() {
  const params = useParams();
  const areaName = "Downtown District"; // Would come from ID fetch
  const overallScore = 78;

  return (
    <VStack align="stretch" spacing={8} w="full" className="animate-in fade-in duration-500">
      <Flex align="center" gap={4}>
        <Button as={Link} href="/map" variant="outline" size="sm" p={2}>
          <Icon as={ArrowLeft} boxSize={4} />
        </Button>
        <Box flex="1">
          <Heading size="lg" letterSpacing="tight">
            {areaName}
          </Heading>
          <Text color="gray.500">Area ID: {params.id}</Text>
        </Box>
        <Badge
          colorScheme={overallScore > 70 ? "green" : "red"}
          fontSize="md"
          px={4}
          py={1}
          borderRadius="md"
        >
          {overallScore > 70 ? "Safe" : "Attention Needed"}
        </Badge>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <Card variant="outline" gridColumn={{ md: "span 2" }}>
          <CardHeader pb={2}>
            <Heading size="md">Overall Livability Score</Heading>
            <Text fontSize="sm" color="gray.500" mt={1}>
              Composite metric based on environment, safety, and infrastructure.
            </Text>
          </CardHeader>
          <CardBody pt={2}>
            <HStack spacing={4}>
              <Progress value={overallScore} w="full" colorScheme="blue" borderRadius="md" size="sm" />
              <Text fontSize="2xl" fontWeight="bold">
                {overallScore}/100
              </Text>
            </HStack>
          </CardBody>
        </Card>

        {/* Environment Section */}
        <Card variant="outline">
          <CardHeader pb={2}>
            <HStack>
              <Icon as={LeafIcon} color="green.500" boxSize={5} />
              <Heading size="sm">Environmental Health</Heading>
            </HStack>
          </CardHeader>
          <CardBody pt={2}>
            <VStack align="stretch" spacing={4}>
              <Flex align="center" justify="space-between">
                <HStack spacing={2} color="gray.600">
                  <Icon as={Wind} boxSize={4} />
                  <Text fontSize="sm">Air Quality (AQI)</Text>
                </HStack>
                <Badge bg="yellow.50" color="yellow.700" borderColor="yellow.200" borderWidth={1}>
                  Moderate (85)
                </Badge>
              </Flex>
              <Flex align="center" justify="space-between">
                <HStack spacing={2} color="gray.600">
                  <Icon as={Droplets} boxSize={4} />
                  <Text fontSize="sm">Water Quality</Text>
                </HStack>
                <Badge bg="green.50" color="green.700" borderColor="green.200" borderWidth={1}>
                  Good (92)
                </Badge>
              </Flex>
              <Flex align="center" justify="space-between">
                <HStack spacing={2} color="gray.600">
                  <Icon as={LeafIcon} boxSize={4} />
                  <Text fontSize="sm">Green Cover</Text>
                </HStack>
                <Text fontWeight="semibold" fontSize="sm">
                  32%
                </Text>
              </Flex>
              <Flex align="center" justify="space-between">
                <HStack spacing={2} color="gray.600">
                  <Icon as={Thermometer} boxSize={4} />
                  <Text fontSize="sm">Avg Temp</Text>
                </HStack>
                <Text fontWeight="semibold" fontSize="sm">
                  24°C
                </Text>
              </Flex>
            </VStack>
          </CardBody>
        </Card>

        {/* Safety Section */}
        <Card variant="outline">
          <CardHeader pb={2}>
            <HStack>
              <Icon as={ShieldCheck} color="blue.500" boxSize={5} />
              <Heading size="sm">Safety & Security</Heading>
            </HStack>
          </CardHeader>
          <CardBody pt={2}>
            <VStack align="stretch" spacing={4}>
              <Flex align="center" justify="space-between">
                <Text fontSize="sm">Crime Rate</Text>
                <Badge colorScheme="gray">Low</Badge>
              </Flex>
              <Box>
                <Flex align="center" justify="space-between" mb={1}>
                  <Text fontSize="sm">Police Response Time</Text>
                  <Text fontSize="sm" fontWeight="medium">
                    5 min
                  </Text>
                </Flex>
                <Progress value={85} size="xs" colorScheme="blue" borderRadius="md" />
              </Box>
              <Box>
                <Flex align="center" justify="space-between" mb={1}>
                  <Text fontSize="sm">Fire Safety Coverage</Text>
                  <Text fontSize="sm" fontWeight="medium">
                    98%
                  </Text>
                </Flex>
                <Progress value={98} size="xs" colorScheme="blue" borderRadius="md" />
              </Box>
            </VStack>
          </CardBody>
        </Card>

        {/* AI Recommendations */}
        <Card variant="outline" gridColumn={{ md: "span 2" }} borderColor="blue.200" bg="blue.50">
          <CardHeader>
            <HStack color="blue.600">
              <Icon as={Zap} boxSize={5} />
              <Heading size="sm">AI-Driven Recommendations</Heading>
            </HStack>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <Card variant="elevated" bg="white" shadow="sm" borderLeftWidth={4} borderLeftColor="yellow.400">
                <CardHeader pb={2}>
                  <Heading size="xs" fontWeight="medium">
                    Traffic Optimization
                  </Heading>
                </CardHeader>
                <CardBody pt={0}>
                  <Text fontSize="sm" color="gray.500">
                    Adjust traffic light timings at 5th & Main during rush hour to reduce congestion by 15%.
                  </Text>
                </CardBody>
              </Card>

              <Card variant="elevated" bg="white" shadow="sm" borderLeftWidth={4} borderLeftColor="green.400">
                <CardHeader pb={2}>
                  <Heading size="xs" fontWeight="medium">
                    Green Space Expansion
                  </Heading>
                </CardHeader>
                <CardBody pt={0}>
                  <Text fontSize="sm" color="gray.500">
                    Potential zone for new vertical garden identified at Block C to improve micro-climate.
                  </Text>
                </CardBody>
              </Card>

              <Card variant="elevated" bg="white" shadow="sm" borderLeftWidth={4} borderLeftColor="blue.400">
                <CardHeader pb={2}>
                  <Heading size="xs" fontWeight="medium">
                    Water Conservation
                  </Heading>
                </CardHeader>
                <CardBody pt={0}>
                  <Text fontSize="sm" color="gray.500">
                    Detected localized pressure drop. Check for leaks in Sector 4 distribution network.
                  </Text>
                </CardBody>
              </Card>
            </SimpleGrid>
          </CardBody>
        </Card>
      </SimpleGrid>
    </VStack>
  );
}
