import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';

export const ChakraUIProvider = ({ children }) => {
  return (
    <ChakraProvider>
      {children}
    </ChakraProvider>
  );
};
