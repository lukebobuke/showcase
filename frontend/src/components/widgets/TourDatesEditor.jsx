/** @format */

import { useState, useEffect } from "react";
import { geocodeCity } from "../../utils/geocoding";

export default function TourDatesEditor({ isOpen, initialDates, onSave, onClose }) {
	const [dates, setDates] = useState([]);
	const [editingIndex, setEditingIndex] = useState(null);
	const [formData, setFormData] = useState({
		city: "",
		venue: "",
		date: "",
		ticketLink: "",
	});
	const [error, setError] = useState("");
	const [isGeocoding, setIsGeocoding] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");

	// Initialize dates when modal opens
	useEffect(() => {
		if (isOpen) {
			setDates(initialDates && initialDates.length > 0 ? [...initialDates] : []);
			setEditingIndex(null);
			setFormData({ city: "", venue: "", date: "", ticketLink: "" });
			setError("");
			setSuccessMessage("");
		}
	}, [isOpen, initialDates]);

	// Start adding a new date
	const addDate = () => {
		setEditingIndex(-1); // -1 indicates new date
		setFormData({ city: "", venue: "", date: "", ticketLink: "" });
		setError("");
	};

	// Start editing an existing date
	const editDate = (index) => {
		setEditingIndex(index);
		const dateToEdit = dates[index];
		setFormData({
			city: dateToEdit.city,
			venue: dateToEdit.venue,
			date: dateToEdit.date,
			ticketLink: dateToEdit.ticketLink || "",
		});
		setError("");
	};

	// Save the current form data
	const saveDate = async () => {
		// Validation
		if (!formData.city.trim()) {
			setError("City is required");
			return;
		}
		if (!formData.venue.trim()) {
			setError("Venue is required");
			return;
		}
		if (!formData.date) {
			setError("Date is required");
			return;
		}

		// Geocode the city
		setIsGeocoding(true);
		setError("");

		const coordinates = await geocodeCity(formData.city.trim());

		setIsGeocoding(false);

		// Create date object with coordinates (or null if geocoding failed)
		const newDate = {
			city: formData.city.trim(),
			venue: formData.venue.trim(),
			date: formData.date,
			ticketLink: formData.ticketLink.trim() || "",
			latitude: coordinates?.latitude || null,
			longitude: coordinates?.longitude || null,
		};

		if (editingIndex === -1) {
			// Adding new date
			setDates([...dates, newDate]);
		} else {
			// Editing existing date
			const updatedDates = [...dates];
			updatedDates[editingIndex] = newDate;
			setDates(updatedDates);
		}

		// Reset form and show success message
		setEditingIndex(null);
		setFormData({ city: "", venue: "", date: "", ticketLink: "" });
		setError("");
		setSuccessMessage(editingIndex === -1 ? "Date added successfully!" : "Date updated successfully!");

		// Clear success message after 3 seconds
		setTimeout(() => setSuccessMessage(""), 3000);
	};

	// Delete a date
	const deleteDate = (index) => {
		if (window.confirm("Delete this tour date?")) {
			const updatedDates = dates.filter((_, i) => i !== index);
			setDates(updatedDates);
			if (editingIndex === index) {
				setEditingIndex(null);
				setFormData({ city: "", venue: "", date: "", ticketLink: "" });
			}
		}
	};

	// Cancel editing
	const cancelEdit = () => {
		setEditingIndex(null);
		setFormData({ city: "", venue: "", date: "", ticketLink: "" });
		setError("");
		setSuccessMessage("");
	};

	// Handle final save
	const handleSave = () => {
		onSave({ dates });
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
				<h2 className="text-2xl font-bold mb-4">Edit Tour Dates</h2>

				{/* Error message */}
				{error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

				{/* Success message */}
				{successMessage && (
					<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
						<svg className="h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
							<path
								fillRule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clipRule="evenodd"
							/>
						</svg>
						{successMessage}
					</div>
				)}

				{/* Geocoding status */}
				{isGeocoding && (
					<div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4 flex items-center">
						<svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Looking up location...
					</div>
				)}

				{/* List of current dates */}
				{dates.length > 0 && editingIndex === null && (
					<div className="mb-4">
						<h3 className="text-lg font-semibold mb-2">Current Tour Dates ({dates.length})</h3>
						<div className="space-y-2">
							{[...dates]
								.sort((a, b) => new Date(a.date) - new Date(b.date))
								.map((tourDate) => {
									const originalIndex = dates.findIndex(
										(d) => d.city === tourDate.city && d.venue === tourDate.venue && d.date === tourDate.date,
									);
									return (
										<div key={originalIndex} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
											<div>
												<div className="font-medium">{tourDate.venue}</div>
												<div className="text-sm text-gray-600">
													{tourDate.city} • {new Date(tourDate.date).toLocaleDateString()}
												</div>
											</div>
											<div className="flex gap-2">
												<button
													onClick={() => editDate(originalIndex)}
													className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
													Edit
												</button>
												<button
													onClick={() => deleteDate(originalIndex)}
													className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
													Delete
												</button>
											</div>
										</div>
									);
								})}
						</div>
					</div>
				)}

				{/* Add Date button */}
				{editingIndex === null && (
					<button onClick={addDate} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4">
						+ Add Tour Date
					</button>
				)}

				{/* Form for adding/editing */}
				{editingIndex !== null && (
					<div className="bg-gray-50 p-4 rounded-lg mb-4">
						<h3 className="text-lg font-semibold mb-3">{editingIndex === -1 ? "Add New Date" : "Edit Date"}</h3>

						<div className="space-y-3">
							{/* City */}
							<div>
								<label className="block text-sm font-medium mb-1">
									City <span className="text-red-600">*</span>
								</label>
								<input
									type="text"
									value={formData.city}
									onChange={(e) => setFormData({ ...formData, city: e.target.value })}
									placeholder="Chicago, IL"
									className="w-full p-2 border rounded"
								/>
							</div>

							{/* Venue */}
							<div>
								<label className="block text-sm font-medium mb-1">
									Venue <span className="text-red-600">*</span>
								</label>
								<input
									type="text"
									value={formData.venue}
									onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
									placeholder="Metro"
									className="w-full p-2 border rounded"
								/>
							</div>

							{/* Date */}
							<div>
								<label className="block text-sm font-medium mb-1">
									Date <span className="text-red-600">*</span>
								</label>
								<input
									type="date"
									value={formData.date}
									onChange={(e) => setFormData({ ...formData, date: e.target.value })}
									className="w-full p-2 border rounded"
								/>
							</div>

							{/* Ticket Link */}
							<div>
								<label className="block text-sm font-medium mb-1">Ticket Link (optional)</label>
								<input
									type="url"
									value={formData.ticketLink}
									onChange={(e) => setFormData({ ...formData, ticketLink: e.target.value })}
									placeholder="https://tickets.com/event"
									className="w-full p-2 border rounded"
								/>
							</div>
						</div>

						{/* Form buttons */}
						<div className="flex gap-2 mt-4">
							<button
								onClick={saveDate}
								disabled={isGeocoding}
								className={`px-4 py-2 rounded ${
									isGeocoding ? "bg-gray-400 cursor-not-allowed text-white" : "bg-blue-600 text-white hover:bg-blue-700"
								}`}>
								{editingIndex === -1 ? "Add Date" : "Save Changes"}
							</button>
							<button onClick={cancelEdit} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
								Cancel
							</button>
						</div>
					</div>
				)}

				{/* Modal buttons */}
				<div className="flex justify-end gap-2 mt-4">
					<button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
						Close
					</button>
					<button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
						Save All
					</button>
				</div>
			</div>
		</div>
	);
}
