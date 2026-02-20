import {
	Avatar,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Tab,
	Tabs,
	TextField,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import {
	Heart,
	LucideAlignEndHorizontal,
	MessageCircle,
	MoreHorizontal,
	PanelTopClose,
	PanelTopOpen,
	Pin,
	Share,
	Stars,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import default_avatar from "../assets/default_avatar.jpg";
import {
	calculateTimeAgo,
	formatCount,
	formatFullDate,
} from "../constants/calculation.js";
import { axiosInstance } from "../lib/axios.js";
import { useTheme } from "../hooks/useTheme";

const TweetBox = ({ tweet, tab, setSelectedTags, selectedTags }) => {
	const { isDarkMode } = useTheme();
	const author = tweet.node.post.author;
	const authorName = author?.profile?.realName || "Anonymous User";
	const authorAvatar = author?.profile?.userAvatar || default_avatar;
	const authorUsername = author?.username || "Anonymous User";
	const authorReputation = author?.profile?.reputation || 0;
	const postLink = `https://leetcode.com/discuss/${tab}/${tweet.node.id}`;

	return (
		<div className={`border p-4 mb-0 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}`}>
			{tweet.node.pinned && (
				<div className="flex items-center">
					<Pin className={`h-4 w-4 ml-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
					<span className={`ml-2 font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Pinned</span>
				</div>
			)}

			<div className="flex items-start">
				<Avatar
					alt={authorName}
					src={authorAvatar}
					className={author ? "cursor-pointer" : ""}
					onClick={() => author && window.open(`/${author.username}`, "_blank")}
				/>
				<div className="ml-3 flex-grow">
					<div className="flex justify-between">
						<div className="flex">
							<h3
								className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} ${
									author ? "cursor-pointer hover:underline" : ""
								}`}
								onClick={() =>
									author && window.open(`/${author.username}`, "_blank")
								}
							>
								{authorName}
							</h3>
							{author && (
								<span
									className={`ml-2 cursor-pointer ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
									onClick={() => window.open(`/${author.username}`, "_blank")}
								>
									@{authorUsername}
								</span>
							)}
							<span
								className={`ml-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
								title={formatFullDate(tweet.node.post.creationDate)}
							>
								• {calculateTimeAgo(tweet.node.post.creationDate)}
							</span>
						</div>

						<MoreHorizontal className={`cursor-pointer ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
					</div>
					<p
						className={`mt-1 cursor-pointer ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}
						onClick={() =>
							window.open(`/discuss_topic/${tweet.node.id}`, "_blank")
						}
					>
						{tweet.node.title}
					</p>
					<div className="flex justify-between mt-2">
						<span className={`flex items-center transition-all duration-300 hover:shadow-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
							<MessageCircle className="cursor-pointer w-5 h-5 mr-1 hover:stroke-blue-500" />
							{formatCount(tweet.node.commentCount) != 0 &&
								formatCount(tweet.node.commentCount)}
						</span>
						<span className={`flex items-center transition-all duration-300 hover:shadow-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
							<Stars className="cursor-pointer w-5 h-5 mr-1 hover:stroke-blue-500" />
							{formatCount(authorReputation) != 0 &&
								formatCount(authorReputation)}
						</span>
						<span className={`flex items-center transition-all duration-300 hover:shadow-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
							<Heart className="cursor-pointer w-5 h-5 mr-1 hover:stroke-pink-500" />
							{formatCount(tweet.node.post.voteCount) != 0 &&
								formatCount(tweet.node.post.voteCount)}
						</span>
						<span className={`flex items-center transition-all duration-300 hover:shadow-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
							<LucideAlignEndHorizontal className="cursor-pointer w-5 h-5 mr-1 hover:stroke-blue-500" />
							{formatCount(tweet.node.viewCount) != 0 &&
								formatCount(tweet.node.viewCount)}
						</span>
						<a
							href={postLink}
							target="_blank"
							rel="noopener noreferrer"
							className={`flex items-center transition-all duration-300 hover:shadow-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
						>
							<Share className="cursor-pointer w-5 h-5 mr-1 hover:stroke-blue-500" />
						</a>
					</div>
				</div>
			</div>
			<div className="pt-3 flex font-normal text-base flex-wrap ">
				{tweet.node.tags.map((tag, index) => (
					<div
						onClick={() =>
							handleTagClick({ selectedTags, setSelectedTags, tag })
						}
						key={index}
						className={`rounded-full m-1 p-1 px-3 border cursor-pointer ${isDarkMode ? 'border-gray-600 text-gray-300' : 'border-gray-400 text-gray-800'}`}
					>
						{tag.name}
					</div>
				))}
			</div>
		</div>
	);
};

const Category = ({ selectedCategory, setSelectedCategory, data }) => {
	const { isDarkMode } = useTheme();
	const handleCategoryClick = () => {
		if (selectedCategory === data.slug) setSelectedCategory();
		else setSelectedCategory(data.slug);
	};

	return (
		<div
			onClick={handleCategoryClick}
			className={`cursor-pointer items-center justify-between rounded-full px-4 py-2 m-2 inline-block
      ${
				selectedCategory === data.slug ? "bg-sky-600 text-white" : `border border-sky-600 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`
			}`}
		>
			<span className="text-left font-bold">{data.title}</span>
		</div>
	);
};

const handleTagClick = ({ selectedTags, setSelectedTags, tag }) => {
	// Check if the tag is already in the selectedTags array
	if (!selectedTags.some((selectedTag) => selectedTag.name === tag.name)) {
		// If not, add it to the selectedTags array
		setSelectedTags((prevTags) => [...prevTags, tag]);
	}
};

const Tag = ({ selectedTags, setSelectedTags, tag }) => {
	const { isDarkMode } = useTheme();
	return (
		<div
			onClick={() => handleTagClick({ selectedTags, setSelectedTags, tag })}
			className={`cursor-pointer items-center justify-between rounded-full px-4 py-2 m-1 inline-flex ${isDarkMode ? "bg-gray-700 text-gray-200" : "bg-gray-50 text-gray-900"}`}
		>
			<span className="text-left">{tag.name}</span>
			<div className={`h-5 border-l mx-2 ${isDarkMode ? "border-gray-600" : "border-black-400"}`} />
			<span>{tag.numTopics}</span>
		</div>
	);
};

const SelectedTag = ({ tag, onRemove }) => {
	const { isDarkMode } = useTheme();
	return (
		<div
			onClick={() => onRemove(tag.slug)}
			className={`cursor-pointer items-center justify-between rounded-full px-4 py-2 m-1 inline-flex ${isDarkMode ? "bg-blue-900 text-gray-100" : "bg-blue-200 text-gray-900"}`}
		>
			<span>{tag.name}</span>
			<button className={`ml-1 ${isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`}>✕</button>
		</div>
	);
};

const DiscussionPage = () => {
	const [tweets, setTweets] = useState([]);
	const [totalTweets, setTotalTweets] = useState(0);

	const [pageLoading, setPageLoading] = useState(false);
	const [listLoading, setListLoading] = useState(false);
	const [moreListLoading, setMoreListLoading] = useState(false);
	const [tagsLoading, setTagsLoading] = useState(false);

	const [tabValue, setTabValue] = useState(0);
	const [tabs, setTabs] = useState([]);
	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("");
	const [tags, setTags] = useState([]);
	const [selectedTags, setSelectedTags] = useState([]);
	const [searchedTopic, setSearchedTopic] = useState("");
	const [searchedTag, setSearchedTag] = useState([]);
	const [sortOption, setSortOption] = useState("hot");
	const [isPanelOpen, setIsPanelOpen] = useState(true);

	const getTagSlugsArray = useCallback(
		() => selectedTags.map((tag) => tag.slug),
		[selectedTags]
	);

	const fetchTabs = async () => {
		const res = await axiosInstance.get("/discuss");
		setTabs(res.data.rootCategory);
	};

	const fetchDetails = async () => {
		//tabs array is not build and value is undefined
		if (!tabs[tabValue]) return;
		setPageLoading(true);
		//query, sortType
		const res = await axiosInstance.get(`/discuss/${tabs[tabValue].slug}`, {
			params: {
				orderBy: sortOption, // Pass the sort option parameter
				query: searchedTopic, // Pass the search topic as the query parameter
			},
		});
		setSortOption("hot");
		setCategories(res.data.subCategoryDetails.discussCategory.subcategories);
		setTags(res.data.topicTags.topicTags);
		setTweets(res.data.topicList.categoryTopicList.edges);
		setTotalTweets(res.data.topicList.categoryTopicList.totalNum);
		setPageLoading(false);
	};

	const handleLoadMore = () => {
		fetchNewList(tweets.length, false);
	};

	const fetchNewList = async (skip = 0, includeTags = true) => {
		if (skip === 0) setListLoading(true);
		else setMoreListLoading(true);
		if (includeTags) setTagsLoading(true);

		try {
			const endpoint = includeTags ? "/list-and-tags-only" : "/list-only";
			const res = await axiosInstance.get(
				`/discuss/${tabs[tabValue]?.slug}${endpoint}`,
				{
					params: {
						orderBy: sortOption, // Pass the sort option parameter
						query: searchedTopic, // Pass the search topic as the query parameter
						skip,
						tag: getTagSlugsArray(),
						sub_category: selectedCategory,
					},
				}
			);

			// Update state with the new topic list data
			const newTweets = res.data.topicList.categoryTopicList.edges;
			setTotalTweets(res.data.topicList.categoryTopicList.totalNum);
			setTweets((prevTweets) =>
				skip === 0 ? newTweets : [...prevTweets, ...newTweets]
			);

			if (includeTags) {
				setTags(res.data.topicTags.topicTags);
			}
		} catch (error) {
			console.error("Failed to fetch topic list:", error.message);
		} finally {
			setListLoading(false);
			setTagsLoading(false);
			setMoreListLoading(false);
		}
	};

	const fetchNewTags = async () => {
		setTagsLoading(true);
		try {
			// Use template literals to include the necessary query parameters
			const res = await axiosInstance.get(
				`/discuss/${tabs[tabValue].slug}/tags-only`,
				{
					params: {
						query: searchedTag,
						tag: getTagSlugsArray(),
					},
				}
			);

			setTags(res.data.topicTags.topicTags);
		} catch (error) {
			console.error("Failed to fetch topic list:", error.message);
		} finally {
			setTagsLoading(false);
		}
	};

	useEffect(() => {
		fetchTabs();
	}, []);

	useEffect(() => {
		fetchDetails();
	}, [tabValue, tabs]);

	useEffect(() => {
		const debounceTimeout = setTimeout(() => {
			if (searchedTopic) setSortOption("most_relevant");
			else setSortOption("hot");
			fetchNewList(0, false);
		}, 500);
		return () => clearTimeout(debounceTimeout);
	}, [searchedTopic]);

	useEffect(() => {
		fetchNewList(0, false);
	}, [sortOption]);

	useEffect(() => {
		fetchNewList();
	}, [selectedTags]);

	useEffect(() => {
		setSelectedTags([]);
	}, [selectedCategory]);

	useEffect(() => {
		const debounceTimeout = setTimeout(() => {
			fetchNewTags();
		}, 500);
		return () => clearTimeout(debounceTimeout);
	}, [searchedTag]);

	return (
		<div>
			<>
				<div className="overflow-x-auto scrollbar-hide">
					<TabsSection
						tabs={tabs}
						tabValue={tabValue}
						setTabValue={setTabValue}
					/>
				</div>

				<div className="flex flex-col md:flex-row justify-center gap-3 md:gap-4 p-3 md:p-4">
					<div className="w-full md:w-7/12">
						<SortAndSearchSection
							sortOption={sortOption}
							setSortOption={setSortOption}
							searchedTopic={searchedTopic}
							setSearchedTopic={setSearchedTopic}
						/>
						<TweetsSection
							loading={listLoading}
							tweets={tweets}
							selectedTags={selectedTags}
							setSelectedTags={setSelectedTags}
							tabs={tabs}
							tabValue={tabValue}
						/>
					</div>

					<div className="w-full md:w-5/12">
						<TrendingSection
							isPanelOpen={isPanelOpen}
							setIsPanelOpen={setIsPanelOpen}
						/>

						<CategoriesSection
							loading={pageLoading}
							categories={categories}
							selectedCategory={selectedCategory}
							setSelectedCategory={setSelectedCategory}
						/>

						<TagsSection
							loading={tagsLoading}
							tags={tags}
							selectedTags={selectedTags}
							setSelectedTags={setSelectedTags}
							searchedTag={searchedTag}
							setSearchedTag={setSearchedTag}
						/>
					</div>
				</div>

				<LoadMoreSection
					loadingMore={moreListLoading}
					totalTweets={totalTweets}
					tweets={tweets}
					handleLoadMore={handleLoadMore}
				/>
			</>
		</div>
	);
};

const LoadMoreSection = ({
	loadingMore,
	totalTweets,
	tweets,
	handleLoadMore,
}) => {
	return (
		<>
			{loadingMore ? (
				<div className="flex justify-center items-center mt-4">
					<CircularProgress />
				</div>
			) : (
				totalTweets > tweets.length && (
					<div className="flex justify-center mt-4">
						<div
							className="inline-flex justify-center items-center border border-gray-400 rounded-lg px-20 py-1 cursor-pointer"
							onClick={handleLoadMore}
						>
							Show More
						</div>
					</div>
				)
			)}
		</>
	);
};

const TweetsSection = React.memo(
	({ loading, tweets, selectedTags, setSelectedTags, tabs, tabValue }) => {
		const { isDarkMode } = useTheme();
		return (
			<>
				<Backdrop
					sx={{ color: '#fff', zIndex: 1200, backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)' }}
					open={loading}
				>
					<CircularProgress color="inherit" />
				</Backdrop>
				<div className={`shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
					{tweets.length == 0 && !loading ? (
						<div className={`flex justify-center items-center py-16 font-medium text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
							There aren&apos;t any discuss topics here yet!
						</div>
					) : (
						tweets.map((tweet, index) => (
							<TweetBox
								key={index}
								tweet={tweet}
								tab={tabs[tabValue].slug}
								selectedTags={selectedTags}
								setSelectedTags={setSelectedTags}
							/>
						))
					)}
				</div>
			</>
		);
	}
);

const TabsSection = React.memo(({ tabValue, tabs, setTabValue }) => {
	const { isDarkMode } = useTheme();
	return (
		<Tabs
			value={tabValue}
			onChange={(event, newValue) => setTabValue(newValue)}
			className={`mb-4 border-b ${isDarkMode ? "border-gray-700" : "border-gray-300"}`}
			variant="scrollable"
			scrollButtons="auto"
			sx={{
				'& .MuiTab-root': {
					color: isDarkMode ? '#9ca3af' : '#6b7280',
					'&.Mui-selected': {
						color: isDarkMode ? '#3b82f6' : '#0284c7',
					},
				},
				'& .MuiTabs-indicator': {
					backgroundColor: isDarkMode ? '#3b82f6' : '#0284c7',
				},
			}}
		>
			{tabs.map((value, index) => (
				<Tab
					label={value.title}
					key={index}
					className="flex-grow text-center"
				/>
			))}
		</Tabs>
	);
});

const SortAndSearchSection = React.memo(
	({ sortOption, setSortOption, searchedTopic, setSearchedTopic }) => {
		const { isDarkMode } = useTheme();
		return (
			<div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 mb-4">
				<FormControl variant="outlined" className="w-full md:w-auto">
					<InputLabel
						id="sort-label"
						sx={{ color: isDarkMode ? '#9ca3af' : undefined, '&.Mui-focused': { color: isDarkMode ? '#e5e7eb' : undefined } }}
					>
						Sort
					</InputLabel>
					<Select
						labelId="sort-label"
						value={sortOption}
						onChange={(e) => setSortOption(e.target.value)}
						className="rounded-full w-auto"
						sx={{
							color: isDarkMode ? '#f3f4f6' : undefined,
							'& .MuiOutlinedInput-notchedOutline': {
								borderColor: isDarkMode ? '#4b5563' : undefined,
							},
							'&:hover .MuiOutlinedInput-notchedOutline': {
								borderColor: isDarkMode ? '#6b7280' : undefined,
							},
							'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
								borderColor: isDarkMode ? '#9ca3af' : undefined,
							},
						}}
					>
						<MenuItem value="hot">Hot</MenuItem>
						<MenuItem value="newest_to_oldest">Newest to Oldest</MenuItem>
						<MenuItem value="most_votes">Most Votes</MenuItem>
						<MenuItem value="most_relevant">Most Relevant</MenuItem>
					</Select>
				</FormControl>
				<TextField
					variant="outlined"
					placeholder="Search topics or comments..."
					className="rounded-full flex-grow w-full md:flex-grow"
					value={searchedTopic}
					onChange={(e) => setSearchedTopic(e.target.value)}
					autoComplete="off"
					sx={{
						'& .MuiOutlinedInput-root': {
							color: isDarkMode ? '#f3f4f6' : undefined,
							'& fieldset': {
								borderColor: isDarkMode ? '#4b5563' : undefined,
							},
							'&:hover fieldset': {
								borderColor: isDarkMode ? '#6b7280' : undefined,
							},
							'&.Mui-focused fieldset': {
								borderColor: isDarkMode ? '#9ca3af' : undefined,
							},
						},
						'& .MuiOutlinedInput-input::placeholder': {
							color: isDarkMode ? '#6b7280' : undefined,
							opacity: 1,
						},
					}}
				/>
			</div>
		);
	}
);

const CategoriesSection = React.memo(
	({ loading, categories, selectedCategory, setSelectedCategory }) => {
		const { isDarkMode } = useTheme();
		return (
			<>
				<Backdrop
					sx={{ color: '#fff', zIndex: 1200, backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)' }}
					open={loading}
				>
					<CircularProgress color="inherit" />
				</Backdrop>
				<div className={`rounded-2xl p-4 mb-4 border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-400"}`}>
					<h3 className={`font-bold mb-2 text-xl ${isDarkMode ? "text-white" : ""}`}>Categories</h3>
					{categories.map((value, index) => (
						<Category
							key={index}
							data={value}
							selectedCategory={selectedCategory}
							setSelectedCategory={setSelectedCategory}
						/>
					))}
				</div>
			</>
		);
	}
);

const TrendingSection = React.memo(({ isPanelOpen, setIsPanelOpen }) => {
	const { isDarkMode } = useTheme();
	const togglePanel = () => {
		setIsPanelOpen((prevState) => !prevState);
	};

	return (
		<div className={`rounded-2xl p-4 mb-4 border relative ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-400"}`}>
			<h3 className={`font-bold mb-2 text-xl ${isDarkMode ? "text-white" : ""}`}>What&apos;s Happening</h3>

			{/* Button to toggle the panel on the top-right */}
			<button
				onClick={togglePanel}
				className={`absolute top-4 right-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
			>
				{isPanelOpen ? <PanelTopOpen /> : <PanelTopClose />}
			</button>

			{!isPanelOpen && (
				<span className={`ml-2 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
					Show data from LeetCode homescreen, someposted job experience
				</span>
			)}
		</div>
	);
});

const TagsSection = React.memo(
	({
		loading,
		tags,
		selectedTags,
		setSelectedTags,
		searchedTag,
		setSearchedTag,
	}) => {
		const { isDarkMode } = useTheme();
		const removeTag = (id) => {
			setSelectedTags((prevTags) =>
				prevTags.filter((prevtag) => prevtag.slug !== id)
			);
		};

		const selectedSlugs = new Set(selectedTags.map((tag) => tag.slug));
		const unSelectedTags = tags.filter((tag) => !selectedSlugs.has(tag.slug));

		return (
			<>
				<Backdrop
					sx={{ color: '#fff', zIndex: 1200, backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)' }}
					open={loading}
				>
					<CircularProgress color="inherit" />
				</Backdrop>
				<div className={`rounded-2xl p-4 border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-400"}`}>
				{!loading &&
					selectedTags.map((item, index) => (
						<SelectedTag key={index} tag={item} onRemove={removeTag} />
					))}
				<h3 className={`font-bold mb-2 text-xl ${isDarkMode ? "text-white" : ""}`}>Tags</h3>
				<TextField
					variant="outlined"
					placeholder="Search tags..."
					value={searchedTag}
					onChange={(e) => setSearchedTag(e.target.value)}
					fullWidth
					className="mb-2"
					autoComplete="off"
					sx={{
						'& .MuiOutlinedInput-root': {
							color: isDarkMode ? '#f3f4f6' : undefined,
							'& fieldset': {
								borderColor: isDarkMode ? '#4b5563' : undefined,
							},
							'&:hover fieldset': {
								borderColor: isDarkMode ? '#6b7280' : undefined,
							},
							'&.Mui-focused fieldset': {
								borderColor: isDarkMode ? '#9ca3af' : undefined,
							},
						},
						'& .MuiOutlinedInput-input::placeholder': {
							color: isDarkMode ? '#6b7280' : undefined,
							opacity: 1,
						},
					}}
				/>
				<div className="mt-2">
					{loading
						? <div className="flex justify-center items-center py-12">
							<CircularProgress />
						</div>
						: unSelectedTags.map((item, index) => (
								<Tag
									key={index}
									tag={item}
									selectedTags={selectedTags}
									setSelectedTags={setSelectedTags}
								/>
						  ))}
				</div>
			</div>
			</>
		);
	}
);

export default DiscussionPage;
