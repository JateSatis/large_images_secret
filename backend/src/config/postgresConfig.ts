import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config();

const datasourceUrl = process.env.DATABASE_URL;

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: datasourceUrl,
    },
  },
});

export async function connectWithRetry() {
  const maxRetries = 10; // Maximum number of retries
  const retryDelay = 5000; // Delay between retries in milliseconds (5 seconds)

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(
        `Attempting to connect to the database (Attempt ${attempt})...`
      );
      await prisma.$connect(); // Attempt to connect to the database
      console.log("Database connection established successfully.");
      break; // Exit loop if connection is successful
    } catch (error) {
      console.error(`Database connection failed: ${error.message}`);
      if (attempt < maxRetries) {
        console.log(`Retrying in ${retryDelay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay)); // Wait before retrying
      } else {
        console.error("Max retries reached. Exiting...");
        process.exit(1); // Exit process if all retries fail
      }
    }
  }
}

// Initialize the database connection with retry mechanism
// connectWithRetry();
