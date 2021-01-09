import { DynamoDB } from 'aws-sdk'

export interface TableClientOptions
  extends DynamoDB.DocumentClient.DocumentClientOptions,
    DynamoDB.Types.ClientConfiguration {
  tableName: string
}

export class TableClient<CommonAttributes extends Record<string, any>> {
  tableName: string
  documentClient: DynamoDB.DocumentClient

  constructor({ tableName, ...opts }: TableClientOptions) {
    this.tableName = tableName
    this.documentClient = new DynamoDB.DocumentClient(opts)
  }

  async get<T extends CommonAttributes>(
    args: Omit<DynamoDB.DocumentClient.GetItemInput, 'TableName'>
  ): Promise<GetItemOutput<T>> {
    return this.documentClient
      .get({
        TableName: this.tableName,
        ...args,
      })
      .promise()
      .then(res => ({
        ...res,
        Item: res.Item as T,
      }))
  }

  async put<T extends CommonAttributes>(
    args: Omit<DynamoDB.DocumentClient.PutItemInput, 'TableName'>
  ): Promise<PutItemOutput<T>> {
    return this.documentClient
      .put({
        TableName: this.tableName,
        ...args,
      })
      .promise()
      .then(res => ({
        ...res,
        Attributes: res.Attributes as T,
      }))
  }

  async delete<T extends CommonAttributes>(
    args: Omit<DynamoDB.DocumentClient.DeleteItemInput, 'TableName'>
  ): Promise<DeleteItemOutput<T>> {
    return this.documentClient
      .delete({
        TableName: this.tableName,
        ...args,
      })
      .promise()
      .then(res => ({
        ...res,
        Attributes: res.Attributes as T,
      }))
  }

  async query<T extends CommonAttributes>(
    args: Omit<DynamoDB.DocumentClient.QueryInput, 'TableName'>
  ): Promise<QueryOutput<T>> {
    return this.documentClient
      .query({
        TableName: this.tableName,
        ...args,
      })
      .promise()
      .then(res => ({
        ...res,
        Items: res.Items as T[],
      }))
  }

  async scan<T extends CommonAttributes>(
    args: Omit<DynamoDB.DocumentClient.ScanInput, 'TableName'>
  ): Promise<ScanOutput<T>> {
    return this.documentClient
      .scan({
        TableName: this.tableName,
        ...args,
      })
      .promise()
      .then(res => ({
        ...res,
        Items: res.Items as T[],
      }))
  }

  async update<T extends CommonAttributes>(
    args: Omit<DynamoDB.DocumentClient.UpdateItemInput, 'TableName'>
  ): Promise<UpdateItemOutput<T>> {
    return this.documentClient
      .update({
        TableName: this.tableName,
        ...args,
      })
      .promise()
      .then(res => ({
        ...res,
        Attributes: res.Attributes as T,
      }))
  }

  async transactGet<T extends CommonAttributes>(
    args: Array<Omit<DynamoDB.DocumentClient.Get, 'TableName'>>
  ): Promise<TransactGetItemsOutput<T>> {
    return (
      (this.documentClient
        .transactGet({
          TransactItems: args.map(arg => ({
            Get: {
              TableName: this.tableName,
              ...arg,
            },
          })),
        })
        // we could map over the results and cast each item individually as T,
        // but that's too much runtime overhead just to satisfy typescript
        .promise() as any) as Promise<TransactGetItemsOutput<T>>
    )
  }

  async transactWrite(args: TransactWriteItem[]) {
    return this.documentClient
      .transactWrite({
        TransactItems: args.map(arg => ({
          ...arg,
          ConditionCheck: arg.ConditionCheck
            ? { TableName: this.tableName, ...arg.ConditionCheck }
            : undefined,
          Put: arg.Put ? { TableName: this.tableName, ...arg.Put } : undefined,
          Delete: arg.Delete
            ? { TableName: this.tableName, ...arg.Delete }
            : undefined,
          Update: arg.Update
            ? { TableName: this.tableName, ...arg.Update }
            : undefined,
        })),
      })
      .promise()
  }

  async batchGet<T extends CommonAttributes>({
    RequestItems,
    ...args
  }: Omit<DynamoDB.DocumentClient.BatchGetItemInput, 'RequestItems'> & {
    RequestItems: DynamoDB.DocumentClient.KeysAndAttributes
  }): Promise<BatchGetItemOutput<T>> {
    return this.documentClient
      .batchGet({
        ...args,
        RequestItems: {
          [this.tableName]: RequestItems,
        },
      })
      .promise()
      .then(({ Responses, ...res }) => ({
        ...res,
        Items: Responses?.[this.tableName] as T[],
      }))
  }

  async batchWrite<T extends CommonAttributes>({
    RequestItems,
    ...args
  }: Omit<DynamoDB.DocumentClient.BatchWriteItemInput, 'RequestItems'> & {
    RequestItems: WriteRequest<T>[]
  }): Promise<BatchWriteItemOutput<T>> {
    return this.documentClient
      .batchWrite({
        ...args,
        RequestItems: {
          [this.tableName]: RequestItems,
        },
      })
      .promise()
      .then(({ UnprocessedItems, ...res }) => ({
        ...res,
        UnprocessedItems: UnprocessedItems?.[this.tableName] as T[],
      }))
  }
}

// better DynamoDB types that use generics

export interface GetItemOutput<T>
  extends DynamoDB.DocumentClient.GetItemOutput {
  Item?: T
}

export interface PutItemOutput<T>
  extends DynamoDB.DocumentClient.PutItemOutput {
  Attributes?: T
}

export interface UpdateItemOutput<T>
  extends DynamoDB.DocumentClient.UpdateItemOutput {
  Attributes?: T
}

export interface DeleteItemOutput<T>
  extends DynamoDB.DocumentClient.DeleteItemOutput {
  Attributes?: T
}

export interface QueryOutput<T> extends DynamoDB.DocumentClient.QueryOutput {
  Items?: T[]
}

export interface BatchGetItemOutput<T>
  extends Omit<DynamoDB.DocumentClient.BatchGetItemOutput, 'Responses'> {
  Items?: T[]
}

export interface WriteRequest<T> {
  PutRequest?: {
    Item: T
  }
  DeleteRequest?: {
    Key: DynamoDB.DocumentClient.Key
  }
}

export interface BatchWriteItemOutput<T>
  extends Omit<
    DynamoDB.DocumentClient.BatchWriteItemOutput,
    'UnprocessedItems'
  > {
  UnprocessedItems?: WriteRequest<T>[]
}

export interface ScanOutput<T> extends DynamoDB.DocumentClient.ScanOutput {
  Items?: T[]
}

export interface TransactGetItemsOutput<T>
  extends DynamoDB.DocumentClient.TransactGetItemsOutput {
  Responses?: Array<{ Item?: T }>
}

export interface TransactWriteItem {
  /**
   * A request to perform a check item operation.
   */
  ConditionCheck?: Omit<DynamoDB.DocumentClient.ConditionCheck, 'TableName'>
  /**
   * A request to perform a PutItem operation.
   */
  Put?: Omit<DynamoDB.DocumentClient.Put, 'TableName'>
  /**
   * A request to perform a DeleteItem operation.
   */
  Delete?: Omit<DynamoDB.DocumentClient.Delete, 'TableName'>
  /**
   * A request to perform an UpdateItem operation.
   */
  Update?: Omit<DynamoDB.DocumentClient.Update, 'TableName'>
}
