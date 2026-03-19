import { beforeAll, afterAll } from 'vitest';

// Mock database for testing
export const mockDb = {
  select: () => ({
    from: () => ({
      where: () => ({
        limit: () => Promise.resolve([]),
      }),
    }),
  }),
  insert: () => ({
    values: () => ({
      returning: () => Promise.resolve([]),
    }),
  }),
  update: () => ({
    set: () => ({
      where: () => ({
        returning: () => Promise.resolve([]),
      }),
    }),
  }),
  delete: () => ({
    where: () => Promise.resolve(),
  }),
};

beforeAll(() => {
  console.log('🧪 Starting test suite');
});

afterAll(() => {
  console.log('✅ Test suite completed');
});
