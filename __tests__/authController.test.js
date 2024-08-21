const request = require('supertest');
const app = require('../server');
const { sequelize } = require('../models/user'); 

beforeAll(async () => {
    await sequelize.sync({ force: true }); 
});

afterAll(async () => {
    await sequelize.close();
});

describe('POST /api/auth/register', () => {
    it('should register a new user and return a token', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({ email: 'test@example.com', password: 'password123' });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('token');
    });

    it('should return an error if email is already in use', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({ email: 'test@example.com', password: 'password123' });

        const response = await request(app)
            .post('/api/auth/register')
            .send({ email: 'test@example.com', password: 'password123' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('El usuario ya existe');
    });
});

describe('POST /api/auth/login', () => {
    it('should log in an existing user and return a token', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({ email: 'test@example.com', password: 'password123' });

        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: 'password123' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    it('should return an error if login credentials are incorrect', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: 'wrongpassword' });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Contraseña incorrecta');
    });
});
