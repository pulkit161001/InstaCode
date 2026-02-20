import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { Dialog, Tooltip } from "@mui/material";
import leetcode_dp from "../assets/LeetCode_dp.png";
import { moreIcon, playIcon, pauseIcon } from "../utils/SvgIcons";
import { useTheme } from "../hooks/useTheme";

//TO-DO - in the bottom tag a smalle button should be there with a tag icon (when clicked it will show topic tags)
//TO-DO - also add gfg POTD (https://practiceapi.geeksforgeeks.org/api/vr/problems-of-day/problem/today/)
//TO-DO - leetcode profile will have 2/3 posts (potd, contest)
const PostStory = () => {
	const { isDarkMode } = useTheme();
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
		setMoreDialogOpen(false); // Close the more information dialog too
		if (timer) clearInterval(timer); // Stop timer when closing the dialog
		setTimer(null); // Clear timer state
		setProgress(0); // Reset progress
		setStatusRunning(true); // Reset to running state for next open
	};

	const startProgress = () => {
		setProgress(0); // Reset progress to 0
		if (timer) clearInterval(timer); // Clear any existing timer
		setTimer(null); // Clear timer state
		setStatusRunning(true); // Ensure running state
		resumeProgress();
	};

	const resumeProgress = () => {
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
			// Pause: stop the interval
			if (timer) clearInterval(timer);
			setTimer(null);
			setStatusRunning(false);
		} else {
			// Resume: start the interval without resetting progress
			setStatusRunning(true);
			resumeProgress();
		}
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
		if (isDarkMode) {
			return "bg-gray-950"; // LeetCode dark mode
		} else {
			return "bg-gray-50"; // LeetCode light mode
		}
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
							<span className={`text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mt-2`}>
								daily.chall...
							</span>
						</div>
					</div>
					{/* TO-DO - it should re-direct to new page, x at the top-right to close it and go back home */}
					<Dialog open={open} onClose={handleClose} PaperProps={{ style: { backgroundColor: 'transparent', boxShadow: 'none', width: '450px', height: '810px' } }}>
						<div className={`w-full h-full p-4 rounded-lg flex flex-col ${getBgColor()}`}>
							{/* Progress Bar */}
							<div className={`h-1 rounded-full mb-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
								<div
									className="h-full bg-orange-500 rounded-full"
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
										<span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>LeetCode</span>
										<span className={`text-xs block ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{formatTimeElapsed()}</span>
									</div>
								</div>
								<div className="cursor-pointer m-1 flex gap-2">
									<div onClick={toggleTimer} className="text-orange-500 hover:text-orange-600 transition-colors">
										{statusRunning ? pauseIcon : playIcon}
									</div>
									<div onClick={() => setMoreDialogOpen(true)} className="text-orange-500 hover:text-orange-600 transition-colors">{moreIcon}</div>
								</div>
							</div>

							{/* Centering the <a> tag - vertically and horizontally */}
							<div className="flex-1 flex justify-center items-center">
								<Tooltip title={`https://leetcode.com${challengeDetails.link}`} arrow>
									<a
										href={`https://leetcode.com${challengeDetails.link}`}
										target="_blank"
										rel="noopener noreferrer"
										className={`text-xl font-semibold rounded-full border-2 px-6 py-3 transition-all hover:shadow-lg ${
											isDarkMode
												? "bg-gray-800 border-orange-500 text-white hover:bg-gray-700"
												: "bg-white border-orange-500 text-gray-900 hover:bg-orange-50"
										}`}
									>
										{`leetcode.com/problems/${
											challengeDetails?.question?.title?.length > 5
												? `${challengeDetails?.question?.title?.slice(0, 5)}...`
												: challengeDetails?.question?.title || "N/A"
										}`}
									</a>
								</Tooltip>
							</div>
						</div>
					</Dialog>

					{/* More Dialog */}
					<Dialog
						open={moreDialogOpen}
						onClose={() => setMoreDialogOpen(false)}
						PaperProps={{ style: { backgroundColor: 'transparent', boxShadow: 'none' } }}
					>
						<div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`} style={{ maxWidth: '400px' }}>
							{/* Problem Title */}
							{challengeDetails?.question?.title && (
								<h2 className="text-2xl font-bold mb-6 text-orange-500">{challengeDetails.question.title}</h2>
							)}

							{/* Difficulty */}
							{challengeDetails?.question?.difficulty && (
								<div className="mb-4">
									<span className="text-sm text-gray-400">Difficulty</span>
									<div className={`text-lg font-semibold mt-1 ${
										challengeDetails.question.difficulty === 'Easy' ? 'text-green-500' :
										challengeDetails.question.difficulty === 'Medium' ? 'text-yellow-500' :
										'text-red-500'
									}`}>
										{challengeDetails.question.difficulty}
									</div>
								</div>
							)}

							{/* Acceptance Rate */}
							{challengeDetails?.acRate && (
								<div className="mb-4">
									<span className="text-sm text-gray-400">Acceptance Rate</span>
									<div className="text-lg font-semibold mt-1">{formatAcceptanceRatio(challengeDetails.acRate)}</div>
								</div>
							)}

							{/* Topic Tags */}
							{challengeDetails?.question?.topicTags && challengeDetails.question.topicTags.length > 0 && (
								<div className="mb-4">
									<span className="text-sm text-gray-400 block mb-2">Topics</span>
									<div className="flex flex-wrap gap-2">
										{challengeDetails.question.topicTags.map((tag, idx) => (
											<span key={idx} className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
												{tag.name || tag}
											</span>
										))}
									</div>
								</div>
							)}

							{/* Description Preview */}
							{challengeDetails?.question?.description && (
								<div className="mb-4">
									<span className="text-sm text-gray-400 block mb-2">Description</span>
									<p className="text-sm line-clamp-4">{challengeDetails.question.description.substring(0, 150)}...</p>
								</div>
							)}

							<button
								onClick={() => setMoreDialogOpen(false)}
								className="w-full mt-6 p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
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
