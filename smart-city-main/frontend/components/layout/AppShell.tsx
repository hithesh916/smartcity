"use client";

import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

export function AppShell({ children }: { children: React.ReactNode }) {
    const bg = useColorModeValue("gray.50", "black");
    const color = useColorModeValue("gray.900", "white");

    return (
        <Flex minH="100vh" bg={bg} color={color}>
            <Box display={{ base: "none", md: "block" }}>
                <Box position="fixed" left={0} top={0} w="256px" h="100vh">
                    <Sidebar />
                </Box>
            </Box>

            <Flex flex={1} flexDir="column" ml={{ base: 0, md: "256px" }}>
                <Navbar />
                <Box flex={1} overflowY="auto" h="calc(100vh - 3.5rem)">
                    {children}
                </Box>
            </Flex>
        </Flex>
    );
}
