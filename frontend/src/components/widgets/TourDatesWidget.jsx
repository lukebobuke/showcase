/** @format */

import React, { useMemo } from "react";
import { formatTourDate, sortTourDates, isUpcoming } from "../../utils/dateHelpers";
import TourMap from "../TourMap";

function TourDatesWidget({ widgetData, borderRadiusEnabled = true, borderEnabled = true, borderThickness = 1, verticalSpacingEnabled = true }) {
	const dates = widgetData?.dates || [];

	// Memoize expensive sorting operation
	const sortedDates = useMemo(() => sortTourDates(dates), [dates]);

	// Memoize filtered dates with coordinates
	const datesWithCoords = useMemo(() => dates.filter((date) => date.latitude !== null && date.longitude !== null), [dates]);

	// Empty state
	if (dates.length === 0) {
		return (
			<div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
				<div className="text-gray-600 font-medium mb-1">No tour dates scheduled</div>
				<div className="text-sm text-gray-500">Click Edit to add your upcoming shows and events</div>
			</div>
		);
	}

	// Memoize first upcoming date index
	const firstUpcomingIndex = useMemo(() => sortedDates.findIndex((date) => isUpcoming(date.date)), [sortedDates]);

	return (
		<div>
			{/* Map - only show if dates have coordinates */}
			{datesWithCoords.length > 0 && <TourMap dates={datesWithCoords} borderRadiusEnabled={borderRadiusEnabled} />}

			{/* Tour dates list */}
			<div className={verticalSpacingEnabled ? "space-y-3" : "space-y-0"}>
				{sortedDates.map((tourDate, index) => (
					<div
						key={index}
						className={`p-2.5 ${borderRadiusEnabled ? "rounded-2xl" : "rounded-none"}`}
						style={{
							backgroundColor: "var(--color-widget)",
							borderColor: "var(--color-border)",
							border: borderEnabled ? `${borderThickness}px solid var(--color-border)` : "none",
						}}>
						{/* Date badge with "NEXT SHOW" indicator */}
						<div className="mb-1 flex items-center gap-2">
							<span
								className="px-2.5 py-0.5 rounded-full text-sm font-medium"
								style={{
									backgroundColor: "var(--color-border)",
									color: "var(--color-text)",
								}}>
								{formatTourDate(tourDate.date)}
							</span>
							{index === firstUpcomingIndex && firstUpcomingIndex !== -1 && (
								<span
									className="px-2 py-0.5 rounded text-xs font-bold uppercase"
									style={{
										backgroundColor: "var(--color-accent)",
										color: "var(--color-widget)",
									}}>
									Next Show
								</span>
							)}
						</div>

						{/* Venue/City and Ticket button row */}
						<div className="flex items-center justify-between gap-3">
							<div className="flex-1 min-w-0">
								{/* Venue and city */}
								<div className="text-base font-semibold leading-tight" style={{ color: "var(--color-text)" }}>
									{tourDate.venue}
								</div>
								<div className="text-sm leading-tight" style={{ color: "var(--color-text-secondary)" }}>
									{tourDate.city}
								</div>
							</div>

							{/* Ticket button */}
							{tourDate.ticketLink && (
								<div className="flex-shrink-0">
									<a
										href={tourDate.ticketLink}
										target="_blank"
										rel="noopener noreferrer"
										className="button-link inline-block px-3 py-1.5 rounded hover:opacity-90 transition-opacity text-sm font-medium whitespace-nowrap"
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

// Prevent unnecessary re-renders
export default React.memo(TourDatesWidget);
