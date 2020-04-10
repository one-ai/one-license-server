import { Router } from 'express';
import { UserRouter } from './users';
import { RegisterRouter } from './access';
import { HealthRouter } from './HealthRouter';

// Init router and path
const V1Router = Router();

// Add sub-routes
V1Router.use('/register', RegisterRouter);
V1Router.use('/users', UserRouter);
V1Router.use('/health', HealthRouter);

// Export the base-router
export { V1Router };
