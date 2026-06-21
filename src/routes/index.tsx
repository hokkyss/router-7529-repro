import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { Await, createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { Suspense } from 'react'
import z from 'zod'

const queryOpts = () => queryOptions({
  queryKey: ['test-query'],
  queryFn: async () => {
    await sleep(1000);
    return ({ success: true })
  }
})


function sleep(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms))
}


const serverFunction = createServerFn()
  .validator(z.object({}))
  .handler(async (ctx) => {
    await sleep(3000)
    return z.object({
      success: z.string()
    }).parse({ success: 'aw' })
  })

const secondQueryOpts = () => queryOptions({
  queryKey: ['test-query-2'],
  queryFn: ({ signal }) => serverFunction({ signal, data: {} })
})

export const Route = createFileRoute('/')({
  component: Home,
  loader: (ctx) => {
    return {
      promise: ctx.context.queryClient.prefetchQuery(queryOpts()),
      secondPromise: ctx.context.queryClient.prefetchQuery(secondQueryOpts())
    }
  }
})

function Home() {
  const { secondPromise } = Route.useLoaderData()

  return (
    <>
      <div>Static</div>
      <WrappedHome />
      <Await promise={secondPromise}>
        {() => <SecondHome />}
      </Await>
    </>
  )
}

function WrappedHome() {
  const { data: success } = useSuspenseQuery({
    ...queryOpts(),
  });

  return <div>
    {success.success ? 'success' : 'failed'}
  </div>
}

function SecondHome() {
  const { data: success } = useSuspenseQuery({
    ...secondQueryOpts(),
  });

  return <div>
    {success.success ? 'success' + success.success : 'failed'}
  </div>
}
