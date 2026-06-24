"use client";

import React from 'react';
import {
  ChakraProvider,
  ColorModeScript,
  extendTheme,
  type ThemeConfig,
} from '@chakra-ui/react';
import { WalletProvider } from '@/context/WalletContext';

// Force Chakra into dark mode and keep the body transparent so the global
// AppBackground (and the dark base color) always show through. Without this,
// Chakra's default light color mode paints the body white, which flashed during
// loading states.
const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  styles: {
    global: {
      'html, body': {
        background: 'transparent',
        color: 'whiteAlpha.900',
      },
    },
  },
});

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <ColorModeScript initialColorMode={config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <WalletProvider>
          {children}
        </WalletProvider>
      </ChakraProvider>
    </>
  );
};

export default Providers;
