import express, {Router,Route} from "express"
import { createComment, getChildComments } from "../controllers/comment.controller.js";

const router = Router();

router.post('/create',createComment)
router.get('/children',getChildComments)    

export default router