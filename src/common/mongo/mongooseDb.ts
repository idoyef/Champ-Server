import mongoose from 'mongoose';

export class MongooseDb {
  mongo?: mongoose.Mongoose;

  constructor(private connectionString: string) {}

  async connect() {
    if (mongoose.connection.readyState === 0) {
      this.mongo = await mongoose.connect(this.connectionString);
    }
  }

  async disconnect() {
    if (this.mongo) {
      await this.mongo.disconnect();
    }
  }
}
