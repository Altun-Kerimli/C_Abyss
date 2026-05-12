import { defineConfig } from '@prisma/config';
import { config } from 'dotenv';

// Force Prisma to read the .env file before doing anything else
config();

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});