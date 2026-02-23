import { Router } from 'express';
import { searchAll, getPopularNews, getBreakingNews, getFeaturedNews, getPopularTags, getNewsBySubCategory } from '../controllers/search.controller';

const router = Router();

router.get('/search', searchAll);
router.get('/popular', getPopularNews);
router.get('/breaking', getBreakingNews);
router.get('/featured', getFeaturedNews);
router.get('/tags', getPopularTags);
router.get('/by-subcategory', getNewsBySubCategory);

export default router;
