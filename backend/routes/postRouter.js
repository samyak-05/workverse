import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { createPost , getPost, likePost, comment } from '../controllers/postController.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.post('/create', isAuth,upload.single("image"),createPost);
router.get('/getpost',isAuth,getPost);
router.get('/like/:id',isAuth,likePost);
router.post('/comment/:id',isAuth,comment)

export default router;