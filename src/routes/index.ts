import { Router } from 'express';
import serviceProviderRoutes from './provider/serviceProvider.route';
import adminRoutes from './admin.route';
import serviceSeekerRoutes from './serviceSeeker.route';
import businessRoutes from './provider/business.route';
import commonRoutes from './common.route';
import productRoutes from './provider/product.route';
const router = Router();

router.use('/service-providers', serviceProviderRoutes);
router.use('/admin', adminRoutes);
router.use('/service-seekers', serviceSeekerRoutes);
router.use('/business', businessRoutes);
router.use('/products', productRoutes);
router.use(commonRoutes);

export default router;