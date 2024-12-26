import { Router } from 'express';
import serviceProviderRoutes from './serviceProvider.route';
import adminRoutes from './admin.route';
import serviceSeekerRoutes from './serviceSeeker.route';
import businessRoutes from './business.route';
import commonRoutes from './common.route';
const router = Router();

router.use('/service-providers', serviceProviderRoutes);
router.use('/admin', adminRoutes);
router.use('/service-seekers', serviceSeekerRoutes);
router.use('/business', businessRoutes);
router.use(commonRoutes);

export default router;