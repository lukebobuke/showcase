/** @format */

import { formatTourDate, sortTourDates, isUpcoming } from "../../utils/dateHelpers";
import TourMap from "../TourMap";

export default function TourDatesWidget({ widgetData }) {
	const dates = widgetData?.dates || [];

	// Sort dates using utility function
	const sortedDates = sortTourDates(dates);

	// Filter dates with coordinates for map display
	const datesWithCoords = dates.filter((date) => date.latitude !== null && date.longitude !== null);

	// Empty state
	if (dates.length === 0) {
		return (
			<div
				className="border-2 border-dashed rounded-lg p-8 text-center"
				style={{
					borderColor: "var(--color-border)",
					color: "var(--color-text)",
				}}>
				<div className="text-4xl mb-2">🗺️</div>
				<div className="font-medium mb-1" style={{ color: "var(--color-text)" }}>
					No tour dates yet
				</div>
				<div className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
					Click Edit to add your upcoming shows
				</div>
			</div>
		);
	}

	// Find first upcoming date
	const firstUpcomingIndex = sortedDates.findIndex((date) => isUpcoming(date.date));

	return (
		<div>
			{/* Date count header */}
			<div className="mb-4">
				<h3 className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>
					{dates.length} {dates.length === 1 ? "show" : "shows"}
				</h3>
			</div>

			{/* Map - only show if dates have coordinates */}
			{datesWithCoords.length > 0 && <TourMap dates={datesWithCoords} />}

			{/* Tour dates list */}
			<div className="space-y-3">
				{sortedDates.map((tourDate, index) => (
					<div
						key={index}
						className="p-4 rounded-lg hover:shadow transition-shadow"
						style={{
							backgroundColor: "var(--color-widget)",
							borderColor: "var(--color-border)",
							border: "1px solid",
						}}>
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
							<div className="flex-1">
								{/* Date badge with "NEXT SHOW" indicator */}
								<div className="mb-2 flex items-center gap-2">
									<span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
										{formatTourDate(tourDate.date)}
									</span>
									{index === firstUpcomingIndex && firstUpcomingIndex !== -1 && (
										<span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold uppercase">Next Show</span>
									)}
								</div>

								{/* Venue and city */}
								<div className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>
									{tourDate.venue}
								</div>
								<div style={{ color: "var(--color-text-secondary)" }}>{tourDate.city}</div>
							</div>

							{/* Ticket button */}
							{tourDate.ticketLink && (
								<div>
									<a
										href={tourDate.ticketLink}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-block px-4 py-2 rounded hover:opacity-90 transition-opacity text-sm font-medium"
										style={{
											backgroundColor: "var(--color-accent)",
											color: "var(--color-widget)",
										}}>
										Get Tickets
									</a>
								</div>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
