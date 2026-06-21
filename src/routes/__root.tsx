/// <reference types="vite/client" />
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import * as React from 'react'
import type { QueryClient } from '@tanstack/react-query'

import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { ContextProvider } from '~/context'
import { createIsomorphicFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { getOrigin } from '@tanstack/react-router/ssr/server'

const getApplicationUrl = createIsomorphicFn()
  .server(() => getOrigin(getRequest()))
  .client(() => location.origin);

const queryOpts = () => queryOptions({
  queryKey: ['test-query-root'],
  queryFn: () => ({ success: true })
})

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  loader: async (ctx) => {
    await ctx.context.queryClient.ensureQueryData(queryOpts());
    return {};
  },
  shellComponent: RootDocument,
  head: () => {
    return {
      meta: [{
        title: '7529 Repro?'
      }],
      scripts: [
        {
          async: true,
          children: 'console.log("aw");'
        }
      ],
      links: [
        {
          href: new URL('manifest.webmanifest', getApplicationUrl()).toString(),
        }
      ]
    }
  },
  pendingComponent: Pending
})

function Pending() {
  return <div>
    loading
  </div>
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const { data } = useSuspenseQuery({
    ...queryOpts(),
  })

  return (
    <html data-testid={data.success ? 'testid' : 'none'}>
      <head>
        <HeadContent />
      </head>
      <body>
        <ContextProvider value={data.success ? 'rootsuccess' : 'rootfail'}>
          {children}
        </ContextProvider>
        <Scripts />
      </body>
    </html>
  )
}
