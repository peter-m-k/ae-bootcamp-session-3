const request = require('supertest');
const { app, db } = require('../src/app');

afterAll(() => {
  if (db) db.close();
});

describe('Tasks API', () => {
  let taskId;

  it('should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Test Task', description: 'A test task', due_date: '2025-09-30' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Test Task');
    expect(res.body.description).toBe('A test task');
    expect(res.body.due_date).toBe('2025-09-30');
    expect(res.body.completed).toBe(0);
    expect(res.body.priority).toBe('P3');
    taskId = res.body.id;
  });

  it('should get all tasks', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get a single task by id', async () => {
    const res = await request(app).get(`/api/tasks/${taskId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(taskId);
  });

  it('should update a task', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .send({ title: 'Updated Task', description: 'Updated', due_date: '2025-10-01' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Task');
    expect(res.body.description).toBe('Updated');
    expect(res.body.due_date).toBe('2025-10-01');
  });

  it('should mark a task as completed', async () => {
    const res = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .send({ completed: true });
    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(1);
  });

  it('should delete a task', async () => {
    const res = await request(app).delete(`/api/tasks/${taskId}`);
    expect(res.status).toBe(204);
  });
});

describe('Task priority', () => {
  let taskId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Priority Test Task' });
    taskId = res.body.id;
  });

  it('defaults new tasks to priority P3 when not provided', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'No Priority Task' });
    expect(res.status).toBe(201);
    expect(res.body.priority).toBe('P3');
  });

  it('accepts an explicit priority on create', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'High Priority Task', priority: 'P1' });
    expect(res.status).toBe(201);
    expect(res.body.priority).toBe('P1');
  });

  it('rejects an invalid priority on create', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'Bad Priority Task', priority: 'P4' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Priority must be one of P1, P2, P3');
  });

  it('updates priority via PATCH', async () => {
    const res = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .send({ priority: 'P2' });
    expect(res.status).toBe(200);
    expect(res.body.priority).toBe('P2');
  });

  it('rejects an invalid priority via PATCH', async () => {
    const res = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .send({ priority: 'urgent' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Priority must be one of P1, P2, P3');
  });

  it('preserves existing priority on PUT when priority is not sent', async () => {
    await request(app)
      .patch(`/api/tasks/${taskId}`)
      .send({ priority: 'P1' });
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .send({ title: 'Priority Test Task Renamed', description: '', due_date: null });
    expect(res.status).toBe(200);
    expect(res.body.priority).toBe('P1');
  });

  it('rejects an invalid priority via PUT', async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .send({ title: 'Priority Test Task', priority: 'nope' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Priority must be one of P1, P2, P3');
  });
});
