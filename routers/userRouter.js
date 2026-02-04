import {Router} from 'express';
import {jwtFilter} from '../middlewares/jwt.middleware.js';
import {findById, findByEmail, deleteById } from '../controllers/user.controller.js';
import {authorizeRoles} from "../middlewares/roleAuth.middleware.js";

const router = new Router();

router.get("/find/:id", jwtFilter, authorizeRoles("ADMIN", "USER"), findById);
router.get("/find/user/:email", jwtFilter, authorizeRoles("ADMIN", "USER"), findByEmail);
router.delete("/delete/:id", jwtFilter, authorizeRoles("ADMIN"), deleteById);

export default router;
