/*
 * GET home page.
 */
import express from 'express';
import { getIndex, postIndex} from '../controller/indexController.js';

const router = express.Router();

router.get('/', getIndex);
router.post('/', postIndex);

export default router;