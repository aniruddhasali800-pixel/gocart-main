import 'dotenv/config';

// Inject fallbacks for Render unconditionally BEFORE other imports run
process.env.CLERK_SECRET_KEY = "sk_test_aDTvGHXAx0llwqHbDJ0DNX9FC4JpXvlFCMTNPZc3Yz";
process.env.CLERK_PUBLISHABLE_KEY = "pk_test_ZGVjaWRpbmctZG9nZmlzaC00MC5jbGVyay5hY2NvdW50cy5kZXYk";
process.env.MONGODB_URI = "mongodb://aniruddhasali800snitin:Aniruddha899@ac-poj8ygs-shard-00-00.iltvicl.mongodb.net:27017,ac-poj8ygs-shard-00-01.iltvicl.mongodb.net:27017,ac-poj8ygs-shard-00-02.iltvicl.mongodb.net:27017/gocart?ssl=true&authSource=admin&retryWrites=true&w=majority";

export default {};
