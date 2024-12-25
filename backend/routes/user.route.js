import express, {Router,Route} from "express"
import { deleteUser, editUser, signout } from "../controllers/user.controller.js";

const router = Router();

router.post('/signout',signout)
router.delete('/:id',deleteUser)
router.put('/update',editUser)

export default router