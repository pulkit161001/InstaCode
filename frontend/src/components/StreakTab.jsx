import { axiosInstance } from "../lib/axios";
import React, { useEffect, useState } from "react";
import { months } from "../constants/variables";

const StreakTab = React.memo(
	({ userData, selectedYear, setSelectedYear, streakData, setStreakData }) => {
		const isLeapYear = (year) =>
			(year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

		const [loading, setLoading] = useState(true);
		const username = userData.matchedUser.username;
		const today = new Date();

		const handleYearChange = (event) => {
			setSelectedYear(Number(event.target.value));
		};

		useEffect(() => {
			//data already exist and even with the same selected year
			if (streakData.submissionDates.size && streakData.year === selectedYear) {
				setLoading(false);
				return;
			}
			setLoading(true);
			const getYearlyData = async () => {
				try {
					const res = await axiosInstance.get(
						`/${username}/year/${selectedYear}`
					);
					const activeDays = res.data.matchedUser.userCalendar.totalActiveDays;

					const submissionCalendarStr =
						res.data.matchedUser.userCalendar.submissionCalendar;
					const calendarObj = JSON.parse(submissionCalendarStr);

					// Convert timestamps to a Set of dates
					const submissionDatesMap = new Map(
						Object.entries(calendarObj).map(([timestamp, count]) => {
							const date = new Date(timestamp * 1000);
							const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
							return [dateKey, count];
						})
					);
					setStreakData({
						activeDays,
						submissionDates: submissionDatesMap,
						year: selectedYear,
					});
				} catch (error) {
					console.error("Error fetching user data:", error);
					setStreakData({ activeDays: 0, submissionDates: new Map() });
				} finally {
					setLoading(false);
				}
			};
			getYearlyData();
		}, [selectedYear, streakData, setStreakData, username]);

		return (
			<>
				{loading ? (
					<div className="flex items-center justify-center h-20">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-200"></div>
					</div>
				) : (
					<div className="relative">
						{/* Top Right Section */}
						<div className="flex justify-between items-center mb-4 space-x-4">
							<span className="text-sm font-normal">
								Active days: {streakData.activeDays}
							</span>
							<select
								value={selectedYear}
								onChange={handleYearChange}
								className="p-2 border rounded-md text-sm focus:outline-none"
							>
								{userData.matchedUser.userCalendar.activeYears
									.slice()
									.reverse()
									.map((year) => (
										<option key={year} value={year}>
											{year}
										</option>
									))}
							</select>
						</div>

						<div className="grid grid-cols-3 gap-2 mb-8 ">
							{months.map((month, index) => {
								const days =
									month.name === "February" && isLeapYear(selectedYear)
										? 29
										: month.days;
								if (
									selectedYear == today.getFullYear() &&
									index > today.getMonth()
								)
									return null;
								return (
									<div key={index} className="p-4 border rounded-lg bg-gray-50">
										<h3 className="text-center font-semibold mb-2">
											{month.name}
										</h3>
										<div className="grid grid-cols-7 gap-1">
											{Array.from({ length: days }, (_, dayIndex) => {
												const day = dayIndex + 1;
												const dateKey = `${selectedYear}-${index}-${day}`;

												if (
													selectedYear === today.getFullYear() &&
													index === today.getMonth() &&
													day > today.getDate()
												) {
													return null; // Skip future days
												}

												// Check if the date has a submission
												const countSubmission =
													streakData.submissionDates.get(dateKey);
												const hasSubmission = countSubmission !== undefined;

												// Set color based on submission count
												let colorClass = "bg-gray-200";
												if (hasSubmission) {
													if (countSubmission === 1)
														colorClass = "bg-green-100";
													else if (countSubmission == 2)
														colorClass = "bg-green-200";
													else if (countSubmission == 3)
														colorClass = "bg-green-300";
													else if (countSubmission == 4)
														colorClass = "bg-green-400";
													else if (countSubmission == 5)
														colorClass = "bg-green-500";
													else colorClass = "bg-green-600";
												}

												return (
													<div
														key={dayIndex}
														className={`w-6 h-6 rounded-sm ${colorClass}`}
														title={`${countSubmission || 0} submissions on ${
															month.name
														} ${day}, ${selectedYear}`}
													/>
												);
											})}
										</div>
									</div>
								);
							})}
						</div>
					</div>
				)}
			</>
		);
	}
);

export default StreakTab;
