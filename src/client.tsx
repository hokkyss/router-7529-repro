import { StartClient } from '@tanstack/react-start/client';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';

console.log('client.tsx')

startTransition(() => {
    hydrateRoot(
        document,
        <StrictMode>
            <StartClient />
        </StrictMode>,
    );
});