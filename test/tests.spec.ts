import { TableClient } from '../src'

beforeEach(() => {
  jest.clearAllMocks()
})

const client = new TableClient({
  tableName: 'test',
})

test('put', async () => {
  await client.put({
    Item: {
      string: 'hello',
    },
  })

  expect(client.documentClient.put).toHaveBeenCalledWith({
    TableName: 'test',
    Item: {
      string: 'hello',
    },
  })
})

test('get', async () => {
  await client.get({
    Key: {
      PK: '123',
      SK: '123',
    },
  })

  expect(client.documentClient.get).toHaveBeenCalledWith({
    TableName: 'test',
    Key: {
      PK: '123',
      SK: '123',
    },
  })
})

test('update', async () => {
  await client.update({
    Key: {
      PK: '123',
    },
    UpdateExpression: 'SET blah = :blah',
    ExpressionAttributeValues: {
      ':blah': 'blah',
    },
  })

  expect(client.documentClient.update).toHaveBeenCalledWith({
    TableName: 'test',
    Key: {
      PK: '123',
    },
    UpdateExpression: 'SET blah = :blah',
    ExpressionAttributeValues: {
      ':blah': 'blah',
    },
  })
})

test('delete', async () => {
  await client.delete({
    Key: {
      PK: '123',
    },
  })

  expect(client.documentClient.delete).toHaveBeenCalledWith({
    TableName: 'test',
    Key: {
      PK: '123',
    },
  })
})

test('query', async () => {
  await client.query({
    IndexName: 'GSI1',
    KeyConditionExpression: 'PK = :pk',
    ExpressionAttributeValues: {
      ':pk': '123',
    },
  })

  expect(client.documentClient.query).toHaveBeenCalledWith({
    TableName: 'test',
    IndexName: 'GSI1',
    KeyConditionExpression: 'PK = :pk',
    ExpressionAttributeValues: {
      ':pk': '123',
    },
  })
})

test('scan', async () => {
  await client.scan({
    ProjectionExpression: '#yr, title, info.rating',
    FilterExpression: '#yr between :start_yr and :end_yr',
    ExpressionAttributeNames: {
      '#yr': 'year',
    },
    ExpressionAttributeValues: {
      ':start_yr': 1950,
      ':end_yr': 1959,
    },
  })

  expect(client.documentClient.scan).toHaveBeenCalledWith({
    TableName: 'test',
    ProjectionExpression: '#yr, title, info.rating',
    FilterExpression: '#yr between :start_yr and :end_yr',
    ExpressionAttributeNames: {
      '#yr': 'year',
    },
    ExpressionAttributeValues: {
      ':start_yr': 1950,
      ':end_yr': 1959,
    },
  })
})

test('transactGet', async () => {
  await client.transactGet([
    {
      Key: {
        PK: '123',
      },
    },
    {
      Key: {
        PK: '123',
      },
    },
  ])

  expect(client.documentClient.transactGet).toHaveBeenCalledWith({
    TransactItems: [
      {
        Get: {
          TableName: 'test',
          Key: {
            PK: '123',
          },
        },
      },
      {
        Get: {
          TableName: 'test',
          Key: {
            PK: '123',
          },
        },
      },
    ],
  })
})

test('transactWrite', async () => {
  await client.transactWrite([
    {
      Put: {
        Item: {
          PK: '123',
        },
      },
    },
    {
      Delete: {
        Key: {
          PK: '123',
        },
      },
    },
    {
      Update: {
        Key: {
          PK: '123',
        },
        UpdateExpression: '',
      },
    },
  ])

  expect(client.documentClient.transactWrite).toHaveBeenCalledWith({
    TransactItems: [
      {
        Put: {
          TableName: 'test',
          Item: {
            PK: '123',
          },
        },
      },
      {
        Delete: {
          TableName: 'test',
          Key: {
            PK: '123',
          },
        },
      },
      {
        Update: {
          TableName: 'test',
          Key: {
            PK: '123',
          },
          UpdateExpression: '',
        },
      },
    ],
  })
})

test('batchGet', async () => {
  await client.batchGet({
    RequestItems: {
      Keys: [
        {
          PK: '123',
        },
        {
          PK: '456',
        },
      ],
    },
  })

  expect(client.documentClient.batchGet).toHaveBeenCalledWith({
    RequestItems: {
      test: {
        Keys: [
          {
            PK: '123',
          },
          {
            PK: '456',
          },
        ],
      },
    },
  })
})
test('batchWrite', async () => {
  await client.batchWrite({
    RequestItems: [
      {
        PutRequest: {
          Item: {
            PK: '123',
          },
        },
      },
      {
        DeleteRequest: {
          Key: {
            PK: '123',
          },
        },
      },
    ],
  })

  expect(client.documentClient.batchWrite).toHaveBeenCalledWith({
    RequestItems: {
      test: [
        {
          PutRequest: {
            Item: {
              PK: '123',
            },
          },
        },
        {
          DeleteRequest: {
            Key: {
              PK: '123',
            },
          },
        },
      ],
    },
  })
})
