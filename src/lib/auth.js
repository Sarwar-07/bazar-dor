import dns from "node:dns";
import dnsPromises from "node:dns/promises";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

// Force Node.js runtime to use Google & Cloudflare DNS for SRV record lookups
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
  dnsPromises.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

const client = new MongoClient(process.env.BETTER_AUTH_DB_URL || "");
const db = client.db("bazardor");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
});