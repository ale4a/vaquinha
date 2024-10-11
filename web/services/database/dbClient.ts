import { MongoDbClient } from './MongoDbClient';

export const dbClient = new MongoDbClient();

dbClient.connect();
