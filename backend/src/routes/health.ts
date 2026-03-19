import { Hono } from 'hono';

const healthRouter = new Hono();

healthRouter.get('/healthz', (c) => {
  return c.json(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    200
  );
});

healthRouter.get('/health', (c) => {
  return c.json(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    200
  );
});

export default healthRouter;
