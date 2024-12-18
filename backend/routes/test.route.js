import express, {Router,Route} from "express"
import { test } from "../controllers/test.controller.js";

const router = Router();

router.get('/',test)

export default router