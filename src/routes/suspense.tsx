import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const withServerFn = createServerFn()
    .handler(async () => {
        return { success: 'query3' }
    })

const queryOpts = () => queryOptions({
    queryKey: ['test-query-3'],
    queryFn: ({ signal }) => withServerFn({ signal })
})

export const Route = createFileRoute('/suspense')({
    component: RouteComponent,
    loader: (ctx) => ctx.context.queryClient.prefetchQuery(queryOpts())
})

function RouteComponent() {
    const { data: success } = useSuspenseQuery({
        ...queryOpts(),
    })
    return <div>Hello "/suspense"! {success.success}</div>
}
