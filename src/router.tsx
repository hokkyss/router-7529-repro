import { QueryClient } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0,
        /**
         * 5 minutes
         */
        staleTime: 1000 * 60 * 5,
      },
    },
  })

  const router = createRouter({
    routeTree,
    context: { queryClient },
    trailingSlash: 'never',
    ssr: {
      nonce: 'xyz'
    }
  })

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
    handleRedirects: true,
    wrapQueryClient: true,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
