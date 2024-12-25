import express, {Router,Route} from "express"
import { createBlogPost, deleteBlogPost, getBlogsByAuthor, updateBlogPost, getBlogPost, voteBlog } from "../controllers/blog.controller.js";


const router = Router();

router.post('/create',createBlogPost)
router.post('/delete/:id',deleteBlogPost)
router.post('/update/:id',updateBlogPost)
router.get('/:id',getBlogPost)
router.get('/',getBlogsByAuthor)
router.post('/vote/:id',voteBlog)


export default router