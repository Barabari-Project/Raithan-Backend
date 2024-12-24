import { Router } from 'express';
import serviceProviderRoutes from './serviceProvider.route';

const router = Router();

router.use('/service-provider', serviceProviderRoutes);

export default router;
