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

	// ===== USER 1: Jazz Musician =====
	const user1 = await prisma.user.upsert({
		where: { email: "jazz@demo.com" },
		update: {},
		create: {
			username: "jazzmusician",
			email: "jazz@demo.com",
			passwordHash: hashedPassword,
		},
	});
	console.log(`✓ Created user: ${user1.username}`);

	// Create page for user 1
	const page1 = await prisma.page.upsert({
		where: { userId: user1.id },
		update: { theme: "ocean-light" },
		create: {
			userId: user1.id,
			theme: "ocean-light",
		},
	});
	console.log(`✓ Created page for ${user1.username} with theme: ${page1.theme}`);

	// Delete existing widgets for user 1 (to avoid duplicates on re-seed)
	await prisma.widget.deleteMany({ where: { pageId: page1.id } });

	// Create widgets for user 1
	await prisma.widget.createMany({
		data: [
			{
				pageId: page1.id,
				widgetType: "text",
				widgetData: {
					text: "Jazz pianist from Chicago. Available for weddings, corporate events, and intimate jazz club performances. Book me for your next event!",
				},
				position: 0,
			},
			{
				pageId: page1.id,
				widgetType: "links",
				widgetData: {
					links: [
						{ title: "Spotify", url: "https://spotify.com/artist/jazzmusician" },
						{ title: "Instagram", url: "https://instagram.com/jazzmusician" },
						{ title: "Official Website", url: "https://jazzmusician.com" },
					],
				},
				position: 1,
			},
			{
				pageId: page1.id,
				widgetType: "photos",
				widgetData: { images: [] },
				position: 2,
			},
			{
				pageId: page1.id,
				widgetType: "youtube",
				widgetData: { videoUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ" },
				position: 3,
			},
			{
				pageId: page1.id,
				widgetType: "tour_dates",
				widgetData: {
					dates: [
						{
							city: "Chicago, IL",
							venue: "Green Mill Jazz Club",
							date: "2026-03-15",
							ticketLink: "https://tickets.com/jazz-chicago",
							latitude: 41.8781,
							longitude: -87.6298,
						},
						{
							city: "New York, NY",
							venue: "Blue Note",
							date: "2026-04-20",
							ticketLink: "https://tickets.com/jazz-nyc",
							latitude: 40.7128,
							longitude: -74.006,
						},
						{
							city: "Los Angeles, CA",
							venue: "The Baked Potato",
							date: "2026-05-10",
							ticketLink: "https://tickets.com/jazz-la",
							latitude: 34.0522,
							longitude: -118.2437,
						},
					],
				},
				position: 4,
			},
		],
	});
	console.log(`✓ Created 5 widgets for ${user1.username}`);

	// ===== USER 2: Rock Band =====
	const user2 = await prisma.user.upsert({
		where: { email: "rock@demo.com" },
		update: {},
		create: {
			username: "rockband",
			email: "rock@demo.com",
			passwordHash: hashedPassword,
		},
	});
	console.log(`✓ Created user: ${user2.username}`);

	// Create page for user 2
	const page2 = await prisma.page.upsert({
		where: { userId: user2.id },
		update: { theme: "midnight-dark" },
		create: {
			userId: user2.id,
			theme: "midnight-dark",
		},
	});
	console.log(`✓ Created page for ${user2.username} with theme: ${page2.theme}`);

	// Delete existing widgets for user 2
	await prisma.widget.deleteMany({ where: { pageId: page2.id } });

	// Create widgets for user 2
	await prisma.widget.createMany({
		data: [
			{
				pageId: page2.id,
				widgetType: "text",
				widgetData: {
					text: "Hard rock band from Seattle. 🎸 High-energy performances that will blow your mind. New album 'Electric Thunder' out now!",
				},
				position: 0,
			},
			{
				pageId: page2.id,
				widgetType: "links",
				widgetData: {
					links: [
						{ title: "Apple Music", url: "https://music.apple.com/rockband" },
						{ title: "Bandcamp", url: "https://rockband.bandcamp.com" },
						{ title: "Twitter", url: "https://twitter.com/rockband" },
						{ title: "Merch Store", url: "https://rockband.merch.com" },
					],
				},
				position: 1,
			},
			{
				pageId: page2.id,
				widgetType: "photos",
				widgetData: { images: [] },
				position: 2,
			},
			{
				pageId: page2.id,
				widgetType: "youtube",
				widgetData: { videoUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ" },
				position: 3,
			},
			{
				pageId: page2.id,
				widgetType: "tour_dates",
				widgetData: {
					dates: [
						{
							city: "Seattle, WA",
							venue: "The Crocodile",
							date: "2026-03-01",
							ticketLink: "https://tickets.com/rock-seattle",
							latitude: 47.6062,
							longitude: -122.3321,
						},
						{
							city: "Portland, OR",
							venue: "Crystal Ballroom",
							date: "2026-03-08",
							ticketLink: "https://tickets.com/rock-portland",
							latitude: 45.5152,
							longitude: -122.6784,
						},
						{
							city: "San Francisco, CA",
							venue: "The Fillmore",
							date: "2026-03-15",
							ticketLink: "https://tickets.com/rock-sf",
							latitude: 37.7749,
							longitude: -122.4194,
						},
						{
							city: "Austin, TX",
							venue: "Stubb's BBQ",
							date: "2026-04-05",
							ticketLink: "https://tickets.com/rock-austin",
							latitude: 30.2672,
							longitude: -97.7431,
						},
					],
				},
				position: 4,
			},
		],
	});
	console.log(`✓ Created 5 widgets for ${user2.username}`);

	// ===== USER 3: Indie Artist =====
	const user3 = await prisma.user.upsert({
		where: { email: "indie@demo.com" },
		update: {},
		create: {
			username: "indieartist",
			email: "indie@demo.com",
			passwordHash: hashedPassword,
		},
	});
	console.log(`✓ Created user: ${user3.username}`);

	// Create page for user 3
	const page3 = await prisma.page.upsert({
		where: { userId: user3.id },
		update: { theme: "sunset-light" },
		create: {
			userId: user3.id,
			theme: "sunset-light",
		},
	});
	console.log(`✓ Created page for ${user3.username} with theme: ${page3.theme}`);

	// Delete existing widgets for user 3
	await prisma.widget.deleteMany({ where: { pageId: page3.id } });

	// Create widgets for user 3
	await prisma.widget.createMany({
		data: [
			{
				pageId: page3.id,
				widgetType: "text",
				widgetData: {
					text: "Indie folk singer-songwriter crafting intimate stories through acoustic melodies. ✨ My music explores themes of nature, love, and self-discovery.",
				},
				position: 0,
			},
			{
				pageId: page3.id,
				widgetType: "links",
				widgetData: {
					links: [
						{ title: "Spotify", url: "https://spotify.com/artist/indieartist" },
						{ title: "SoundCloud", url: "https://soundcloud.com/indieartist" },
						{ title: "Patreon", url: "https://patreon.com/indieartist" },
					],
				},
				position: 1,
			},
			{
				pageId: page3.id,
				widgetType: "photos",
				widgetData: { images: [] },
				position: 2,
			},
			{
				pageId: page3.id,
				widgetType: "youtube",
				widgetData: { videoUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ" },
				position: 3,
			},
			{
				pageId: page3.id,
				widgetType: "tour_dates",
				widgetData: {
					dates: [
						{
							city: "Nashville, TN",
							venue: "The Bluebird Cafe",
							date: "2026-03-22",
							ticketLink: "https://tickets.com/indie-nashville",
							latitude: 36.1627,
							longitude: -86.7816,
						},
						{
							city: "Asheville, NC",
							venue: "The Grey Eagle",
							date: "2026-04-12",
							ticketLink: "https://tickets.com/indie-asheville",
							latitude: 35.5951,
							longitude: -82.5515,
						},
						{
							city: "Boston, MA",
							venue: "Club Passim",
							date: "2026-05-01",
							ticketLink: "https://tickets.com/indie-boston",
							latitude: 42.3601,
							longitude: -71.0589,
						},
					],
				},
				position: 4,
			},
		],
	});
	console.log(`✓ Created 5 widgets for ${user3.username}`);

	console.log("\n🎉 Seed completed successfully!");
	console.log("\nDemo accounts created:");
	console.log("  - jazzmusician / password123 (ocean-light) - jazz@demo.com");
	console.log("  - rockband / password123 (midnight-dark) - rock@demo.com");
	console.log("  - indieartist / password123 (sunset-light) - indie@demo.com");
	console.log("\nEach user has all 5 widget types:");
	console.log("  ✓ Text widget");
	console.log("  ✓ Links widget");
	console.log("  ✓ Photos widget (empty)");
	console.log("  ✓ YouTube widget");
	console.log("  ✓ Tour Dates widget with map coordinates");
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
