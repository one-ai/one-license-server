import request from 'supertest';
import app from '@server';

describe('Health Endpoints', () => {
    it('should get health status', async () => {
        const res = await request(app).get('/api/health').send();
        expect(res.status).toEqual(200);
    });
});
