// import { betterAuth } from "better-auth";
// import { mongodbAdapter } from "better-auth/adapters/mongodb";
// import { MongoClient } from "mongodb";
// import dotenv from "dotenv";

// dotenv.config();

// const client = new MongoClient(process.env.MONGODB_URI);
// const db = client.db();

// export const auth = betterAuth({
//   database: mongodbAdapter(db),
//   secret: process.env.BETTER_AUTH_SECRET,
//   baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:5000',
//   trustedOrigins: ['http://localhost:3000',
//   'https://momentumx-client.vercel.app',
//   process.env.CLIENT_URL,],

//   socialProviders: {
//     google: {
//       clientId: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     },
//   },
//   emailAndPassword: {
//     enabled: true,
//     minPasswordLength: 6,
//     autoSignIn: false,
//   },
//   user: {
//     additionalFields: {
//       role: {
//         type: "string",
//         defaultValue: "user",
//       },
//       status: {
//         type: "string",
//         defaultValue: "active",
//       },
//     },
//   },
// });
// .......................................
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:5000',
  trustedOrigins: [
    'http://localhost:3000',
    'https://momentumx-client.vercel.app',
    process.env.CLIENT_URL,
  ],
  
  // ✅ ADD THIS COOKIE CONFIGURATION
advanced: {
  crossSubdomainCookies: {
    enabled: false,
  },
  defaultCookieAttributes: {
    secure: true,
    sameSite: 'none',
    partitioned: true, // for Chrome's CHIPS
  },
   useSecureCookies: true,
   disableCSRFCheck: true,
},

  socialProviders: {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectURI: `${process.env.BETTER_AUTH_URL}/api/auth/callback/google`,
  },
},
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
      },
      status: {
        type: "string",
        defaultValue: "active",
      },
    },
  },
});
