import { Router } from 'express';
import serviceProviderRoutes from './serviceProvider.route';
import adminRoutes from './admin.route';
import serviceSeekerRoutes from './serviceSeeker.route';
import businessRoutes from './business.route';
const router = Router();

router.use('/service-provider', serviceProviderRoutes);
router.use('/admin', adminRoutes);
router.use('/service-seeker', serviceSeekerRoutes);
router.use('/business', businessRoutes);

export default router;
