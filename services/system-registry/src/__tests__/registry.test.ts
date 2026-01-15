import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import router from '../routes';
import { pool } from '../services/db';
import { logger } from '../utils/logger';

// MOCK CONSTANTS
const TEST_ENTITY_TYPE = 'org_unit_type'; // A safe Foundation Entity to test with
const TEST_CODE_PREFIX = `test_unit_${Date.now()}_`;

// SETUP EXPRESS APP FOR TESTING
const app = express();
app.use(bodyParser.json());
app.use('/api/v1/registry', router);

// SILENCE LOGGER
logger.transports.forEach((t) => (t.silent = true));

// DB TEARDOWN HELPER
async function cleanTestEntities() {
  // CLEANUP DISABLED: 'registry_writer' cannot delete (Guardrail).
  // We use dynamic TEST_CODE_PREFIX to avoid collisions.
  console.log('Skipping teardown (Deletion Forbidden by Design)');
}

describe('System Registry Service Verification', () => {
  beforeAll(async () => {
    // Ensure we are connected to the test database
    // validation check
    const res = await pool.query('SELECT current_database()');
    const dbName = res.rows[0].current_database;
    if (dbName !== 'matrixgin_test') {
      throw new Error(`CRITICAL: Running tests against wrong database: ${dbName}. Expected: matrixgin_test`);
    }
  });

  afterAll(async () => {
    await cleanTestEntities();
    await pool.end();
  });

  describe('1. CONTRACT TESTS', () => {
    const code = `${TEST_CODE_PREFIX}contract`;

    it('POST /:type creates entity in DRAFT status', async () => {
      const res = await request(app)
        .post(`/api/v1/registry/${TEST_ENTITY_TYPE}`)
        .send({
          code,
          name: 'Contract Test Unit',
          description: 'Testing API Contract'
        });

      expect(res.status).toBe(201);
      expect(res.body.code).toBe(code);
      expect(res.body.lifecycle_status).toBe('draft');
      expect(res.body.id).toBeDefined();
    });

    it('GET /:type/:id returns RegistryEntityDTO', async () => {
      // Create first
      const createRes = await request(app).post(`/api/v1/registry/${TEST_ENTITY_TYPE}`).send({
        code: `${code}_get`, name: 'Get Test', description: 'desc'
      });
      const id = createRes.body.id;

      const res = await request(app).get(`/api/v1/registry/${TEST_ENTITY_TYPE}/${id}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(id);
      expect(res.body.code).toBe(`${code}_get`);
      expect(res.body).toHaveProperty('created_at');
      expect(res.body).toHaveProperty('updated_at');
    });

    it('DELETE /:type/:id should NOT exist (404)', async () => {
      const res = await request(app).delete(`/api/v1/registry/${TEST_ENTITY_TYPE}/some-id`);
      expect(res.status).toBe(404);
    });
  });

  describe('2. LIFECYCLE FSM TESTS', () => {
    const code = `${TEST_CODE_PREFIX}fsm`;
    let id: string;

    it('Scenario: Draft -> Active -> Archived', async () => {
      // 1. Create (Draft)
      const create = await request(app).post(`/api/v1/registry/${TEST_ENTITY_TYPE}`).send({
        code, name: 'FSM Test'
      });
      id = create.body.id;
      expect(create.body.lifecycle_status).toBe('draft');

      // 2. Draft -> Active
      const toActive = await request(app).post(`/api/v1/registry/${TEST_ENTITY_TYPE}/${id}/lifecycle`)
        .send({ transition: 'activate' });
      expect(toActive.status).toBe(200);
      expect(toActive.body.lifecycle_status).toBe('active');

      // 3. Active -> Archived
      const toArchive = await request(app).post(`/api/v1/registry/${TEST_ENTITY_TYPE}/${id}/lifecycle`)
        .send({ transition: 'archive' });
      expect(toArchive.status).toBe(200);
      expect(toArchive.body.lifecycle_status).toBe('archived');
    });

    it('Scenario: Archived -> Active (Forbidden)', async () => {
      // Re-use archived entity from previous test
      const res = await request(app).post(`/api/v1/registry/${TEST_ENTITY_TYPE}/${id}/lifecycle`)
        .send({ transition: 'activate' });
      expect(res.status).toBe(409);
    });
  });

  describe('3. IMMUTABILITY TESTS', () => {
    const code = `${TEST_CODE_PREFIX}immutable`;
    let id: string;

    beforeAll(async () => {
      const res = await request(app).post(`/api/v1/registry/${TEST_ENTITY_TYPE}`).send({ code, name: 'Immutable' });
      id = res.body.id;
    });

    it('PATCH cannot change code', async () => {
      const res = await request(app).patch(`/api/v1/registry/${TEST_ENTITY_TYPE}/${id}`)
        .send({ code: 'new_code_attempt' });
      expect(res.status).toBe(400); // Controller check
    });

    it('PATCH can change name', async () => {
      const res = await request(app).patch(`/api/v1/registry/${TEST_ENTITY_TYPE}/${id}`)
        .send({ name: 'Renamed Entity' });
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Renamed Entity');
      expect(res.body.code).toBe(code); // Code remains same
    });
  });

  describe('4. AUDIT TESTS', () => {
    const code = `${TEST_CODE_PREFIX}audit`;
    let id: string;

    it('Records operations', async () => {
      // 1. Create
      const create = await request(app).post(`/api/v1/registry/${TEST_ENTITY_TYPE}`).send({ code, name: 'Audit Me' });
      id = create.body.id;

      // 2. Update
      await request(app).patch(`/api/v1/registry/${TEST_ENTITY_TYPE}/${id}`).send({ name: 'Audit Me Changed' });

      // 3. Lifecycle
      await request(app).post(`/api/v1/registry/${TEST_ENTITY_TYPE}/${id}/lifecycle`).send({ transition: 'activate' });

      // 4. Check History
      const auditRes = await request(app).get(`/api/v1/registry/${TEST_ENTITY_TYPE}/${id}/audit`);
      expect(auditRes.status).toBe(200);
      const logs = auditRes.body;

      expect(logs.length).toBeGreaterThanOrEqual(3);
      expect(logs.some((l: any) => l.operation === 'CREATE')).toBe(true);
      expect(logs.some((l: any) => l.operation === 'UPDATE_META')).toBe(true);
      expect(logs.some((l: any) => l.operation === 'UPDATE_LIFECYCLE')).toBe(true);
    });
  });
});
