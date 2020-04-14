import { Router } from 'express';
import { UserRouter } from './users';
import { AccessRouter } from './access';
import { HealthRouter } from './HealthRouter';
import { AuthMiddleware } from '@controllers';
import { ProductRouter } from './products';
import { VersionRouter } from './versions/VersionRouter';

// Init router and path
const V1Router = Router({ mergeParams: true });

// Add public sub-routes
V1Router.use('/', AccessRouter);
V1Router.use('/health', HealthRouter);

// Insert token check
V1Router.use(AuthMiddleware);

// Add private sub-routes
V1Router.use('/users', UserRouter);
V1Router.use('/products', ProductRouter);
V1Router.use('/products/:productId/versions', VersionRouter);

// Export the base-router
export { V1Router };
