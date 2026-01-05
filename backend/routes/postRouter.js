import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { createPost } from '../controllers/postController.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.post('/create', isAuth,upload.single("image"),createPost);

export default router;