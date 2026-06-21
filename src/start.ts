import { createCsrfMiddleware, createMiddleware, createStart } from "@tanstack/react-start";
import { createSerializationAdapter } from '@tanstack/react-router';

const csrfMiddleware = createCsrfMiddleware({
    filter: (ctx) => ctx.handlerType === 'serverFn',
});

class Test {
    x = 5
}

const requestMiddleware = createMiddleware({ type: "request" })
    .server(async (ctx) => {
        const requestId = crypto.randomUUID();

        const result = await ctx.next({
            context: {
                requestId,
            }
        });

        result.response.headers.set('X-Request-Id', requestId);

        return result;
    })

const serializer = createSerializationAdapter({
    key: 'XYZ',
    test(value): value is Test {
        return value instanceof Test;
    },
    toSerializable(value: Test) {
        return { x: value.x };
    },
    fromSerializable(value): Test {
        return new Test();
    },
});

export const startInstance = createStart(() => ({
    requestMiddleware: [csrfMiddleware, requestMiddleware],
    serializationAdapters: [serializer]
}))
