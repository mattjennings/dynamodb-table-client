# dynamodb-table-client

A DocumentClient wrapper for single table design and better typescript support.

For the most part, the API is the same as DocumentClient aside from having to provide the TableName for each request.
`batchGet` and `batchWrite` have a slightly different API because they don't need to be concerned with multiple tables.

# Install

```bash
npm install dynamodb-table-client
```

# Usage

```typescript
import { TableClient } from 'dynamodb-table-client';

// common attributes between all items
interface DynamoDBItem {
  // this is where you would type your Key and GSI schemas
  PK: string;
  SK: string;
  GSI1PK?: string;
  GSI1SK?: string;

  // but you could use it for common meta atts as well
  created: string;
}

const tableClient = new TableClient<DynamoDBItem>({
  tableName: `my-table`,
  region: `us-east-1`,
});

interface Note extends DynamoDBItem {
  title: string;
}

await tableClient.put<Note>({
  Item: {
    PK: 'NOTE#1',
    SK: 'META',
    created: new Date().toISOString(),
    title: 'My Note',
  },
});

const note = await tableClient.get<Note>({
  Key: {
    PK: 'NOTE#1',
    SK: 'META',
  },
});
```
