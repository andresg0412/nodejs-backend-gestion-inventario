const request = require('supertest');
const app = require('../server'); 
const { sequelize } = require('../models/user'); 

beforeAll(async () => {
    await sequelize.sync({ force: true }); 
});

afterAll(async () => {
    await sequelize.close(); 
});

describe('Product Routes', () => {
    let token;

    beforeAll(async () => {
        const registerResponse = await request(app)
            .post('/api/auth/register')
            .send({ email: 'test@example.com', password: 'password123' });

        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@example.com', password: 'password123' });

        token = loginResponse.body.token;
    });

    it('should create a new product', async () => {
        const response = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Product1', price: 100, cantidad: 10, SKU: 'SKU123' });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('name', 'Product1');
    });

    it('should get all products', async () => {
        const response = await request(app)
            .get('/api/products');

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });
});
