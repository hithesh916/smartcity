"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Box,
    VStack,
    HStack,
    Text,
    Icon,
    Button,
    Image,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerBody,
    useDisclosure,
    IconButton,
    useColorModeValue,
} from "@chakra-ui/react";
import {
    LayoutDashboard,
    Map as MapIcon,
    BarChart3,
    Settings,
    Menu,
} from "lucide-react";

const sidebarNavItems = [
    { title: "Overview", href: "/", icon: LayoutDashboard },
    { title: "City Map", href: "/map", icon: MapIcon },
    { title: "Analytics", href: "/analytics", icon: BarChart3 },
    { title: "Admin", href: "/admin", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const bg = useColorModeValue("white", "black");
    const color = useColorModeValue("gray.900", "white");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
    const activeBg = useColorModeValue("blue.500", "purple.500");
    const hoverColor = useColorModeValue("blue.600", "white");
    const inactiveColor = useColorModeValue("gray.600", "gray.400");
    const hoverBg = useColorModeValue("gray.100", "whiteAlpha.200");

    return (
        <Box
            w="256px"
            h="100vh"
            borderRight="1px solid"
            borderColor={borderColor}
            bg={bg}
            color={color}
            pb={12}
        >
            <VStack align="stretch" py={4} spacing={4}>
                <Box px={3} py={2}>
                    <HStack px={4} mb={4}>
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            boxSize="32px"
                            objectFit="contain"
                        />
                        <Text fontSize="lg" fontWeight="semibold" letterSpacing="tight">
                            Smart City Intel
                        </Text>
                    </HStack>
                    <VStack spacing={1} align="stretch">
                        {sidebarNavItems.map((item) => (
                            <Button
                                key={item.href}
                                as={Link}
                                href={item.href}
                                variant={pathname === item.href ? "solid" : "ghost"}
                                bg={pathname === item.href ? activeBg : "transparent"}
                                color={pathname === item.href ? "white" : inactiveColor}
                                _hover={{ color: hoverColor, bg: pathname === item.href ? activeBg : hoverBg }}
                                justifyContent="flex-start"
                                w="full"
                                leftIcon={<Icon as={item.icon} boxSize={4} />}
                                size="md"
                                fontWeight="medium"
                            >
                                {item.title}
                            </Button>
                        ))}
                    </VStack>
                </Box>
            </VStack>
        </Box>
    );
}

export function MobileSidebar() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const pathname = usePathname();
    const bg = useColorModeValue("white", "black");
    const color = useColorModeValue("gray.900", "white");
    const activeBg = useColorModeValue("blue.500", "purple.500");
    const hoverColor = useColorModeValue("blue.600", "white");
    const inactiveColor = useColorModeValue("gray.600", "gray.400");
    const hoverBg = useColorModeValue("gray.100", "whiteAlpha.200");

    return (
        <>
            <IconButton
                icon={<Icon as={Menu} boxSize={6} />}
                aria-label="Toggle Menu"
                variant="ghost"
                onClick={onOpen}
                mr={2}
                display={{ base: "flex", md: "none" }}
            />
            <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerBody px={4} py={8} bg={bg} color={color}>
                        <HStack mb={8}>
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                boxSize="32px"
                                objectFit="contain"
                            />
                            <Text fontSize="xl" fontWeight="bold">
                                Smart City Intel
                            </Text>
                        </HStack>
                        <VStack spacing={3} align="stretch">
                            {sidebarNavItems.map((item) => (
                                <Button
                                    key={item.href}
                                    as={Link}
                                    href={item.href}
                                    onClick={onClose}
                                    variant={pathname === item.href ? "solid" : "ghost"}
                                    bg={pathname === item.href ? activeBg : "transparent"}
                                    color={pathname === item.href ? "white" : inactiveColor}
                                    _hover={{ color: hoverColor, bg: pathname === item.href ? activeBg : hoverBg }}
                                    justifyContent="flex-start"
                                    leftIcon={<Icon as={item.icon} boxSize={5} />}
                                    w="full"
                                    size="lg"
                                >
                                    {item.title}
                                </Button>
                            ))}
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
}
