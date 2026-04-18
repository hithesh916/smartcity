"use client";

import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Avatar,
    Box,
    Text,
    Button,
    useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import { SettingsModal } from "./settings-modal";

export function UserNav() {
    const [name, setName] = useState("Admin User");
    const [email, setEmail] = useState("admin@smartcity.com");
    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        const storedName = localStorage.getItem("userName");
        const storedEmail = localStorage.getItem("userEmail");
        if (storedName) setName(storedName);
        if (storedEmail) setEmail(storedEmail);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        router.push("/login");
    };

    return (
        <Fragment>
            <Menu>
                <MenuButton
                    as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                >
                    <Avatar size={"sm"} name={name} bg="green.500" color="white" />
                </MenuButton>
                <MenuList>
                    <Box px={3} py={2}>
                        <Text fontSize="sm" fontWeight="medium">
                            {name}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                            {email}
                        </Text>
                    </Box>
                    <MenuDivider />
                    <MenuItem>Profile</MenuItem>
                    <MenuItem onClick={onOpen}>Settings</MenuItem>
                    <MenuDivider />
                    <MenuItem onClick={handleLogout} color="red.500">Log out</MenuItem>
                </MenuList>
            </Menu>
            <SettingsModal isOpen={isOpen} onClose={onClose} />
        </Fragment>
    );
}
