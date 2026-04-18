"use client";

import Link from "next/link";
import { MobileSidebar } from "@/components/layout/Sidebar";
import { UserNav } from "@/components/layout/user-nav";
import { Flex, Box, Text, HStack, Spacer, IconButton, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { Moon, Sun } from "lucide-react";

export function Navbar() {
    const { colorMode, toggleColorMode } = useColorMode();
    const bg = useColorModeValue("whiteAlpha.900", "blackAlpha.800");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

    return (
        <Box
            as="header"
            position="sticky"
            top={0}
            zIndex={50}
            w="full"
            borderBottom="1px solid"
            borderColor={borderColor}
            bg={bg}
            backdropFilter="blur(10px)"
        >
            <Flex h={14} alignItems="center" px={4} maxW="container.xl" mx="auto">
                <MobileSidebar />
                <Box display={{ base: "none", md: "flex" }} mr={4}>
                    <Link href="/">
                        <Text fontWeight="bold" fontSize="lg">
                            Smart City Intelligence Platform
                        </Text>
                    </Link>
                </Box>
                <Spacer />
                <HStack spacing={4}>
                    <IconButton
                        aria-label="Toggle theme"
                        icon={colorMode === "light" ? <Moon size={20} /> : <Sun size={20} />}
                        onClick={toggleColorMode}
                        variant="ghost"
                    />
                    <UserNav />
                </HStack>
            </Flex>
        </Box>
    );
}
