"use client";

import { useState, useEffect } from "react";
import {
    Box,
    Button,
    Card,
    CardHeader,
    CardBody,
    Flex,
    Heading,
    Text,
    Input,
    Badge,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Avatar,
    AvatarGroup,
    VStack,
    HStack,
    Select,
    SimpleGrid,
    Icon,
    useColorModeValue,
} from "@chakra-ui/react";
import {
    Upload,
    Database,
    CheckCircle2,
    AlertCircle,
    RefreshCw,
    Activity,
    Users,
    Search,
    Calendar,
    Filter,
    FileText,
    Lock,
} from "lucide-react";



const generateLogs = () => {
    const logs = [];
    const actions = [
        "System Startup",
        "Data Ingestion",
        "Model Retraining",
        "API Request",
        "Database Backup",
        "User Login",
        "Alert Triggered",
    ];
    const levels = ["INFO", "SUCCESS", "WARNING", "ERROR"];
    const modules = ["Core", "Auth", "TrafficAI", "EnvironmentSensors", "Database", "API Gateway"];

    for (let i = 0; i < 50; i++) {
        const date = new Date();
        date.setHours(date.getHours() - i);
        logs.push({
            id: `LOG-${1000 + i}`,
            timestamp: date.toISOString(),
            level: levels[Math.floor(Math.random() * levels.length)],
            module: modules[Math.floor(Math.random() * modules.length)],
            message: `${actions[Math.floor(Math.random() * actions.length)]} - ${Math.random() > 0.5 ? "Operation completed successfully" : "Latency observed"
                }`,
        });
    }
    return logs;
};

const generateLogins = () => {
    const logins = [];
    const users = [
        { name: "Admin User", email: "admin@smartcity.gov", role: "Super Admin", img: "/avatars/01.png" },
        { name: "John Doe", email: "john.d@smartcity.gov", role: "Analyst", img: "/avatars/02.png" },
        { name: "Sarah Connor", email: "sarah.c@smartcity.gov", role: "Viewer", img: "/avatars/03.png" },
    ];
    const status = ["Success", "Success", "Failed", "Success"];

    for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(Math.random() * 24);
        const user = users[Math.floor(Math.random() * users.length)];
        logins.push({
            id: `AUTH-${5000 + i}`,
            timestamp: date.toISOString(),
            user: user,
            ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
            status: status[Math.floor(Math.random() * status.length)],
            location: "Chennai, India",
        });
    }
    return logins;
};

const MOCK_LOGS = generateLogs();
const MOCK_LOGINS = generateLogins();

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<"overview" | "logs" | "logins">("overview");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterLevel, setFilterLevel] = useState("ALL");
    const [dateStart, setDateStart] = useState("");



    const filteredLogs = MOCK_LOGS.filter((log) => {
        const matchesSearch =
            log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.module.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLevel = filterLevel === "ALL" || log.level === filterLevel;
        const matchesDate = !dateStart || new Date(log.timestamp) >= new Date(dateStart);
        return matchesSearch && matchesLevel && matchesDate;
    });

    const filteredLogins = MOCK_LOGINS.filter((login) => {
        const matchesSearch =
            login.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            login.user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDate = !dateStart || new Date(login.timestamp) >= new Date(dateStart);
        return matchesSearch && matchesDate;
    });

    const bg = useColorModeValue("white", "black");
    const color = useColorModeValue("gray.800", "white");
    const mutedColor = useColorModeValue("gray.500", "gray.400");
    const cardBg = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
    const tabBg = useColorModeValue("gray.100", "gray.800");
    const activeTabBg = useColorModeValue("white", "gray.700");
    const inputBg = useColorModeValue("white", "whiteAlpha.200");

    return (
        <VStack align="stretch" spacing={8} w="full" p={{ base: 4, md: 8 }} minH="100vh" bg={bg} color={color}>
            <Flex direction={{ base: "column", md: "row" }} align={{ md: "center" }} justify="space-between" gap={4}>
                <Box>
                    <Heading size="lg" letterSpacing="tight">
                        Admin Dashboard
                    </Heading>
                    <Text color={mutedColor}>System configuration, logs, and audit trails.</Text>
                </Box>
                <Flex bg={tabBg} p={1} borderRadius="lg" borderColor={borderColor} borderWidth={1}>
                    {[
                        { id: "overview", label: "Overview", icon: Activity },
                        { id: "logs", label: "System Logs", icon: FileText },
                        { id: "logins", label: "Login History", icon: Lock },
                    ].map((tab) => (
                        <Button
                            key={tab.id}
                            variant={activeTab === tab.id ? "solid" : "ghost"}
                            bg={activeTab === tab.id ? activeTabBg : "transparent"}
                            color={activeTab === tab.id ? color : mutedColor}
                            _hover={{ color: "white", bg: activeTabBg }}
                            shadow={activeTab === tab.id ? "sm" : "none"}
                            onClick={() => setActiveTab(tab.id as any)}
                            size="sm"
                            leftIcon={<Icon as={tab.icon} boxSize={4} />}
                        >
                            {tab.label}
                        </Button>
                    ))}
                </Flex>
            </Flex>

            {activeTab === "overview" && (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>

                    <Card variant="outline" bg={cardBg} borderColor={borderColor}>
                        <CardHeader pb={2}>
                            <HStack>
                                <Icon as={Database} boxSize={5} />
                                <Heading size="sm">System Status</Heading>
                            </HStack>
                            <Text fontSize="sm" color={mutedColor} mt={1}>
                                Real-time pipeline monitoring.
                            </Text>
                        </CardHeader>
                        <CardBody pt={2}>
                            <VStack align="stretch" spacing={3}>
                                <Flex align="center" justify="space-between" p={3} borderWidth={1} borderRadius="md" borderColor="whiteAlpha.200">
                                    <HStack spacing={3}>
                                        <Icon as={CheckCircle2} color="green.500" />
                                        <Text fontWeight="medium">Data Pipeline</Text>
                                    </HStack>
                                    <Badge colorScheme="green" variant="outline" bg={cardBg} borderColor={borderColor}>
                                        Operational
                                    </Badge>
                                </Flex>
                                <Flex align="center" justify="space-between" p={3} borderWidth={1} borderRadius="md" borderColor="whiteAlpha.200">
                                    <HStack spacing={3}>
                                        <Icon as={RefreshCw} color="blue.500" className="animate-spin" />
                                        <Text fontWeight="medium">Model Retraining</Text>
                                    </HStack>
                                    <Badge colorScheme="blue">Processing (84%)</Badge>
                                </Flex>
                                <Flex align="center" justify="space-between" p={3} borderWidth={1} borderRadius="md" borderColor="whiteAlpha.200">
                                    <HStack spacing={3}>
                                        <Icon as={AlertCircle} color="none" fill="yellow.500" stroke="white" />
                                        <Text fontWeight="medium">API Latency</Text>
                                    </HStack>
                                    <Text fontSize="sm" fontFamily="mono" color={mutedColor}>
                                        124ms
                                    </Text>
                                </Flex>
                            </VStack>
                        </CardBody>
                    </Card>

                    <Card variant="outline" bg={cardBg} borderColor={borderColor}>
                        <CardHeader pb={2}>
                            <HStack>
                                <Icon as={Upload} boxSize={5} />
                                <Heading size="sm">Data Ingestion</Heading>
                            </HStack>
                            <Text fontSize="sm" color={mutedColor} mt={1}>
                                Upload new sensor data sets (CSV/JSON).
                            </Text>
                        </CardHeader>
                        <CardBody pt={2}>
                            <VStack align="stretch" spacing={4}>
                                <Box>
                                    <Text fontSize="sm" fontWeight="medium" mb={1}>
                                        Dataset File
                                    </Text>
                                    <Input type="file" cursor="pointer" p={1} />
                                </Box>
                                <Button leftIcon={<Icon as={Upload} boxSize={4} />} w={{ base: "full", sm: "auto" }} alignSelf="flex-start">
                                    Upload Dataset
                                </Button>
                            </VStack>
                        </CardBody>
                    </Card>

                    <Card variant="outline" bg={cardBg} borderColor={borderColor} gridColumn={{ lg: "span 3" }}>
                        <CardHeader pb={2}>
                            <HStack>
                                <Icon as={Users} boxSize={5} />
                                <Heading size="sm">Active Personnel</Heading>
                            </HStack>
                        </CardHeader>
                        <CardBody pt={2}>
                            <HStack spacing={6}>
                                <AvatarGroup size="md" max={4}>
                                    <Avatar name="Admin User" src="/avatars/01.png" />
                                    <Avatar name="John Doe" src="/avatars/02.png" />
                                    <Avatar name="Sarah Connor" src="/avatars/03.png" />
                                    <Avatar />
                                    <Avatar />
                                </AvatarGroup>
                                <Text fontSize="sm" color={mutedColor}>
                                    <Text as="span" fontWeight="bold" color={color}>
                                        8 users
                                    </Text>{" "}
                                    currently active in the dashboard.
                                </Text>
                            </HStack>
                        </CardBody>
                    </Card>
                </SimpleGrid>
            )}

            {activeTab === "logs" && (
                <Card variant="outline" bg={cardBg} borderColor={borderColor}>
                    <CardHeader>
                        <Flex justify="space-between" align="center">
                            <Box>
                                <Heading size="md">System Logs</Heading>
                                <Text fontSize="sm" color={mutedColor} mt={1}>
                                    Comprehensive event log for debugging and audit.
                                </Text>
                            </Box>
                            <Button size="sm" variant="outline" bg={cardBg} borderColor={borderColor} leftIcon={<DownloadIcon />}>
                                Export CSV
                            </Button>
                        </Flex>
                    </CardHeader>
                    <CardBody>
                        <Flex wrap="wrap" gap={4} mb={6}>
                            <HStack bg={inputBg} p={1} borderRadius="md" flex={1} maxW="sm">
                                <Icon as={Search} boxSize={4} ml={2} color={mutedColor} />
                                <Input
                                    variant="unstyled"
                                    placeholder="Search logs..."
                                    px={2}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </HStack>
                            <HStack>
                                <Icon as={Filter} boxSize={4} color={mutedColor} />
                                <Select w="auto" size="sm" value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)}>
                                    <option value="ALL">All Levels</option>
                                    <option value="INFO">Info</option>
                                    <option value="WARNING">Warning</option>
                                    <option value="ERROR">Error</option>
                                    <option value="SUCCESS">Success</option>
                                </Select>
                            </HStack>
                            <HStack>
                                <Icon as={Calendar} boxSize={4} color={mutedColor} />
                                <Input type="date" w="auto" size="sm" value={dateStart} onChange={(e) => setDateStart(e.target.value)} />
                            </HStack>
                        </Flex>

                        <Box borderWidth={1} borderRadius="md" overflowX="auto">
                            <TableContainer>
                                <Table size="sm" variant="simple">
                                    <Thead bg="gray.50">
                                        <Tr>
                                            <Th w="180px">Timestamp</Th>
                                            <Th w="100px">Level</Th>
                                            <Th>Module</Th>
                                            <Th>Message</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {filteredLogs.map((log) => (
                                            <Tr key={log.id}>
                                                <Td fontFamily="mono" fontSize="xs" color={mutedColor}>
                                                    {new Date(log.timestamp).toLocaleString()}
                                                </Td>
                                                <Td>
                                                    <Badge
                                                        variant="outline" bg={cardBg} borderColor={borderColor}
                                                        colorScheme={
                                                            log.level === "ERROR"
                                                                ? "red"
                                                                : log.level === "WARNING"
                                                                    ? "yellow"
                                                                    : log.level === "SUCCESS"
                                                                        ? "green"
                                                                        : "gray"
                                                        }
                                                    >
                                                        {log.level}
                                                    </Badge>
                                                </Td>
                                                <Td fontSize="xs" fontWeight="medium">
                                                    {log.module}
                                                </Td>
                                                <Td fontSize="sm">{log.message}</Td>
                                            </Tr>
                                        ))}
                                        {filteredLogs.length === 0 && (
                                            <Tr>
                                                <Td colSpan={4} textAlign="center" py={8}>
                                                    No logs found.
                                                </Td>
                                            </Tr>
                                        )}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </CardBody>
                </Card>
            )}

            {activeTab === "logins" && (
                <Card variant="outline" bg={cardBg} borderColor={borderColor}>
                    <CardHeader>
                        <Heading size="md">Login Audit</Heading>
                        <Text fontSize="sm" color={mutedColor} mt={1}>
                            Authentication history and access tracking.
                        </Text>
                    </CardHeader>
                    <CardBody>
                        <Flex wrap="wrap" gap={4} mb={6}>
                            <HStack bg={inputBg} p={1} borderRadius="md" flex={1} maxW="sm">
                                <Icon as={Search} boxSize={4} ml={2} color={mutedColor} />
                                <Input
                                    variant="unstyled"
                                    placeholder="Search user..."
                                    px={2}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </HStack>
                            <HStack>
                                <Icon as={Calendar} boxSize={4} color={mutedColor} />
                                <Input type="date" w="auto" size="sm" value={dateStart} onChange={(e) => setDateStart(e.target.value)} />
                            </HStack>
                        </Flex>

                        <Box borderWidth={1} borderRadius="md" overflowX="auto">
                            <TableContainer>
                                <Table size="sm" variant="simple">
                                    <Thead bg="gray.50">
                                        <Tr>
                                            <Th>User</Th>
                                            <Th>Role</Th>
                                            <Th>Timestamp</Th>
                                            <Th>IP Address</Th>
                                            <Th>Status</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {filteredLogins.map((login) => (
                                            <Tr key={login.id}>
                                                <Td>
                                                    <HStack spacing={3}>
                                                        <Avatar size="sm" src={login.user.img} name={login.user.name} />
                                                        <VStack align="start" spacing={0}>
                                                            <Text fontSize="sm" fontWeight="medium">
                                                                {login.user.name}
                                                            </Text>
                                                            <Text fontSize="xs" color={mutedColor}>
                                                                {login.user.email}
                                                            </Text>
                                                        </VStack>
                                                    </HStack>
                                                </Td>
                                                <Td>{login.user.role}</Td>
                                                <Td fontSize="sm" color={mutedColor}>
                                                    {new Date(login.timestamp).toLocaleString()}
                                                </Td>
                                                <Td fontSize="xs" fontFamily="mono">
                                                    {login.ip}
                                                </Td>
                                                <Td>
                                                    <Badge colorScheme={login.status === "Success" ? "gray" : "red"}>{login.status}</Badge>
                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </CardBody>
                </Card>
            )}
        </VStack>
    );
}

function DownloadIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
        </svg>
    );
}
