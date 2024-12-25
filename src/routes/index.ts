import { Router } from 'express';
import serviceProviderRoutes from './serviceProvider.route';
import adminRoutes from './admin.route';

const router = Router();

router.use('/service-provider', serviceProviderRoutes);
router.use('/admin', adminRoutes);

export default router;
