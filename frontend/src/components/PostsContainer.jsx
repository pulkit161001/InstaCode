import { Dialog } from "@mui/material";
import { axiosInstance } from "../lib/axios";
import React, { useEffect, useState } from "react";
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

const PostsContainer = () => {
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
				// Show a loading text or animation
				<div>Loading...</div>
			) : (
				//TODO - Skleton, InfinityScroll(Pagination)
				//https://github1s.com/jigar-sable/instagram-mern/blob/main/frontend/src/components/Home/PostsContainer.jsx
				// Display study plans once loading is complete
				<div className="w-full h-full mt-1 flex flex-col space-y-4">
					<div className="w-full">
						<PostStory />
					</div>
					{studyplan.map((plan, index) => (
						<React.Fragment key={index}>
							<PostItem studyplan={plan} />
							<hr className="border-t border-gray-200 mt-4" />
						</React.Fragment>
					))}
					<CaughtUpMessage />
				</div>
			)}
		</div>
	);
};

const CaughtUpMessage = () => (
	<div className="flex flex-col items-center text-center text-gray-600 mt-6">
		<div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full h-12 w-12 flex items-center justify-center text-white text-2xl mb-2">
			✓
		</div>
		<div className="font-semibold">You're all caught up.</div>
		<div className="text-sm">You've seen all new study plans.</div>
	</div>
);

function buildTitleFromSlug(slug) {
	return slug
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

function PostItem({ studyplan }) {
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
		<div className="bg-white rounded-lg p-1 mb-6 w-full">
			{/* Top section with default avatar and LeetCode text */}
			<div className="flex items-center justify-between mb-2">
				<div className="flex items-center">
					<img
						src={leetcode_dp}
						alt="Avatar"
						className="w-8 h-8 rounded-full border-2 border-grey-100 mr-2"
					/>
					<span className="font-semibold mr-1">LeetCode</span>
					<span className="text-gray-400" title={"this is of no use"}>
						• 2d
					</span>
				</div>
				<div>{moreIcon}</div>
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
					className="cursor-pointer"
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
					className="cursor-pointer"
				>
					{studyplan.premiumOnly ? premiumIcon : freeIcon}
				</div>
				<a
					href={`https://leetcode.com/studyplan/${studyplan.slug}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					{sendIcon}
				</a>
			</div>

			{/* Toast container for displaying messages */}
			<ToastContainer position="bottom-left" autoClose={3000} hideProgressBar />

			{/* Question count text */}
			<div
				className="text-sm mb-2 font-semibold"
				onClick={() => setOpenList(true)}
			>
				{studyplan.questionNum} problems
			</div>

			<div className="flex flex-col items-start flex-1">
				<div className="flex items-center mb-1">
					<div className="text-sm font-semibold mr-2">LeetCode</div>
					<div>
						<span className="text-sm mr-1">{studyplan.name}</span>
					</div>
				</div>
				<div className="text-sm">{studyplan.highlight}</div>
			</div>

			{/* View all problems link */}
			<div
				className="ml-auto text-gray-400 cursor-pointer text-base"
				onClick={handleOpenDialog}
			>
				view all {studyplan.questionNum} problems
			</div>

			<Dialog
				open={openList}
				onClose={() => setOpenList(false)}
				maxWidth="xl"
				PaperProps={{
					style: { borderRadius: "10px", overflow: "hidden" },
				}}
			>
				<div
					className="flex flex-col items-start p-4 w-80 overflow-y-scroll"
					style={{
						maxHeight: "400px",
						scrollbarWidth: "none", // for Firefox
					}}
				>
					{loading ? (
						<p>Loading...</p>
					) : problemlist.length > 0 ? (
						problemlist.map((problem, index) => (
							<a
								key={index}
								href={`https://leetcode.com/problems/${problem.titleSlug}`}
								target="_blank"
								rel="noopener noreferrer"
								className="w-full"
							>
								<div className="flex justify-between items-center w-full py-2.5 px-4 border-b last:border-none hover:bg-gray-50">
									<span className="text-left text-gray-700">
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
						<p>No problems found.</p>
					)}
				</div>
			</Dialog>
		</div>
	);
}

export default PostsContainer;
