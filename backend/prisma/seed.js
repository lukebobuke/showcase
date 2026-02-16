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

	// ===== USER 1: Jaco Pastorius =====
	const user1 = await prisma.user.upsert({
		where: { email: "jaco@demo.com" },
		update: {},
		create: {
			username: "jacoPastorius",
			email: "jaco@demo.com",
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
					content:
						"Jaco Pastorius - Revolutionary bassist and composer who transformed the possibilities of the electric bass. Pioneering fusion musician whose self-titled debut album remains a cornerstone of modern jazz. Known for technical virtuosity, innovative use of effects, and sophisticated harmonic sensibilities. His influence spans generations of musicians across rock, funk, jazz, and fusion genres. A true visionary who pushed musical boundaries and redefined what the bass could do.",
				},
				position: 0,
			},
			{
				pageId: page1.id,
				widgetType: "links",
				widgetData: {
					links: [
						{ label: "Spotify", url: "https://open.spotify.com/artist/6xrNWe3tBqJwPk0OLz5bxq" },
						{ label: "AllMusic", url: "https://www.allmusic.com/artist/jaco-pastorius-mn0000851881" },
						{ label: "Discography", url: "https://en.wikipedia.org/wiki/Jaco_Pastorius" },
					],
				},
				position: 1,
			},
			{
				pageId: page1.id,
				widgetType: "photos",
				widgetData: {
					images: [
						"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
						"https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=300&fit=crop",
						"https://images.unsplash.com/photo-1511344808352-52f8a94a5d69?w=400&h=300&fit=crop",
						"https://images.unsplash.com/photo-1485579149c0-123123?w=400&h=300&fit=crop",
					],
				},
				position: 2,
			},
			{
				pageId: page1.id,
				widgetType: "youtube",
				widgetData: { videoUrl: "https://www.youtube.com/watch?v=BMUXndzx3Zw" },
				position: 3,
			},
			{
				pageId: page1.id,
				widgetType: "tour_dates",
				widgetData: {
					dates: [
						{
							city: "Miami, FL",
							venue: "Jaco Legacy Concert",
							date: "2026-03-15",
							ticketLink: "https://jacolegacy.org/tickets",
							latitude: 25.7617,
							longitude: -80.1918,
						},
						{
							city: "New York, NY",
							venue: "Blue Note Jazz Club",
							date: "2026-04-20",
							ticketLink: "https://bluenotejazz.com/tickets",
							latitude: 40.7308,
							longitude: -74.0001,
						},
						{
							city: "Los Angeles, CA",
							venue: "The Baked Potato",
							date: "2026-05-10",
							ticketLink: "https://thebakedpotato.com/tickets",
							latitude: 34.1478,
							longitude: -118.3805,
						},
						{
							city: "San Francisco, CA",
							venue: "SFJAZZ Center",
							date: "2026-06-05",
							ticketLink: "https://sfjazz.org/tickets",
							latitude: 37.7764,
							longitude: -122.4212,
						},
						{
							city: "New Orleans, LA",
							venue: "Preservation Hall",
							date: "2026-07-12",
							ticketLink: "https://preservationhall.com/tickets",
							latitude: 29.9584,
							longitude: -90.0644,
						},
					],
				},
				position: 4,
			},
		],
	});
	console.log(`✓ Created 5 widgets for ${user1.username}`);

	// ===== USER 2: Megadeth =====
	const user2 = await prisma.user.upsert({
		where: { email: "megadeth@demo.com" },
		update: {},
		create: {
			username: "megadeth",
			email: "megadeth@demo.com",
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
					content:
						"Megadeth - Legendary thrash metal band founded by Dave Mustaine, bringing machine-precise technical mastery and socially conscious lyrics since 1983. Known for groundbreaking albums including 'Peace Sells... but Who's Buying?', 'Rust in Peace', and 'Countdown to Extinction'. Featuring intricate guitar work, complex compositions, and powerful performances. A cornerstone of the thrash metal movement with a legacy spanning four decades.",
				},
				position: 0,
			},
			{
				pageId: page2.id,
				widgetType: "links",
				widgetData: {
					links: [
						{ label: "Spotify", url: "https://open.spotify.com/artist/6mdiAmATAx73kdxOsXNDjB" },
						{ label: "Official Site", url: "https://www.megadeth.com" },
						{ label: "YouTube", url: "https://www.youtube.com/@megadeth" },
						{ label: "Merch Store", url: "https://megadeth.shop" },
					],
				},
				position: 1,
			},
			{
				pageId: page2.id,
				widgetType: "photos",
				widgetData: {
					images: [
						"https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=300&fit=crop",
						"https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&h=300&fit=crop",
						"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
						"https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=400&h=300&fit=crop",
					],
				},
				position: 2,
			},
			{
				pageId: page2.id,
				widgetType: "youtube",
				widgetData: { videoUrl: "https://www.youtube.com/watch?v=Dh-ULbQrJ2E" },
				position: 3,
			},
			{
				pageId: page2.id,
				widgetType: "tour_dates",
				widgetData: {
					dates: [
						{
							city: "Los Angeles, CA",
							venue: "Cryptic Rock Festival",
							date: "2026-03-01",
							ticketLink: "https://crypticrockfest.com/tickets",
							latitude: 34.0522,
							longitude: -118.2437,
						},
						{
							city: "New York, NY",
							venue: "Madison Square Garden",
							date: "2026-03-15",
							ticketLink: "https://www.msg.com/tickets",
							latitude: 40.7505,
							longitude: -73.9934,
						},
						{
							city: "Chicago, IL",
							venue: "United Center",
							date: "2026-04-05",
							ticketLink: "https://www.unitedcenter.com/tickets",
							latitude: 41.8806,
							longitude: -87.6742,
						},
						{
							city: "London, UK",
							venue: "The O2 Arena",
							date: "2026-04-20",
							ticketLink: "https://www.theo2.co.uk/tickets",
							latitude: 51.5076,
							longitude: -0.1276,
						},
						{
							city: "Tokyo, Japan",
							venue: "Nippon Budokan",
							date: "2026-05-15",
							ticketLink: "https://www.nipponbudokan.or.jp/tickets",
							latitude: 35.6762,
							longitude: 139.7505,
						},
					],
				},
				position: 4,
			},
		],
	});
	console.log(`✓ Created 5 widgets for ${user2.username}`);

	// ===== USER 3: Norah Jones =====
	const user3 = await prisma.user.upsert({
		where: { email: "norah@demo.com" },
		update: {},
		create: {
			username: "norahjones",
			email: "norah@demo.com",
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
					content:
						"Norah Jones - Grammy Award-winning singer-songwriter blending soul, jazz, country, and pop into a unique sound. Known for her soulful voice, sophisticated piano playing, and emotionally resonant songwriting. Her debut album 'Come Away with Me' achieved unprecedented success. Influences include Billie Holiday and Joni Mitchell. Creating intimate, timeless music that connects deeply with listeners worldwide.",
				},
				position: 0,
			},
			{
				pageId: page3.id,
				widgetType: "links",
				widgetData: {
					links: [
						{ label: "Spotify", url: "https://open.spotify.com/artist/1FmwJVDKYwB3LVHmCQH47N" },
						{ label: "Official Site", url: "https://www.norahjones.com" },
						{ label: "YouTube", url: "https://www.youtube.com/@NorahJones" },
						{ label: "Instagram", url: "https://www.instagram.com/norahjones/" },
					],
				},
				position: 1,
			},
			{
				pageId: page3.id,
				widgetType: "photos",
				widgetData: {
					images: [
						"https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop",
						"https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=300&fit=crop",
						"https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=400&h=300&fit=crop",
						"https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&h=300&fit=crop",
					],
				},
				position: 2,
			},
			{
				pageId: page3.id,
				widgetType: "youtube",
				widgetData: { videoUrl: "https://www.youtube.com/watch?v=tUlQaLG65aU" },
				position: 3,
			},
			{
				pageId: page3.id,
				widgetType: "tour_dates",
				widgetData: {
					dates: [
						{
							city: "Nashville, TN",
							venue: "Ryman Auditorium",
							date: "2026-03-22",
							ticketLink: "https://www.ryman.com/tickets",
							latitude: 36.1627,
							longitude: -86.7816,
						},
						{
							city: "New York, NY",
							venue: "Carnegie Hall",
							date: "2026-04-12",
							ticketLink: "https://www.carnegiehall.org/tickets",
							latitude: 40.7683,
							longitude: -73.9795,
						},
						{
							city: "Los Angeles, CA",
							venue: "Greek Theatre",
							date: "2026-04-28",
							ticketLink: "https://www.greektheatrela.com/tickets",
							latitude: 34.118,
							longitude: -118.2437,
						},
						{
							city: "London, UK",
							venue: "Royal Albert Hall",
							date: "2026-05-08",
							ticketLink: "https://www.royalalberthall.com/tickets",
							latitude: 51.501,
							longitude: -0.1761,
						},
						{
							city: "Paris, France",
							venue: "L'Olympiano Bruno Coquatrix",
							date: "2026-05-25",
							ticketLink: "https://www.olympibruno.com/tickets",
							latitude: 48.832,
							longitude: 2.3385,
						},
					],
				},
				position: 4,
			},
		],
	});
	console.log(`✓ Created 5 widgets for ${user3.username}`);

	console.log("\n🎉 Seed completed successfully!");
	console.log("\n✨ Demo accounts created with polished content:");
	console.log("  - jacoPastorius / password123 (ocean-light) - jaco@demo.com");
	console.log("    Revolutionary fusion bassist with iconic performances and legacy");
	console.log("  - megadeth / password123 (midnight-dark) - megadeth@demo.com");
	console.log("    Legendary thrash metal band with four decades of powerful music");
	console.log("  - norahjones / password123 (sunset-light) - norah@demo.com");
	console.log("    Grammy-winning singer-songwriter with soulful, sophisticated sound");
	console.log("\n📦 Each user has complete profiles:");
	console.log("  ✓ Professional bio text");
	console.log("  ✓ 3-4 social/streaming links");
	console.log("  ✓ 4 photo gallery images");
	console.log("  ✓ YouTube performance video");
	console.log("  ✓ 5 tour dates with map coordinates");
	console.log("\n🌐 Visit their pages at:");
	console.log("  http://localhost:5173/jacoPastorius");
	console.log("  http://localhost:5173/megadeth");
	console.log("  http://localhost:5173/norahjones");
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
