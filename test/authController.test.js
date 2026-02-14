// import { jest, describe, expect } from '@jest/globals';
// import { signUp } from '../controllers/auth.controller.js';
// import User from '../models/user.model.js';
// import { userSchema } from '../middlewares/validator.middleware.js';
// import { generateTokens } from "../middlewares/jwt.middleware.js";
//
// jest.mock('../models/user.model.js');
// jest.mock('../middlewares/validator.middleware.js');
// jest.mock('../middlewares/jwt.middleware.js');
//
// userSchema.validate = jest.fn();
// User.findOne = jest.fn();
// User.create = jest.fn();
//
// describe('Auth Controller - signUp', () => {
//     let req, res;
//
//     beforeEach(() => {
//         req = {
//             body: {
//                 firstName: 'Emmanuel',
//                 lastName: 'Adah',
//                 email: 'test@example.com',
//                 role: 'admin',
//                 password: 'password123.'
//             }
//         };
//         res = {
//             status: jest.fn().mockReturnThis(),
//             json: jest.fn().mockReturnThis()
//         };
//     });
//
//     test('should successfully create a user and return a token', async () => {
//         // 1. Mock Validation to pass
//         userSchema.validate.mockReturnValue(true);
//
//         const mockSavedUser = {
//             _id: 'mockId123',
//             firstName: 'EMMANUEL',
//             lastName: 'ADAH',
//             email: 'test@example.com',
//             role: 'admin',
//             imageUrl: 'default.jpg'
//         };
//         User.create.mockResolvedValue(mockSavedUser);
//
//         // 3. Mock Token generation
//         generateTokens.mockReturnValue('mock_jwt_token');
//
//         console.log(typeof generateTokens.mockReturnValue('mock_jwt_token'))
//         await signUp(req, res);
//
//         expect(res.status).toHaveBeenCalledWith(201);
//         expect(res.json).toHaveBeenCalledWith({
//             user: expect.objectContaining({
//                 id: 'mockId123',
//                 name: 'EMMANUEL ADAH',
//                 email: 'test@example.com',
//                 role: 'admin',
//                 imageUrl: 'default.jpg'
//             }),
//             token: 'mock_jwt_token'
//         });
//     });
//
//     test('should return 400 if validation fails', async () => {
//         userSchema.validate.mockReturnValue(false);
//
//         // Note: Your controller throws AppError, so ensure your
//         // test environment handles the async throw or wrap it.
//         await expect(signUp(req, res)).rejects.toThrow('Invalid input');
//     });
// });
//
// describe('Auth Controller - signIn', () => {
//     let req, res;
//
//     beforeEach(() => {
//         req = { body: { email: 'test@example.com', password: 'password123' } };
//         res = {
//             status: jest.fn().mockReturnThis(),
//             json: jest.fn().mockReturnThis()
//         };
//     });
//
//     test('should sign in successfully with correct credentials', async () => {
//         const mockUser = {
//             _id: 'userId',
//             email: 'test@example.com',
//             firstName: 'EMMANUEL',
//             lastName: 'ADAH',
//             role: 'user',
//             matchPassword: jest.fn().mockResolvedValue(true)
//         };
//
//        User.findOne.mockReturnValue({
//         select: jest.fn().mockResolvedValue(mockUser)
//         });
//
//         generateTokens.mockReturnValue('new_token');
//
//         await signIn(req, res);
//
//         expect(res.status).toHaveBeenCalledWith(200);
//         expect(res.json).toBeCalledWith(expect.objectContaining({ token: 'new_token' }));
//     });
// });