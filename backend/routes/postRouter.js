import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { createPost , getPost } from '../controllers/postController.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.post('/create', isAuth,upload.single("image"),createPost);
router.get('/getpost',isAuth,getPost);

export default router;