import { Router } from 'express';
import {jwtFilter} from "../middlewares/jwt.middleware.js";
import {
    createAccount,
    findByUserId,
    findById,
    updateAccount,
    setPrimaryAccount,
    deleteAccount
} from "../controllers/account.controller.js";
import {authorizeRoles} from "../middlewares/roleAuth.middleware.js";
const router = Router();

router.post("/create", jwtFilter, authorizeRoles("ADMIN", "USER"), createAccount);
router.get("/find/:id", jwtFilter, authorizeRoles("ADMIN", "USER"), findById);
router.get("/find/user/:id", jwtFilter, authorizeRoles("ADMIN", "USER"), findByUserId);
router.delete("/delete/:id", jwtFilter, authorizeRoles("ADMIN", "USER"), deleteAccount);
router.patch("/update/:id", jwtFilter, authorizeRoles("ADMIN", "USER"), updateAccount);
router.patch("/setPrimary/:id", jwtFilter, authorizeRoles("ADMIN", "USER"), setPrimaryAccount);


export default router;