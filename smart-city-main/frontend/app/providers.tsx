'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import { IntelligenceProvider } from "@/components/providers/IntelligenceContext"

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <CacheProvider>
            <ChakraProvider>
                <IntelligenceProvider>
                    {children}
                </IntelligenceProvider>
            </ChakraProvider>
        </CacheProvider>
    )
}
