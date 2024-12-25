import express, {Router,Route} from "express"
import { createComment, getChildComments } from "../controllers/comment.controller.js";
import { getTopContributors } from "../controllers/home.controller.js";

const router = Router();

router.get('/topContributors',getTopContributors)
// router.get('/companies',getChildComments)    

export default router