export const DynamoDB = {
  DocumentClient: jest.fn().mockImplementation(() => ({
    put: jest.fn(args => ({
      promise: jest.fn().mockResolvedValue({
        Item: args.Item,
      }),
    })),
    get: jest.fn(() => ({
      promise: jest.fn().mockResolvedValue({
        Item: null,
      }),
    })),
    delete: jest.fn(() => ({
      promise: jest.fn().mockResolvedValue({}),
    })),
    update: jest.fn(() => ({
      promise: jest.fn().mockResolvedValue({}),
    })),
    query: jest.fn(() => ({
      promise: jest.fn().mockResolvedValue({
        Items: [],
      }),
    })),
    scan: jest.fn(() => ({
      promise: jest.fn().mockResolvedValue({
        Items: [],
      }),
    })),
    transactGet: jest.fn(() => ({
      promise: jest.fn().mockResolvedValue({}),
    })),
    transactWrite: jest.fn(() => ({
      promise: jest.fn().mockResolvedValue({}),
    })),
    batchGet: jest.fn(() => ({
      promise: jest.fn().mockResolvedValue({}),
    })),
    batchWrite: jest.fn(() => ({
      promise: jest.fn().mockResolvedValue({}),
    })),
  })),
}
