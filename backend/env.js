import 'dotenv/config';

// Inject fallbacks for Render unconditionally BEFORE other imports run
process.env.CLERK_SECRET_KEY = "sk_test_6aNrVlOHK1jD7IhAnkumQDjdn2adtrQMutv3Fm9998";
process.env.CLERK_PUBLISHABLE_KEY = "pk_test_YWxsb3dlZC1pbXBhbGEtNzAuY2xlcmsuYWNjb3VudHMuZGV2JA";
process.env.MONGODB_URI = "mongodb://aniruddhasali800snitin:Aniruddha899@ac-poj8ygs-shard-00-00.iltvicl.mongodb.net:27017,ac-poj8ygs-shard-00-01.iltvicl.mongodb.net:27017,ac-poj8ygs-shard-00-02.iltvicl.mongodb.net:27017/gocart?ssl=true&authSource=admin&retryWrites=true&w=majority";

export default {};
