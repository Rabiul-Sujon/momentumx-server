import express from 'express';
import {
  addFavorite,
  checkFavorite,
  getUserFavorites,
  removeFavorite,
  getUserFavoritesCount,
} from '../controllers/favorite.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import checkBlocked from '../middleware/checkBlocked.js';

const router = express.Router();

router.post('/', verifyToken, checkBlocked, addFavorite);
router.get('/check/:classId', verifyToken, checkFavorite);
router.get('/my-favorites', verifyToken, getUserFavorites);
router.get('/count', verifyToken, getUserFavoritesCount);
router.delete('/:id', verifyToken, removeFavorite);

export default router;