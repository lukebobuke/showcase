/** @format */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
	adapter: new PrismaPg(pool),
});

async function main() {
	console.log("Starting seed...");

	// Hash password once to reuse for all users
	const hashedPassword = await bcrypt.hash("password123", 10);

	// Create demo user 1
	const user1 = await prisma.user.upsert({
		where: { email: "demo1@test.com" },
		update: {},
		create: {
			username: "demomusician1",
			email: "demo1@test.com",
			passwordHash: hashedPassword,
		},
	});
	console.log(`✓ Created user: ${user1.username}`);

	// Create or update page for user 1
	const page1 = await prisma.page.upsert({
		where: { userId: user1.id },
		update: { theme: "ocean-light" },
		create: {
			userId: user1.id,
			theme: "ocean-light",
		},
	});
	console.log(`✓ Created page for ${user1.username} with theme: ${page1.theme}`);

	// Create demo user 2
	const user2 = await prisma.user.upsert({
		where: { email: "demo2@test.com" },
		update: {},
		create: {
			username: "demomusician2",
			email: "demo2@test.com",
			passwordHash: hashedPassword,
		},
	});
	console.log(`✓ Created user: ${user2.username}`);

	// Create or update page for user 2
	const page2 = await prisma.page.upsert({
		where: { userId: user2.id },
		update: { theme: "midnight-dark" },
		create: {
			userId: user2.id,
			theme: "midnight-dark",
		},
	});
	console.log(`✓ Created page for ${user2.username} with theme: ${page2.theme}`);

	// Create demo user 3
	const user3 = await prisma.user.upsert({
		where: { email: "demo3@test.com" },
		update: {},
		create: {
			username: "demomusician3",
			email: "demo3@test.com",
			passwordHash: hashedPassword,
		},
	});
	console.log(`✓ Created user: ${user3.username}`);

	// Create or update page for user 3
	const page3 = await prisma.page.upsert({
		where: { userId: user3.id },
		update: { theme: "sunset-light" },
		create: {
			userId: user3.id,
			theme: "sunset-light",
		},
	});
	console.log(`✓ Created page for ${user3.username} with theme: ${page3.theme}`);

	console.log("\n🎉 Seed completed successfully!");
	console.log("\nDemo accounts created:");
	console.log("  - demomusician1 / password123 (ocean-light)");
	console.log("  - demomusician2 / password123 (midnight-dark)");
	console.log("  - demomusician3 / password123 (sunset-light)");
}

main()
	.catch((e) => {
		console.error("Error seeding database:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
		await pool.end();
	});
