import { index, route, type RouteConfig } from '@react-router/dev/routes';

/**
 * Central route configuration for React Router Framework mode.
 * Re-exported from `src/routes.ts` (required filename for the Vite plugin).
 */
export default [
  index('./route-modules/home.tsx'),
  route('tools/:toolId', './route-modules/tool.tsx'),
  route('*', './route-modules/catch-all.tsx'),
] satisfies RouteConfig;
