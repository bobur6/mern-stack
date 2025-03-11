import mongoose from 'mongoose';

mongoose.set('strictQuery', false);

export const connectDB = async () => {
  try {
    console.log('🔥 Connecting to MongoDB...'); // ✅ Добавляем лог
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};
