"use client";

export const dynamic = 'force-dynamic';


import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import {
    Box,
    Button,
    Flex,
    Input,
    Text,
    VStack,
    Heading,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    FormControl,
    FormLabel,
    Link as ChakraLink,
} from "@chakra-ui/react";
import { Loader2 } from "lucide-react";
import NextLink from "next/link";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push("/login?message=Check your email to confirm account");
        }
    };

    return (
        <Flex minH="100vh" align="center" justify="center" bg="gray.50" p={4}>
            <Card w="full" maxW="md" shadow="lg" variant="outline" bg="white">
                <CardHeader pb={0}>
                    <Heading as="h2" size="xl" textAlign="center" letterSpacing="tight">
                        Create Account
                    </Heading>
                    <Text fontSize="sm" color="gray.500" textAlign="center" mt={2}>
                        Join the Smart City Dashboard
                    </Text>
                </CardHeader>

                <form onSubmit={handleSignup}>
                    <CardBody>
                        <VStack spacing={4}>
                            {error && (
                                <Box p={3} w="full" bg="red.50" borderWidth={1} borderColor="red.200" borderRadius="md">
                                    <Text fontSize="sm" color="red.600">
                                        {error}
                                    </Text>
                                </Box>
                            )}

                            <FormControl id="name" isRequired>
                                <FormLabel fontSize="sm" fontWeight="medium">
                                    Full Name
                                </FormLabel>
                                <Input
                                    placeholder="John Doe"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    focusBorderColor="blue.400"
                                />
                            </FormControl>

                            <FormControl id="email" isRequired>
                                <FormLabel fontSize="sm" fontWeight="medium">
                                    Email
                                </FormLabel>
                                <Input
                                    type="email"
                                    placeholder="john@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    focusBorderColor="blue.400"
                                />
                            </FormControl>

                            <FormControl id="password" isRequired>
                                <FormLabel fontSize="sm" fontWeight="medium">
                                    Password
                                </FormLabel>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    focusBorderColor="blue.400"
                                />
                            </FormControl>
                        </VStack>
                    </CardBody>

                    <CardFooter flexDir="column" pt={0}>
                        <Button
                            w="full"
                            type="submit"
                            colorScheme="blue"
                            size="lg"
                            isLoading={loading}
                            spinner={<Loader2 className="animate-spin" />}
                            mb={4}
                        >
                            Sign Up
                        </Button>
                        <Text fontSize="sm" textAlign="center" color="gray.600">
                            Already have an account?{" "}
                            <ChakraLink as={NextLink} href="/login" color="blue.500" fontWeight="semibold">
                                Login
                            </ChakraLink>
                        </Text>
                    </CardFooter>
                </form>
            </Card>
        </Flex>
    );
}
