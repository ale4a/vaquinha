import { MONGO_DATABASE_NAME, MONGO_DATABASE_URI } from '@/config/settings';
import {
  CreateEntityDocument,
  EntityDocument,
  EntityState,
  LogLevel,
  UpdateEntityDocument,
} from '@/types/commons';
import { logError, logMessage } from '@/utils/log';
import { atomizeChangeset, diff } from 'json-diff-ts';
import {
  Db,
  Filter,
  InsertOneResult,
  MatchKeysAndValues,
  MongoClient,
  ObjectId,
  OptionalUnlessRequiredId,
  Sort,
} from 'mongodb';

export class MongoDbClient {
  private mongoDatabaseClient: Db | null = null;
  private reconnectionCbs: (() => void)[] = [];

  async connect() {
    if (!this.mongoDatabaseClient) {
      logMessage(LogLevel.INFO)(`mongo client connecting...`);
      const mongoClient = await MongoClient.connect(MONGO_DATABASE_URI);
      await mongoClient.connect();
      this.mongoDatabaseClient = mongoClient.db(MONGO_DATABASE_NAME);
      logMessage(LogLevel.INFO)(`mongo client connected`);
      for (const cb of this.reconnectionCbs) {
        cb?.();
      }
    } else {
      logMessage(LogLevel.INFO)(`mongo client already connected`);
    }
  }

  get __UNSAFE__mongoDatabaseClient() {
    return this.mongoDatabaseClient;
  }

  crud<T>(collection: string) {
    type EntityDoc = EntityDocument<T>;

    let mongoCollection =
      this.mongoDatabaseClient?.collection<EntityDoc>(collection);

    const connect = () => {
      mongoCollection =
        this.mongoDatabaseClient?.collection<EntityDoc>(collection);
      logMessage(LogLevel.INFO)(`collection "${collection}"connected`);
    };

    this.reconnectionCbs.push(connect);

    const updateOne = async (
      documentId: string,
      document: UpdateEntityDocument<T>,
      customer: null,
      withoutLog?: boolean
    ) => {
      const now = new Date();
      let documentToUpdate = { ...document } as MatchKeysAndValues<EntityDoc>;
      Object.keys(documentToUpdate).forEach(
        (key) =>
          documentToUpdate[key] === undefined && delete documentToUpdate[key]
      );
      if (Object.keys(documentToUpdate).length === 0) {
        return;
      }
      let updatedDocument;
      if (withoutLog) {
        documentToUpdate = { ...documentToUpdate, updatedAt: now };
        updatedDocument = await mongoCollection!.updateOne(
          { _id: new ObjectId(documentId) } as Filter<EntityDoc>,
          { $set: documentToUpdate }
        );
      } else {
        const oldDocument = await mongoCollection!.findOne({
          _id: new ObjectId(documentId),
        } as Filter<EntityDoc>);
        documentToUpdate = { ...documentToUpdate, updatedAt: now };
        updatedDocument = await mongoCollection!.updateOne(
          { _id: new ObjectId(documentId) } as Filter<EntityDoc>,
          { $set: documentToUpdate }
        );
        const newDocument = await mongoCollection!.findOne({
          _id: new ObjectId(documentId),
        } as Filter<EntityDoc>);
        const atomicChanges = atomizeChangeset(
          diff(oldDocument, newDocument)
        ).filter(({ path }) => path !== '$._id.buffer');
        const documentToUpdateWithLogs = {
          updatedAt: now,
          logs: [
            {
              changes: atomicChanges,
              timestamp: now.getTime(),
              customerUserId: '', // customer._id.toString(),
            },
            ...(newDocument?.logs ?? []),
          ],
        } as MatchKeysAndValues<EntityDoc>;
        await mongoCollection!.updateOne(
          { _id: new ObjectId(documentId) } as Filter<EntityDoc>,
          { $set: documentToUpdateWithLogs }
        );
      }
      if (!updatedDocument) {
        // throw new JkError(ErrorCode.ERR0303);
        throw new Error('error on update document');
      }
      return updatedDocument;
    };

    return {
      insertOne: async (
        // company: CompanyDocument,
        customer: null, // UserDocument | null,
        document: CreateEntityDocument<T>
      ): Promise<InsertOneResult> => {
        const now = new Date();
        const documentToInsert = {
          ...document,
          createdAt: now,
          updatedAt: now,
          // companyId: company._id.toString(),
          ownerUserId: '',
          // ownerUserId: !!customer?._id?.toString?.()
          //   ? customer._id.toString()
          //   : company.systemAdminUserId,
          state: EntityState.RELEASED,
          logs: [],
        } as OptionalUnlessRequiredId<EntityDoc>;
        const newDocument = await mongoCollection!.insertOne(documentToInsert);
        if (!newDocument) {
          logError(LogLevel.INFO)(
            JSON.stringify({ collection, /*company, */ customer, document }),
            'error on insertOne'
          );
          throw new Error('not created');
        }
        return newDocument;
      },
      findOne: async (
        documentId: string,
        options?: {
          projection?: { [key: string]: 1 };
        } | void
      ): Promise<EntityDoc> => {
        const { projection } = options || {};
        const document = await mongoCollection!.findOne(
          { _id: new ObjectId(documentId) } as Filter<EntityDoc>,
          { projection }
        );
        if (!document) {
          logError(LogLevel.INFO)(
            JSON.stringify({ collection, documentId }),
            'error on findOne'
          );
          throw new Error('not found');
        }
        return document as EntityDoc;
      },
      findOneByFilter: async (
        filter: Filter<EntityDoc>,
        options?: {
          sort?: Sort;
          projection?: { [key: string]: 1 };
        } | void
      ): Promise<EntityDoc> => {
        const { projection, sort } = options || {};
        const document = await mongoCollection!.findOne(filter, {
          projection,
          sort,
        });
        if (!document) {
          logError(LogLevel.INFO)(
            JSON.stringify({ collection, filter }),
            'error on findOneByFilter'
          );
          throw new Error('not found');
        }
        return document as EntityDoc;
      },
      findByFilter: async (
        filter: Filter<EntityDoc>,
        options?: {
          sort?: Sort;
          projection?: { [key: string]: 1 };
        } | void
      ): Promise<EntityDoc[]> => {
        const { projection, sort } = options || {};
        const document = await mongoCollection!
          .find(filter, { projection, sort })
          .toArray();
        if (!document) {
          logError(LogLevel.INFO)(
            JSON.stringify({ collection, filter, options }),
            'error on findByFilter'
          );
          throw new Error('not found');
        }
        return document as EntityDoc[];
      },
      // findPaginated: async (
      //   page: number,
      //   size: number,
      //   sort: SortType | undefined = {},
      //   filter: Filter<EntityDoc> | undefined,
      //   projection: {} | undefined
      // ): Promise<PaginatedDocuments<EntityDoc>> => {
      //   const totalElements = await mongoCollection.countDocuments(
      //     filter as Filter<Document>
      //   );
      //   const pages = Math.ceil(totalElements / size);
      //   const startFrom = (page - 1) * size;
      //
      //   const result = (await mongoCollection
      //     .find(filter as Filter<EntityDoc>, { projection })
      //     .sort(sort)
      //     .skip(startFrom)
      //     .limit(size)
      //     .toArray()) as EntityDoc[];
      //
      //   return { result, totalElements, page, size, sort, pages };
      // },
      updateOne,
      countDocuments: async (filter: Filter<EntityDoc>) => {
        return await mongoCollection!.countDocuments(filter);
      },
      deleteOne: (documentId: string, customer: null /*UserDocument*/) =>
        updateOne(
          documentId,
          { state: EntityState.ARCHIVED } as unknown as UpdateEntityDocument<T>,
          customer
        ),
      __UNSAFE__mongoCollection: () => mongoCollection,
      __UNSAFE__deleteOne: (documentId: string) => {
        return mongoCollection!.deleteOne({
          _id: new ObjectId(documentId),
        } as Filter<EntityDoc>);
      },
    };
  }
}
