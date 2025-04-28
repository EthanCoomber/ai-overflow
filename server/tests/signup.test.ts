// To run: NODE_ENV=test npx jest

import { Request, Response } from 'express';
import userController from '../controllers/userController';
import * as userService from '../services/userService';

// Mock the userService module
jest.mock('../services/userService');

// Define interfaces to match AuthResponse schema
interface User {
    _id: string;
    username: string;
    email: string;
}

interface AuthResponse {
    user: User;
    token: string;
}

describe('userController.signup', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseObject: Record<string, unknown>;

    beforeEach(() => {
        mockRequest = {
            body: {
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
            },
        };

        responseObject = {};

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockImplementation((data) => {
                responseObject = data;
                return mockResponse;
            }),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should register a new user and return user details with token', async () => {
        const mockAuthResponse: AuthResponse = {
            user: {
                _id: 'u1',
                username: 'testuser',
                email: 'test@example.com',
            },
            token: 'mocked_jwt_token',
        };

        (userService.registerUser as jest.Mock).mockResolvedValue(mockAuthResponse);

        await userController.signup(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(userService.registerUser).toHaveBeenCalledWith({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
        });
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(mockAuthResponse);
        expect(responseObject).toEqual(mockAuthResponse);
    });

    it('should return 400 for missing registration fields', async () => {
        mockRequest.body = {
            username: 'testuser',
            email: '',
            password: 'password123',
        };

        const error = new Error('validation failed: All fields are required');
        (userService.registerUser as jest.Mock).mockRejectedValue(error);

        await userController.signup(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(userService.registerUser).toHaveBeenCalledWith({
            username: 'testuser',
            email: '',
            password: 'password123',
        });
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Invalid registration data',
            error: error.message,
        });
        expect(responseObject).toEqual({
            message: 'Invalid registration data',
            error: error.message,
        });
    });

    it('should return 409 for duplicate email', async () => {
        mockRequest.body = {
            username: 'newuser',
            email: 'existing@example.com',
            password: 'password123',
        };

        const error = new Error('validation failed: User with this email or username already exists');
        (userService.registerUser as jest.Mock).mockRejectedValue(error);

        await userController.signup(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(userService.registerUser).toHaveBeenCalledWith({
            username: 'newuser',
            email: 'existing@example.com',
            password: 'password123',
        });
        expect(mockResponse.status).toHaveBeenCalledWith(409);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'User with this email or username already exists',
        });
        expect(responseObject).toEqual({
            message: 'User with this email or username already exists',
        });
    });

    it('should return 409 for duplicate username', async () => {
        mockRequest.body = {
            username: 'existinguser',
            email: 'new@example.com',
            password: 'password123',
        };

        const error = new Error('validation failed: User with this email or username already exists');
        (userService.registerUser as jest.Mock).mockRejectedValue(error);

        await userController.signup(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(userService.registerUser).toHaveBeenCalledWith({
            username: 'existinguser',
            email: 'new@example.com',
            password: 'password123',
        });
        expect(mockResponse.status).toHaveBeenCalledWith(409);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'User with this email or username already exists',
        });
        expect(responseObject).toEqual({
            message: 'User with this email or username already exists',
        });
    });

    it('should return 500 for server errors', async () => {
        const error = new Error('Database failure');
        (userService.registerUser as jest.Mock).mockRejectedValue(error);

        await userController.signup(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(userService.registerUser).toHaveBeenCalledWith({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
        });
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Internal Server Error',
            error,
        });
        expect(responseObject).toEqual({
            message: 'Internal Server Error',
            error,
        });
    });
});