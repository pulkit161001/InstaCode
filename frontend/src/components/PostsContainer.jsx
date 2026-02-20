import { Dialog } from "@mui/material";
import { axiosInstance } from "../lib/axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import leetcode_dp from "../assets/LeetCode_dp.png";
import {
	codeIcon,
	freeIcon,
	moreIcon,
	premiumIcon,
	redirectIcon,
	sendIcon,
} from "../utils/SvgIcons";
import PostStory from "./PostStory";
import { useTheme } from "../hooks/useTheme";

const PostsContainer = () => {
	const { isDarkMode } = useTheme();
	const [loading, setLoading] = useState(false);
	const [studyplan, setStudyPlan] = useState([]);

	useEffect(() => {
		const getStudyPlan = async () => {
			setLoading(true);
			try {
				const res = await axiosInstance.get(`/studyplan`);
				const catalogGroups = res.data.studyPlanV2Catalogs || [];
				const adFeatures = res.data.studyPlansV2AdFeature || [];

				setStudyPlan(adFeatures);

				const moreStudyPlansPromises = catalogGroups.map((group) =>
					axiosInstance.get(`/morestudyplan/${group.slug}`)
				);
				const moreStudyPlansResponses = await Promise.all(
					moreStudyPlansPromises
				);

				const allStudyPlans = moreStudyPlansResponses.flatMap(
					(res) => res.data.studyPlansV2ByCatalog.studyPlans
				);
				setStudyPlan((prevPlans) => [...prevPlans, ...allStudyPlans]);
			} catch (error) {
				console.error("Error fetching main study plans:", error);
			} finally {
				setLoading(false);
			}
		};

		getStudyPlan();
	}, []);

	return (
		<div className="flex flex-col w-full lg:w-2/3 sm:px-8 mb-8">
			{loading ? (
				// Show a centered loading animation
				<div className="flex justify-center items-center min-h-screen w-full">
					<div className="relative w-12 h-12">
						<div className="absolute inset-0 rounded-full border-4 border-gray-300"></div>
						<div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
					</div>
				</div>
			) : (
				//TODO - Skleton, InfinityScroll(Pagination)
				//https://github1s.com/jigar-sable/instagram-mern/blob/main/frontend/src/components/Home/PostsContainer.jsx
				// Display study plans once loading is complete
				<div className="w-full h-full mt-1 flex flex-col space-y-4">
					<div className={`rounded-lg p-4 mb-4 w-full border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
						<PostStory />
					</div>
					{studyplan.map((plan) => (
						<PostItem studyplan={plan} key={plan.slug} />
					))}
					<CaughtUpMessage />
				</div>
			)}
		</div>
	);
};

const CaughtUpMessage = () => {
	const { isDarkMode } = useTheme();
	return (
	<div className={`flex flex-col items-center text-center mt-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
		<div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full h-12 w-12 flex items-center justify-center text-white text-2xl mb-2">
			✓
		</div>
		<div className="font-semibold">You&apos;re all caught up.</div>
		<div className="text-sm">You&apos;ve seen all new study plans.</div>
	</div>
	);
};

function buildTitleFromSlug(slug) {
	return slug
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

function PostItem({ studyplan }) {
	const { isDarkMode } = useTheme();
	const [openList, setOpenList] = useState(false);
	const [problemlist, setProblemList] = useState([]);
	const [loading, setLoading] = useState(false);

	const handleOpenDialog = async () => {
		setOpenList(true);

		if (problemlist.length === 0) {
			// Fetch only if data hasn't been loaded yet
			setLoading(true);
			try {
				const res = await axiosInstance.get(
					`/studyplanquestions/${studyplan.slug}`
				);
				const allProblems = res.data.studyPlanV2Detail.planSubGroups.flatMap(
					(group) =>
						group.questions.map((question) => ({
							titleSlug: question.titleSlug,
							title: buildTitleFromSlug(question.titleSlug),
						}))
				);
				console.log(allProblems);
				setProblemList(allProblems || []);
			} catch (error) {
				console.error("Error fetching user data:", error);
				setProblemList([]);
			} finally {
				setLoading(false);
			}
		}
	};

	return (
		<div className={`rounded-lg p-1 mb-6 w-full ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
			{/* Top section with default avatar and LeetCode text */}
			<div className="flex items-center justify-between mb-2">
				<div className="flex items-center">
					<img
						src={leetcode_dp}
						alt="Avatar"
						className="w-8 h-8 rounded-full border-2 border-grey-100 mr-2"
					/>
					<span className={`font-semibold mr-1 ${isDarkMode ? "text-white" : ""}`}>LeetCode</span>
					<span className={isDarkMode ? "text-gray-500" : "text-gray-400"} title={"this is of no use"}>
						• 2d
					</span>
				</div>
			<div className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{moreIcon}</div>
			</div>

			{/* Cover Image using img tag */}
			<div className="w-full h-auto flex justify-center rounded-md mb-4 border-gray-500 border overflow-hidden">
				<img
					src={studyplan.cover}
					alt="Cover"
					className="object-cover w-4/5 h-full"
					style={{ aspectRatio: "4 / 5" }}
				/>
			</div>

			{/* Icon row with problem count, premium status, and send icon */}
			<div className="flex items-center space-x-3 mb-2">
				<div
					onClick={() =>
						toast(`It has total ${studyplan.questionNum} problems.`)
					}
					className={`cursor-pointer ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
				>
					{codeIcon}
				</div>
				<div
					onClick={() =>
						toast(
							studyplan.premiumOnly
								? "Premium users only"
								: "This study plan is free to use."
						)
					}
					className={`cursor-pointer ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
				>
					{studyplan.premiumOnly ? premiumIcon : freeIcon}
				</div>
				<a
					href={`https://leetcode.com/studyplan/${studyplan.slug}`}
					target="_blank"
					rel="noopener noreferrer"
					className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}
				>
					{sendIcon}
				</a>
			</div>

			{/* Toast container for displaying messages */}
			<ToastContainer position="bottom-left" autoClose={3000} hideProgressBar />

			{/* Question count text */}
			<div
				className={`text-sm mb-2 font-semibold ${isDarkMode ? "text-white" : ""}`}
				onClick={() => setOpenList(true)}
			>
				{studyplan.questionNum} problems
			</div>

			<div className="flex flex-col items-start flex-1">
				<div className="flex items-center mb-1">
					<div className={`text-sm font-semibold mr-2 ${isDarkMode ? "text-white" : ""}`}>LeetCode</div>
					<div>
						<span className={`text-sm mr-1 ${isDarkMode ? "text-gray-300" : ""}`}>{studyplan.name}</span>
					</div>
				</div>
				<div className={`text-sm ${isDarkMode ? "text-gray-400" : ""}`}>{studyplan.highlight}</div>
			</div>

			{/* View all problems link */}
			<div
				className={`ml-auto cursor-pointer text-base ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
				onClick={handleOpenDialog}
			>
				view all {studyplan.questionNum} problems
			</div>

			<Dialog
				open={openList}
				onClose={() => setOpenList(false)}
				maxWidth="xl"
				PaperProps={{
					style: {
						borderRadius: "10px",
						overflow: "hidden",
						backgroundColor: isDarkMode ? "#1f2937" : "white",
					},
				}}
			>
				<div
					className={`flex flex-col items-start p-4 w-80 overflow-y-scroll ${isDarkMode ? "bg-gray-800" : ""}`}
					style={{
						maxHeight: "400px",
						scrollbarWidth: "none", // for Firefox
					}}
				>
					{loading ? (
						<div className="flex justify-center items-center w-full h-24">
							<div className="relative w-8 h-8">
								<div className="absolute inset-0 rounded-full border-3 border-gray-300"></div>
								<div className={`absolute inset-0 rounded-full border-3 border-transparent border-t-blue-500 animate-spin ${isDarkMode ? "border-t-blue-400" : ""}`}></div>
							</div>
						</div>
					) : problemlist.length > 0 ? (
						problemlist.map((problem, index) => (
							<a
								key={index}
								href={`https://leetcode.com/problems/${problem.titleSlug}`}
								target="_blank"
								rel="noopener noreferrer"
								className="w-full"
							>
								<div className={`flex justify-between items-center w-full py-2.5 px-4 border-b last:border-none ${
									isDarkMode ? "border-gray-700 hover:bg-gray-700" : "hover:bg-gray-50"
								}`}>
									<span className={`text-left ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
										{problem.title}
									</span>
									<span
										className={`text-sm font-semibold rounded-full px-1 py-1`}
									>
										{redirectIcon}
									</span>
								</div>
							</a>
						))
					) : (
						<p className={isDarkMode ? "text-gray-300" : ""}>No problems found.</p>
					)}
				</div>
			</Dialog>
		</div>
	);
}

export default PostsContainer;
