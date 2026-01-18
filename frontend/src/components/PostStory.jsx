import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { Dialog } from "@mui/material";
import leetcode_dp from "../assets/leetcode_dp.png";
import { moreIcon, playIcon, pauseIcon } from "../utils/SvgIcons";

//TO-DO - in the bottom tag a smalle button should be there with a tag icon (when clicked it will show topic tags)
//TO-DO - also add gfg POTD (https://practiceapi.geeksforgeeks.org/api/vr/problems-of-day/problem/today/)
//TO-DO - leetcode profile will have 2/3 posts (potd, contest)
const PostStory = () => {
	const [challengeDetails, setChallengeDetails] = useState({});
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [timer, setTimer] = useState(null);
	const [statusRunning, setStatusRunning] = useState(true);
	const [moreDialogOpen, setMoreDialogOpen] = useState(false);

	useEffect(() => {
		setLoading(true);
		const getChallengeDetails = async () => {
			const res = await axiosInstance.get(`/potd`);
			setChallengeDetails(res.data.activeDailyCodingChallengeQuestion);
			setLoading(false);
		};
		getChallengeDetails();
	}, []);

	const handleClickOpen = () => {
		setOpen(true);
		startProgress();
	};

	const handleClose = () => {
		setOpen(false);
		clearInterval(timer); // Stop timer when closing the dialog
		setProgress(0); // Reset progress
	};

	const startProgress = () => {
		setProgress(0); // Reset progress to 0
		if (timer) clearInterval(timer); // Clear any existing timer
		const newTimer = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 100) {
					clearInterval(newTimer);
					setOpen(false); // Close dialog when progress reaches 100%
					return 100; // Ensure progress doesn't exceed 100%
				}
				return prev + 100 / 150; // Increase progress over 15 seconds
			});
		}, 100); // Update progress every second
		setTimer(newTimer);
	};

	const toggleTimer = () => {
		if (statusRunning) {
			clearInterval(timer);
		} else {
			startProgress();
		}
		setStatusRunning(!statusRunning);
	};

	const formatAcceptanceRatio = (ratio) => {
		return ratio ? `${parseFloat(ratio).toFixed(1)}%` : "Acceptance Ratio";
	};

	const formatTimeElapsed = () => {
		const now = new Date();
		const res_time =
			now.getUTCHours() === 0
				? now.getUTCMinutes() === 0
					? "Just now"
					: `${now.getUTCMinutes()}m`
				: `${now.getUTCHours()}h`;
		return res_time;
	};

	const getBgColor = () => {
		let bg = "bg-gray-100"; // Default background
		if (challengeDetails?.question?.difficulty === "Hard") {
			bg = "bg-gray-200";
		} else if (challengeDetails?.question?.difficulty === "Medium") {
			bg = "bg-gray-300";
		} else {
			bg = "bg-gray-400";
		}
		return bg; // Return the computed background class
	};

	return (
		<>
			{loading ? (
				<></>
			) : (
				<div>
					<div
						className="w-full flex overflow-hidden rounded"
						onClick={handleClickOpen}
					>
						<div className="flex flex-col text-left justify-start items-center cursor-pointer">
							<div className="w-20 h-20 rounded-full border-2 border-orange-500 p-1">
								<img
									loading="lazy"
									className="rounded-full h-full w-full"
									src={leetcode_dp}
									draggable="false"
									alt="Daily Challenge"
								/>
							</div>
							<span className="text-xs font-medium text-white mt-2">
								LeetCode
							</span>
						</div>
					</div>
					{/* TO-DO - it should re-direct to new page, x at the top-right to close it and go back home */}
					<Dialog open={open} onClose={handleClose}>
						<div className={`h-screen p-4 rounded-md ${getBgColor()}`}>
							{/* Progress Bar */}
							<div className="h-1 bg-gray-300 rounded-full mb-2">
								<div
									className="h-full bg-blue-500 rounded-full"
									style={{ width: `${progress}%` }}
								/>
							</div>
							<div className="flex justify-between items-start mb-4">
								<div className="flex items-center">
									<img
										src={leetcode_dp}
										alt="LeetCode"
										className="w-8 h-8 rounded-full"
									/>
									<div className="ml-2">
										<span className="text-lg font-bold">LeetCode</span>
										<span className="text-xs block">{formatTimeElapsed()}</span>
									</div>
								</div>
								<div alt="More" className="cursor-pointer m-1 flex">
									<div onClick={toggleTimer}>
										{statusRunning ? pauseIcon : playIcon}
									</div>
									<div onClick={() => setMoreDialogOpen(true)}>{moreIcon}</div>
								</div>
							</div>

							{/* Centering the <a> tag */}
							<div className="flex justify-center items-center flex-col h-fit">
								<a
									href={`https://leetcode.com${challengeDetails.link}`}
									target="_blank"
									rel="noopener noreferrer"
									className="text-xl font-semibold rounded-full border border-gray-600 px-4 py-2 bg-gray-100"
								>
									{`leetcode.com/problems/${
										challengeDetails?.question?.title?.length > 5
											? `${challengeDetails?.question?.title?.slice(0, 5)}...`
											: challengeDetails?.question?.title || "N/A"
									}`}
								</a>
							</div>
						</div>
					</Dialog>

					{/* More Dialog */}
					<Dialog
						open={moreDialogOpen}
						onClose={() => setMoreDialogOpen(false)}
					>
						<div className="p-4">
							{/* Add your more details here */}
							<h2 className="text-lg font-bold">More Information</h2>
							<p>Here you can add more details about the challenge...</p>
							<button
								onClick={() => setMoreDialogOpen(false)}
								className="mt-4 p-2 bg-blue-500 text-white rounded"
							>
								Close
							</button>
						</div>
					</Dialog>
				</div>
			)}
		</>
	);
};

export default PostStory;
