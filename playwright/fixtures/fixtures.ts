import { test as base } from '@playwright/test';
import testUsers from '../test-data/testUsers.json';

type MyFixtures = {
    createUserViaAPI: () => Promise<void>;
}

export const test = base.extend<MyFixtures>({
  createUserViaAPI: async ({ request }, use) => {
    const createUserViaAPI = async (): Promise<void> => {
      const res = await request.post(`${process.env.API_URL}/signup`, {
        headers: { Accept: 'application/json' },
        data: {
          firstName: testUsers.validUser.firstName,
          lastName: testUsers.validUser.lastName,
          email: process.env.EMAIL,
          password: process.env.PASSWORD,
          password2: process.env.PASSWORD,
        },
      });
      if (res.ok()) {
        expect(res.ok()).toBe(true);
      } else {
        const body = await res.json();
        const ok = body?.error === 'Email is in use' || (typeof body?.error === 'string' && body.error.includes('E11000 duplicate key error collection'));
        expect(ok).toBe(true);
      }
    };
    await use(createUserViaAPI);
  },
});

export const expect = test.expect;