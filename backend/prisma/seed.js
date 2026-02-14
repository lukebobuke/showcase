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
					text: "Award-winning jazz pianist and composer based in Chicago. With over 15 years of experience performing at prestigious venues worldwide, I bring sophisticated musicality and timeless elegance to every performance. Specializing in bebop, cool jazz, and contemporary interpretations of classic standards. Available for weddings, corporate events, jazz festivals, and intimate club performances.",
				},
				position: 0,
			},
			{
				pageId: page1.id,
				widgetType: "links",
				widgetData: {
					links: [
						{ title: "Spotify", url: "https://open.spotify.com/artist/jazzmusician" },
						{ title: "Instagram", url: "https://instagram.com/jazzpianist" },
						{ title: "Book Me", url: "https://jazzmusician.com/booking" },
					],
				},
				position: 1,
			},
			{
				pageId: page1.id,
				widgetType: "photos",
				widgetData: {
					images: [
						"https://picsum.photos/seed/jazz1/800/600",
						"https://picsum.photos/seed/jazz2/800/600",
						"https://picsum.photos/seed/jazz3/800/600",
						"https://picsum.photos/seed/jazz4/800/600",
					],
				},
				position: 2,
			},
			{
				pageId: page1.id,
				widgetType: "youtube",
				widgetData: { videoUrl: "https://www.youtube.com/watch?v=vmDDOFXSgAs" },
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
							ticketLink: "https://greenmilljazz.com/tickets",
							latitude: 41.9614,
							longitude: -87.6597,
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
					text: "THUNDER STRIKE - Hard rock band from Seattle bringing raw power and electrifying energy to stages worldwide. 🎸⚡ Our new album 'Electric Thunder' features chart-topping single 'Storm Rising.' We blend classic rock influences with modern edge, delivering high-octane performances that leave audiences breathless. From intimate club shows to festival main stages, we bring the thunder!",
				},
				position: 0,
			},
			{
				pageId: page2.id,
				widgetType: "links",
				widgetData: {
					links: [
						{ title: "Spotify", url: "https://open.spotify.com/artist/thunderstrike" },
						{ title: "Apple Music", url: "https://music.apple.com/artist/thunderstrike" },
						{ title: "YouTube", url: "https://youtube.com/@thunderstrike" },
						{ title: "Merch Store", url: "https://thunderstrike.store" },
					],
				},
				position: 1,
			},
			{
				pageId: page2.id,
				widgetType: "photos",
				widgetData: {
					images: [
						"https://picsum.photos/seed/rock1/800/600",
						"https://picsum.photos/seed/rock2/800/600",
						"https://picsum.photos/seed/rock3/800/600",
						"https://picsum.photos/seed/rock4/800/600",
					],
				},
				position: 2,
			},
			{
				pageId: page2.id,
				widgetType: "youtube",
				widgetData: { videoUrl: "https://www.youtube.com/watch?v=kXYiU_JCYtU" },
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
							ticketLink: "https://thecrocodile.com/tickets",
							latitude: 47.6415,
							longitude: -122.3496,
						},
						{
							city: "Portland, OR",
							venue: "Crystal Ballroom",
							date: "2026-03-08",
							ticketLink: "https://crystalballroom.com/tickets",
							latitude: 45.5202,
							longitude: -122.6808,
						},
						{
							city: "San Francisco, CA",
							venue: "The Fillmore",
							date: "2026-03-15",
							ticketLink: "https://thefillmore.com/tickets",
							latitude: 37.7833,
							longitude: -122.4331,
						},
						{
							city: "Denver, CO",
							venue: "Red Rocks Amphitheatre",
							date: "2026-03-28",
							ticketLink: "https://redrocksonline.com/tickets",
							latitude: 39.6655,
							longitude: -105.2053,
						},
						{
							city: "Austin, TX",
							venue: "Stubb's BBQ",
							date: "2026-04-05",
							ticketLink: "https://stubbsaustin.com/tickets",
							latitude: 30.2672,
							longitude: -97.7385,
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
					text: "Luna Rivers - Singer-songwriter weaving intimate stories through acoustic melodies. ✨🌙 My music is a journey through forests, heartbreak, healing, and the quiet magic of everyday moments. Influenced by folk traditions and contemporary indie sounds, I create spaces for reflection and connection. Currently touring coffee houses and small venues across the country, bringing warmth and vulnerability to every performance. New EP 'Whispers in the Woods' available now on all platforms.",
				},
				position: 0,
			},
			{
				pageId: page3.id,
				widgetType: "links",
				widgetData: {
					links: [
						{ title: "Spotify", url: "https://open.spotify.com/artist/lunarivers" },
						{ title: "Bandcamp", url: "https://lunarivers.bandcamp.com" },
						{ title: "Instagram", url: "https://instagram.com/lunarivers" },
						{ title: "Support on Patreon", url: "https://patreon.com/lunarivers" },
					],
				},
				position: 1,
			},
			{
				pageId: page3.id,
				widgetType: "photos",
				widgetData: {
					images: [
						"https://picsum.photos/seed/indie1/800/600",
						"https://picsum.photos/seed/indie2/800/600",
						"https://picsum.photos/seed/indie3/800/600",
						"https://picsum.photos/seed/indie4/800/600",
					],
				},
				position: 2,
			},
			{
				pageId: page3.id,
				widgetType: "youtube",
				widgetData: { videoUrl: "https://www.youtube.com/watch?v=5hEh9LiSzow" },
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
							ticketLink: "https://bluebirdcafe.com/tickets",
							latitude: 36.1063,
							longitude: -86.8365,
						},
						{
							city: "Asheville, NC",
							venue: "The Grey Eagle",
							date: "2026-04-12",
							ticketLink: "https://thegreyeagle.com/tickets",
							latitude: 35.5951,
							longitude: -82.5515,
						},
						{
							city: "Burlington, VT",
							venue: "Higher Ground",
							date: "2026-04-28",
							ticketLink: "https://highergroundmusic.com/tickets",
							latitude: 44.4759,
							longitude: -73.2121,
						},
						{
							city: "Portland, ME",
							venue: "Port City Music Hall",
							date: "2026-05-08",
							ticketLink: "https://portcitymusichall.com/tickets",
							latitude: 43.6591,
							longitude: -70.2568,
						},
						{
							city: "Boston, MA",
							venue: "Club Passim",
							date: "2026-05-15",
							ticketLink: "https://passim.org/tickets",
							latitude: 42.3732,
							longitude: -71.1189,
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
	console.log("  - jazzmusician / password123 (ocean-light) - jazz@demo.com");
	console.log("    Award-winning jazz pianist with 5 tour dates and live performance video");
	console.log("  - rockband / password123 (midnight-dark) - rock@demo.com");
	console.log("    Hard rock band THUNDER STRIKE with full album and 5-city tour");
	console.log("  - indieartist / password123 (sunset-light) - indie@demo.com");
	console.log("    Singer-songwriter Luna Rivers with intimate acoustic performances");
	console.log("\n📦 Each user has complete profiles:");
	console.log("  ✓ Professional bio text");
	console.log("  ✓ 3-4 social/streaming links");
	console.log("  ✓ 4 photo gallery images");
	console.log("  ✓ YouTube performance video");
	console.log("  ✓ 5 tour dates with map coordinates");
	console.log("\n🌐 Visit their pages at:");
	console.log("  http://localhost:5173/jazzmusician");
	console.log("  http://localhost:5173/rockband");
	console.log("  http://localhost:5173/indieartist");
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
