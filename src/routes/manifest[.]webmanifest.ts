import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/manifest.webmanifest')({
    server: {
        handlers({ createHandlers }) {
            return createHandlers({
                GET: {
                    handler: (ctx) => {
                        return new Response(JSON.stringify({}), {
                            headers: {
                                'Content-Type': 'application/manifest+json',
                            },
                        });
                    },
                },
            });
        },
    },
});