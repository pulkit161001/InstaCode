import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import {
	Heart,
	MessageCircle,
	MoreHorizontal,
	Share,
	ArrowLeft,
	Stars,
	SlidersHorizontal,
	PenLineIcon,
	CheckCircleIcon,
	SortAsc,
	SortDesc,
} from "lucide-react";
import default_avatar from "../assets/default_avatar.jpg";
import { useParams } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import CircularProgress from "@mui/material/CircularProgress";
import { axiosInstance } from "../lib/axios";
import {
	calculateTimeAgo,
	formatCount,
	formatFullDate,
} from "../constants/calculation.js";
import CodeRenderer from "../components/CodeRenderer.jsx";

const sort_options = [
	{ value: "best", label: "Best", icon: CheckCircleIcon },
	{ value: "most_votes", label: "Most Votes", icon: Heart },
	{ value: "newest_to_oldest", label: "Newest to Oldest", icon: SortAsc },
	{ value: "oldest_to_newest", label: "Oldest to Newest", icon: SortDesc },
];

//TO-DO - i don't want this seperate page i want to show in the discussionPage itself.
// tabs, category, tags will stay as it is (fixed position - slightly scrollable to see all tags, category)
//when i click on any tweet - it will change tweet component to discussionTopic component everything else stays same
//now instead of tweets we have discussionTab so back button is also functional
const CommentCard = ({ comment }) => {
	const author = comment?.post.author;
	const authorName = author?.profile?.realName || "Anonymous User";
	const authorAvatar = author?.profile?.userAvatar || default_avatar;
	const authorUsername = author?.username || "Anonymous User";
	const authorReputation = author?.profile?.reputation || 0;
	const [replies, setReplies] = useState([]);
	const [loadingReplies, setLoadingReplies] = useState(false);
	const [showReplies, setShowReplies] = useState(true);

	const fetchCommentReplies = async () => {
		if (comment.numChildren == 0) return;
		setLoadingReplies(true);
		try {
			const res = await axiosInstance.get(`/discusstopic/reply/${comment.id}`);
			setReplies(res.data.topicCommentReply.commentReplies);
		} catch (error) {
			console.error("Error fetching replies:", error);
		} finally {
			setLoadingReplies(false);
		}
	};

	return (
		<div className="border-t border-gray-200 py-4">
			<div className="flex items-start">
				<Avatar
					alt={authorName}
					src={authorAvatar}
					className={author ? "cursor-pointer" : ""}
					onClick={() => author && window.open(`/${authorUsername}`, "_blank")}
				/>
				<div className="ml-3 flex-grow">
					<div className="flex justify-between">
						<div className="flex">
							<h3
								className={`font-bold ${
									author ? "cursor-pointer hover:underline" : ""
								}`}
								onClick={() =>
									author && window.open(`/${authorUsername}`, "_blank")
								}
							>
								{authorName}
							</h3>
							<span
								className={`text-gray-500 ml-2 ${
									author ? "cursor-pointer" : ""
								}`}
								onClick={() =>
									author && window.open(`/${authorUsername}`, "_blank")
								}
							>
								@{authorUsername}
							</span>
							{comment.post.creationDate == comment.post.updationDate ? (
								<span
									className="text-gray-500 ml-2"
									title={`Created: ${formatFullDate(
										comment.post.creationDate
									)}`}
								>
									• {calculateTimeAgo(comment.post.creationDate)}
								</span>
							) : (
								<div
									className="flex justify-center items-center text-gray-500 ml-2"
									title={`Created: ${formatFullDate(
										comment.post.creationDate
									)}\nEdited: ${formatFullDate(comment.post.updationDate)}`}
								>
									<PenLineIcon className="flex h-4 w-4" />{" "}
									{calculateTimeAgo(comment.post.updationDate)}
								</div>
							)}
						</div>

						<MoreHorizontal className="text-gray-500 cursor-pointer" />
					</div>
					{/* <p className="mt-1">{comment.post.content}</p> */}
					<CodeRenderer inputText={comment.post.content} />
					<div className="flex justify-between mt-2">
						<span className="text-gray-500 flex items-center transition-all duration-300 hover:shadow-lg">
							{/* onClick={()=>fetchCommentReplies(comment.id)} => /discusstopic/reply/1502157 */}
							<MessageCircle
								onClick={() => {
									if (replies.length === 0) {
										fetchCommentReplies();
									} else {
										setShowReplies(!showReplies);
									}
								}}
								className="cursor-pointer w-5 h-5 mr-1 hover:stroke-blue-500"
							/>
							{formatCount(comment.numChildren) != 0 &&
								formatCount(comment.numChildren)}
						</span>

						<span className="text-gray-500 flex items-center transition-all duration-300 hover:shadow-lg">
							<Stars className="cursor-pointer w-5 h-5 mr-1 hover:stroke-blue-500" />
							{formatCount(authorReputation) != 0 &&
								formatCount(authorReputation)}
						</span>
						<span className="text-gray-500 flex items-center transition-all duration-300 hover:shadow-lg">
							<Heart className="cursor-pointer w-5 h-5 mr-1 hover:stroke-pink-500" />
							{formatCount(comment.post.voteCount) != 0 &&
								formatCount(comment.post.voteCount)}
						</span>
						<a
							href={comment.post.author.profile.userAvatar}
							target="_blank"
							rel="noopener noreferrer"
							className="text-gray-500 flex items-center transition-all duration-300 hover:shadow-lg"
						>
							<Share className="cursor-pointer w-5 h-5 mr-1 hover:stroke-blue-500" />
						</a>
					</div>
				</div>
			</div>

			{loadingReplies && (
				<div className="mt-2 text-gray-500">Loading replies...</div>
			)}
			{showReplies && replies.length > 0 && (
				<div className="mt-4 ml-10 pl-10 border-l-2 border-gray-300">
					{replies.map((reply, index) => (
						<CommentCard key={index} comment={reply} />
					))}
				</div>
			)}
		</div>
	);
};

const DiscussionTopicPage = () => {
	const [showDropdown, setShowDropdown] = useState(false);
	const [orderBy, setOrderBy] = useState("best");
	const { topicId } = useParams();
	const [loading, setLoading] = useState(true);
	const [discussionData, setDiscussionData] = useState({});
	const [discussionComments, setDiscussionComments] = useState([{}]);

	const toggleDropdown = () => {
		setShowDropdown((prev) => !prev);
	};

	const handleOptionSelect = (option) => {
		setOrderBy(option);
		setShowDropdown(false); // Close dropdown after selection
	};

	useEffect(() => {
		setLoading(true);
		const getDiscussionData = async () => {
			try {
				const res = await axiosInstance.get(`/discusstopic/${topicId}`);
				setDiscussionData(res.data.discussTopicDetails.topic);
				setDiscussionComments(
					res.data.discussionTopicComments.topicComments.data
				);
			} catch (error) {
				console.error("Error fetching user data:", error);
				setDiscussionData(null);
				setDiscussionComments([null]);
			} finally {
				setLoading(false);
			}
		};
		getDiscussionData();
	}, [topicId]);

	return (
		<>
			{loading ? (
				<div className="flex justify-center items-center min-h-screen">
					<CircularProgress />
				</div>
			) : (
				<div className="max-w-4xl mx-auto px-4 py-6 border-x bg-black rounded-xl">
					{/* Back Button and Text */}
					<div className="flex items-center space-x-4">
						<ArrowLeft />
						<h1 className="text-xl font-semibold">{discussionData.title}</h1>
					</div>

					{/* User Info */}
					<div className="flex items-center justify-between mt-6">
						<div className="flex items-center space-x-3">
							<Avatar
								alt="User Avatar"
								src={
									discussionData?.post?.author?.profile?.userAvatar ||
									default_avatar
								}
								className={`${
									discussionData?.post?.author ? "cursor-pointer" : ""
								}`}
								onClick={() =>
									discussionData?.post?.author &&
									window.open(
										`/${discussionData?.post?.author?.username}`,
										"_blank"
									)
								}
							/>
							<div>
								<p
									className={`font-semibold ${
										discussionData?.post?.author
											? "cursor-pointer hover:underline"
											: ""
									}`}
									onClick={() =>
										discussionData?.post?.author &&
										window.open(
											`/${discussionData?.post?.author?.username}`,
											"_blank"
										)
									}
								>
									{discussionData?.post?.author?.profile?.realName ||
										"Anonymous User"}
								</p>
								{discussionData.post.author && (
									<p
										className="text-gray-500 cursor-pointer"
										onClick={() =>
											discussionData?.post?.author &&
											window.open(
												`/${discussionData?.post?.author?.username}`,
												"_blank"
											)
										}
									>
										@{discussionData?.post?.author?.username}
									</p>
								)}
							</div>
						</div>
						<MoreHorizontal className="text-gray-500 cursor-pointer" />
					</div>

					{/* Big Paragraph */}
					<CodeRenderer inputText={discussionData.post.content} />
					{/* <p className="mt-4 text-lg text-gray-700">{discussionData.post.content}</p> */}

					{/* Time, Date, and Views */}
					<div className="flex justify-between items-center text-gray-500 mt-6 ">
						<span>
							{formatFullDate(discussionData.post.creationDate)} ·{" "}
							<span className="font-medium text-white">
								{formatCount(discussionData.viewCount)}
							</span>{" "}
							Views
							{discussionData.post.creationDate !=
								discussionData.post.updationDate && (
								<div className="flex justify-center items-center">
									<PenLineIcon className="flex h-4 w-4" /> Last edited{" "}
									{formatFullDate(discussionData.post.updationDate)}
								</div>
							)}
						</span>
					</div>

					{/* Icons and Text (comment, like, share, dropdown) */}
					<div className="flex justify-between mt-2 mb-2 border-t pt-2 relative">
						<span className="text-gray-500 flex items-center transition-all duration-300 hover:shadow-lg">
							<MessageCircle className="cursor-pointer w-5 h-5 mr-1 hover:stroke-blue-500" />
							{formatCount(discussionData.topLevelCommentCount)}
						</span>
						{discussionData.post.author && (
							<span className="text-gray-500 flex items-center transition-all duration-300 hover:shadow-lg">
								<Stars className="cursor-pointer w-5 h-5 mr-1 hover:stroke-blue-500" />
								{formatCount(discussionData.post.author.profile.reputation)}
							</span>
						)}
						<span className="text-gray-500 flex items-center transition-all duration-300 hover:shadow-lg">
							<Heart className="cursor-pointer w-5 h-5 mr-1 hover:stroke-pink-500" />
							{formatCount(discussionData.post.voteCount)}
						</span>
						<span
							onClick={toggleDropdown}
							className="text-gray-500 flex items-center cursor-pointer"
						>
							<SlidersHorizontal className="w-5 h-5 mr-1 hover:stroke-pink-500" />
						</span>
						<a
							target="_blank"
							rel="noopener noreferrer"
							className="text-gray-500 flex items-center transition-all duration-300 hover:shadow-lg"
						>
							<Share className="cursor-pointer w-5 h-5 mr-4 hover:stroke-blue-500" />
						</a>

						{showDropdown && (
							<div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
								<ul className="py-1 text-gray-700">
									{sort_options.map((option) => (
										<li
											key={option.value}
											onClick={() => handleOptionSelect(option.value)}
											className={`flex items-center px-4 py-2 cursor-pointer ${
												orderBy === option.value
													? "bg-gray-100"
													: "hover:bg-gray-100"
											}`}
										>
											<option.icon className="mr-2 w-4 h-4" />{" "}
											{/* Icon with spacing */}
											{option.label}
										</li>
									))}
								</ul>
							</div>
						)}
					</div>

					{/* Repeatable Component */}
					{/* as we scroll down we fetch more comments */}
					{discussionComments.map((comment, index) => (
						<CommentCard key={index} comment={comment} />
					))}
				</div>
			)}
		</>
	);
};

export default DiscussionTopicPage;
