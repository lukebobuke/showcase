/** @format */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
	try {
		console.log("Connecting to database...");

		// Create a test user
		const newUser = await prisma.user.create({
			data: {
				username: "testuser",
				email: "test@test.com",
				passwordHash: "hashedpassword123",
			},
		});
		console.log("Created test user:", newUser);

		// Retrieve all users
		const allUsers = await prisma.user.findMany();
		console.log("\nAll users in database:");
		console.log(allUsers);
	} catch (error) {
		console.error("Error:", error.message);
	} finally {
		// Disconnect from Prisma
		await prisma.$disconnect();
		console.log("\nDisconnected from database");
	}
}

main();
