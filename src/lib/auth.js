import dns from "node:dns";
import dnsPromises from "node:dns/promises";

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
  dnsPromises.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.BETTER_AUTH_DB_URL || "");
const db = client.db();

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  // Skip emailVerification and forgetPassword per examiner instructions
});