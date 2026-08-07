const request = require('supertest');
const app = require('../src/server');

describe('API /api/users', () => {
  beforeEach(() => {
    // reset in-memory users between tests
    app.locals.users.length = 0;
  });

  test('GET /api/users returns empty array initially', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('POST /api/users creates a user', async () => {
    const res = await request(app).post('/api/users').send({ name: 'Alice' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: 1, name: 'Alice' });

    const list = await request(app).get('/api/users');
    expect(list.body).toHaveLength(1);
    expect(list.body[0].name).toBe('Alice');
  });

  test('POST /api/users 400 if name missing', async () => {
    const res = await request(app).post('/api/users').send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
