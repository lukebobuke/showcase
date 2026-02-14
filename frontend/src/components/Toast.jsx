/** @format */

import { useEffect } from "react";

export default function Toast({ message, type = "info", onClose }) {
	// Auto-dismiss after 3 seconds
	useEffect(() => {
		const timer = setTimeout(() => {
			onClose();
		}, 3000);

		return () => clearTimeout(timer);
	}, [onClose]);

	// Color schemes based on type
	const colorClasses = {
		success: "bg-green-500 text-white",
		error: "bg-red-500 text-white",
		info: "bg-blue-500 text-white",
	};

	return (
		<div
			className={`theme-toast fixed top-4 right-4 z-50 ${colorClasses[type]} px-6 py-4 rounded-lg flex items-center gap-3 animate-fade-in max-w-md`}
			style={{
				animation: "fadeIn 0.3s ease-in-out",
			}}>
			{/* Icon based on type */}
			{type === "success" && (
				<svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
				</svg>
			)}
			{type === "error" && (
				<svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
				</svg>
			)}
			{type === "info" && (
				<svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			)}

			{/* Message */}
			<span className="flex-1 font-medium">{message}</span>

			{/* Close button */}
			<button onClick={onClose} className="flex-shrink-0 hover:opacity-80 transition-opacity" aria-label="Close notification">
				<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>

			<style jsx>{`
				@keyframes fadeIn {
					from {
						opacity: 0;
						transform: translateX(100%);
					}
					to {
						opacity: 1;
						transform: translateX(0);
					}
				}
			`}</style>
		</div>
	);
}
