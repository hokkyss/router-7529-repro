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

const queryOpts = () => queryOptions({
  queryKey: ['test-query-root'],
  queryFn: () => new Promise<{ success: boolean }>((res, rej) => {
    setTimeout(() => res({ success: true }), 1000)
  })
})

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  loader: async (ctx) => {
    await ctx.context.queryClient.ensureQueryData(queryOpts());
    return {};
  },
  component: Outlet,
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
        {children}
        <Scripts />
      </body>
    </html>
  )
}
