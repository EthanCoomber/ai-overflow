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

describe('userController.login', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let responseObject: Record<string, unknown>;

    beforeEach(() => {
        mockRequest = {
            body: {
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

    it('should authenticate user and return user details with token', async () => {
        const mockAuthResponse: AuthResponse = {
            user: {
                _id: 'u1',
                username: 'testuser',
                email: 'test@example.com',
            },
            token: 'mocked_jwt_token',
        };

        (userService.authenticateUser as jest.Mock).mockResolvedValue(mockAuthResponse);

        await userController.login(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(userService.authenticateUser).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'password123',
        });
        expect(mockResponse.json).toHaveBeenCalledWith(mockAuthResponse);
        expect(responseObject).toEqual(mockAuthResponse);
    });

    it('should return 401 for invalid credentials', async () => {
        const error = new Error('Invalid credentials');
        (userService.authenticateUser as jest.Mock).mockRejectedValue(error);

        await userController.login(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(userService.authenticateUser).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'password123',
        });
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Invalid credentials',
        });
        expect(responseObject).toEqual({
            message: 'Invalid credentials',
        });
    });

    it('should return 500 for server errors', async () => {
        const error = new Error('Database failure');
        (userService.authenticateUser as jest.Mock).mockRejectedValue(error);

        await userController.login(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(userService.authenticateUser).toHaveBeenCalledWith({
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

    it('should return 401 for incorrect password', async () => {
        mockRequest.body = {
            email: 'test@example.com',
            password: 'wrongpassword',
        };

        const error = new Error('Invalid credentials');
        (userService.authenticateUser as jest.Mock).mockRejectedValue(error);

        await userController.login(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(userService.authenticateUser).toHaveBeenCalledWith({
            email: 'test@example.com',
            password: 'wrongpassword',
        });
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Invalid credentials',
        });
        expect(responseObject).toEqual({
            message: 'Invalid credentials',
        });
    });

    it('should return 401 for non-existent user', async () => {
        mockRequest.body = {
            email: 'nonexistent@example.com',
            password: 'password123',
        };

        const error = new Error('Invalid credentials');
        (userService.authenticateUser as jest.Mock).mockRejectedValue(error);

        await userController.login(
            mockRequest as Request,
            mockResponse as Response
        );

        expect(userService.authenticateUser).toHaveBeenCalledWith({
            email: 'nonexistent@example.com',
            password: 'password123',
        });
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Invalid credentials',
        });
        expect(responseObject).toEqual({
            message: 'Invalid credentials',
        });
    });
});