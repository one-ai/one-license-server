import { Router } from 'express';
import { UserRouter } from './users';
import { AccessRouter } from './access';
import { HealthRouter } from './HealthRouter';
import { AuthMiddleware } from '@controllers';

// Init router and path
const V1Router = Router();

// Add public sub-routes
V1Router.use('/', AccessRouter);
V1Router.use('/health', HealthRouter);

// Insert token check
V1Router.use(AuthMiddleware);

// Add private sub-routes
V1Router.use('/users', UserRouter);

// Export the base-router
export { V1Router };
