import React, { useEffect, useState } from "react";
import { Dialog } from "@mui/material";
import {
	infoIcon,
	locationIcon,
	lastVistIcon,
	recentSubmissionIcon,
	contestIcon,
	badgeIcon,
	languageIcon,
	problemSolvedIcon,
	solutionIcon,
	eyeIcon,
} from "../utils/SvgIcons";
import { Heart, Target, TrendingUp, MessagesSquareIcon } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import AboutDialogItem from "./AboutDialogItem";
import { formatFullDate } from "../constants/calculation.js";
import { FadeLoader } from "react-spinners";

// TO-DO - add top 3%
const AboutThisAccount = ({ open, userData, onClose }) => {
	const [aboutContent, setAboutContent] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		if (userData) {
			async function fetchData() {
				try {
					const content = [
						{
							logo: infoIcon,
							text: await getFirstSubmission(userData),
							title: "First Submission",
						},
						{
							logo: locationIcon,
							text: getLocation(userData),
							title: "Account based in",
						},
						{
							logo: lastVistIcon,
							text: await getRecentSubmission(userData),
							title: "Latest Solved Problem data",
						},
						{
							logo: recentSubmissionIcon,
							text: await getRecentProblemSolved(userData),
							title: "Last Solved Problem",
						},
						{
							logo: contestIcon,
							text: getContestCount(userData),
							title: "Contest participation count",
						},
						{
							logo: badgeIcon,
							text: getBadgesCount(userData),
							title: "Badge's Earned",
						},
						{
							logo: problemSolvedIcon,
							text: getTotalProblemsSolved(userData),
							title: "Problem Solved",
						},
						{
							logo: languageIcon,
							text: getMostUsedLanguage(userData),
							title: "Most Used language",
						},
						{
							logo: solutionIcon,
							text: getSolutionCount(userData),
							title: "Solution contributed",
						},
						{
							logo: eyeIcon,
							text: getViewsCount(userData),
							title: "Views Count",
						},
						{
							logo: <Heart />,
							text: getFavoriteTopic(userData),
							title: "Favorite Topic",
						},
						{
							logo: <TrendingUp />,
							text: getUnderTopPercentage(userData),
							title: "Top %",
						},
						{
							logo: <Target />,
							text: getAccuracy(userData),
							title: "Accuracy",
						},
						{
							logo: <MessagesSquareIcon />,
							text: getDiscussionCount(userData),
							title: "Discussion Count",
						},
					];
					setAboutContent(content);
				} catch (err) {
					setAboutContent([]);
				} finally {
					setLoading(false);
				}
			}
			fetchData();
		}
	}, [userData]);

	return (
		<Dialog
			open={open}
			onClose={onClose}
			PaperProps={{
				style: {
					borderRadius: "12px",
					width: "400px", // Set a custom width for the dialog
					maxWidth: "90%", // Ensures it’s responsive on smaller screens
				},
			}}
		>
			{loading ? (
				<div className="flex items-center justify-center h-full p-5 bg-gray-50 w-full">
					<FadeLoader />
				</div>
			) : (
				<>
					<div className="font-medium border-b py-2.5 w-full bg-gray-50 cursor-text text-center">
						About this account
					</div>
					<div className="flex flex-col items-center w-full p-4 bg-black">
						<img
							draggable="false"
							className="object-contain rounded-full w-24 h-24 mb-4"
							src={userData.matchedUser.profile.userAvatar}
							alt={`${userData.matchedUser.username}'s avatar`}
						/>
						<h2 className="text-lg font-bold">
							{userData.matchedUser.username}
						</h2>
						<p className="text-gray-500 mb-2 text-sm font-normal text-center">
							To help keep our community authentic, we’re showing information
							about accounts on InstaCode.
						</p>
						<div
							className="w-full mt-4"
							style={{
								maxHeight: "200px",
								overflowY: "scroll",
								scrollbarWidth: "none",
								msOverflowStyle: "none",
								WebkitOverflowScrolling: "touch",
							}}
						>
							{aboutContent.map((item, index) => (
								<AboutDialogItem
									key={index}
									logo={item.logo}
									text={item.text}
									title={item.title}
								/>
							))}
						</div>
					</div>
				</>
			)}
			<div
				onClick={onClose}
				className="font-medium border-t py-2.5 w-full bg-gray-50 cursor-pointer text-center"
			>
				Close
			</div>
		</Dialog>
	);
};

function getDiscussionCount(userData) {
	console.log(userData?.matchedUser?.profile?.categoryDiscussCount);
	return userData?.matchedUser?.profile?.categoryDiscussCount;
}

function getFavoriteTopic(userData) {
	const data = { tagName: "", problemsSolved: 0 };
	Object.values(userData?.matchedUser?.tagProblemCounts || {}).forEach(
		(level) => {
			level?.forEach((item) => {
				if (item.problemsSolved > data.problemsSolved) {
					data.tagName = item.tagName;
					data.problemsSolved = item.problemsSolved;
				}
			});
		}
	);
	return `${data.problemsSolved} : ${data.tagName}`;
}

function getAccuracy(userData) {
	const acceptedSubmission =
		userData?.matchedUser?.submitStats?.acSubmissionNum[0]?.submissions;
	const TotalSubmission =
		userData?.matchedUser?.submitStats?.totalSubmissionNum[0]?.submissions;
	return `${((acceptedSubmission / TotalSubmission) * 100).toFixed(2)}%`;
}

function getUnderTopPercentage(userData) {
	return `${userData?.userContestRanking?.topPercentage} %`;
}

async function getFirstSubmission(userData) {
	const username = userData?.matchedUser?.username;
	const activeYears = userData?.matchedUser?.userCalendar?.activeYears || [];
	const startYear = activeYears.length > 0 ? Math.min(...activeYears) : null;
	if (startYear == null) return "N/A";
	const res = await axiosInstance.get(`/${username}/year/${startYear}`);
	const submissionCalendar =
		res.data.matchedUser.userCalendar.submissionCalendar;
	const calendarObj = JSON.parse(submissionCalendar);
	if (calendarObj.length == 0) return "N/A";
	//pick first submission time
	const firstKey = Object.keys(calendarObj)[0];
	const myDate = new Date(firstKey * 1000);
	return myDate.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

function getLocation(userData) {
	return userData?.matchedUser?.profile?.countryName || "N/A";
}

function getViewsCount(userData) {
	const viewCount = userData?.matchedUser?.profile?.postViewCount;

	if (viewCount === undefined) {
		return "N/A";
	}

	if (viewCount >= 1_000_000) {
		return `${(viewCount / 1_000_000).toFixed(2)}M`;
	} else if (viewCount >= 1_000) {
		return `${(viewCount / 1_000).toFixed(2)}K`;
	} else {
		return viewCount.toString(); // Show the raw count if less than 1,000
	}
}

async function getRecentSubmission(userData) {
	const username = userData?.matchedUser?.username;
	const res = await axiosInstance.get(`/${username}/recent/1`);
	if (res.data.recentAcSubmissionList.length == 0) return "N/A";
	const firstValue = res?.data?.recentAcSubmissionList[0]?.timestamp;
	return formatFullDate(firstValue);
}

async function getRecentProblemSolved(userData) {
	const username = userData?.matchedUser?.username;
	const res = await axiosInstance.get(`/${username}/recent/1`);
	if (res?.data?.recentAcSubmissionList?.length == 0) return "N/A";
	const firstValue = res?.data?.recentAcSubmissionList[0]?.title;
	return firstValue;
}

function getContestCount(userData) {
	return (
		userData.userContestRanking?.attendedContestsCount ||
		"No contests participated"
	);
}

function getBadgesCount(userData) {
	return userData?.matchedUser?.badges?.length;
}

function getTotalProblemsSolved(userData) {
	return userData?.matchedUser?.submitStats?.acSubmissionNum[0]?.count;
}

function getMostUsedLanguage(userData) {
	return (
		userData?.matchedUser?.languageProblemCount.reduce((maxLang, countItem) => {
			return countItem.problemsSolved > (maxLang.problemsSolved || 0)
				? countItem
				: maxLang;
		}, {})?.languageName || "No languages used"
	);
}

function getSolutionCount(userData) {
	return userData?.matchedUser?.profile?.solutionCount;
}

export default AboutThisAccount;
