const request = require('supertest');
const app = require('../server'); // Import your Express app

describe('Event API', () => {
  it('should create a new event', async () => {
    const res = await request(app)
      .post('/events')
      .set('Authorization', 'Bearer <JWT_TOKEN>') // Replace with a valid token
      .send({
        name: 'Test Event',
        description: 'This is a test event',
        date: '2023-10-15',
        time: '10:00',
        category: 'Test',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Event created successfully');
  });

  it('should fetch events', async () => {
    const res = await request(app)
      .get('/events')
      .set('Authorization', 'Bearer <JWT_TOKEN>'); // Replace with a valid token
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});