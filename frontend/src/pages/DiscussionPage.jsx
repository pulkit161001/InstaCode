import React, { useState, useEffect, useCallback } from "react";
import {
	Avatar,
	Tabs,
	Tab,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Button,
} from "@mui/material";
import {
	MoreHorizontal,
	Heart,
	MessageCircle,
	LucideAlignEndHorizontal,
	Share,
	Stars,
	Pin,
	PanelTopOpen,
	PanelTopClose,
} from "lucide-react";
import default_avatar from "../assets/default_avatar.jpg";
import { axiosInstance } from "../lib/axios.js";
import CircularProgress from "@mui/material/CircularProgress";
import { PulseLoader } from "react-spinners";
import {
	calculateTimeAgo,
	formatCount,
	formatFullDate,
} from "../constants/calculation.js";

const TweetBox = ({ tweet, tab, setSelectedTags, selectedTags }) => {
	const author = tweet.node.post.author;
	const authorName = author?.profile?.realName || "Anonymous User";
	const authorAvatar = author?.profile?.userAvatar || default_avatar;
	const authorUsername = author?.username || "Anonymous User";
	const authorReputation = author?.profile?.reputation || 0;
	const postLink = `https://leetcode.com/discuss/${tab}/${tweet.node.id}`;

	return (
		<div className="border border-gray-300 p-4 bg-black mb-0">
			{tweet.node.pinned && (
				<div className="flex items-center">
					<Pin className="h-4 w-4 ml-6 text-gray-600" />
					<span className="ml-2 font-bold text-gray-600">Pinned</span>
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
								className={`font-bold ${
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
									className="text-gray-500 ml-2 cursor-pointer"
									onClick={() => window.open(`/${author.username}`, "_blank")}
								>
									@{authorUsername}
								</span>
							)}
							<span
								className="text-gray-500 ml-2"
								title={formatFullDate(tweet.node.post.creationDate)}
							>
								• {calculateTimeAgo(tweet.node.post.creationDate)}
							</span>
						</div>

						<MoreHorizontal className="text-gray-500 cursor-pointer" />
					</div>
					<p
						className="mt-1 cursor-pointer"
						onClick={() =>
							window.open(`/discuss_topic/${tweet.node.id}`, "_blank")
						}
					>
						{tweet.node.title}
					</p>
					<div className="flex justify-between mt-2">
						<span className="text-gray-500 flex items-center transition-all duration-300 hover:shadow-lg">
							<MessageCircle className="cursor-pointer w-5 h-5 mr-1 hover:stroke-blue-500" />
							{formatCount(tweet.node.commentCount) != 0 &&
								formatCount(tweet.node.commentCount)}
						</span>
						<span className="text-gray-500 flex items-center transition-all duration-300 hover:shadow-lg">
							<Stars className="cursor-pointer w-5 h-5 mr-1 hover:stroke-blue-500" />
							{formatCount(authorReputation) != 0 &&
								formatCount(authorReputation)}
						</span>
						<span className="text-gray-500 flex items-center transition-all duration-300 hover:shadow-lg">
							<Heart className="cursor-pointer w-5 h-5 mr-1 hover:stroke-pink-500" />
							{formatCount(tweet.node.post.voteCount) != 0 &&
								formatCount(tweet.node.post.voteCount)}
						</span>
						<span className="text-gray-500 flex items-center transition-all duration-300 hover:shadow-lg">
							<LucideAlignEndHorizontal className="cursor-pointer w-5 h-5 mr-1 hover:stroke-blue-500" />
							{formatCount(tweet.node.viewCount) != 0 &&
								formatCount(tweet.node.viewCount)}
						</span>
						<a
							href={postLink}
							target="_blank"
							rel="noopener noreferrer"
							className="text-gray-500 flex items-center transition-all duration-300 hover:shadow-lg"
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
						className="rounded-full m-1 p-1 px-3 border border-gray-400 cursor-pointer"
					>
						{tag.name}
					</div>
				))}
			</div>
		</div>
	);
};

const TweetBoxSkimmer = () => (
	<div className="border border-gray-300 p-4 bg-black mb-0">
		<div className="flex items-start">
			<div className="skimmer rounded-full" style={{ width: 40, height: 40 }} />
			<div className="ml-3 flex-grow">
				<div className="flex justify-between">
					<div className="flex">
						<div className="skimmer w-1/3 h-6 rounded-md" />
						<div className="skimmer w-1/4 h-6 rounded-md ml-2" />
						<div className="skimmer w-1/6 h-6 rounded-md ml-2" />
					</div>
					<div className="skimmer w-8 h-8 rounded-md" />
				</div>
				<div className="mt-1">
					<div className="skimmer w-3/4 h-4 rounded-md" />
				</div>
				<div className="flex justify-between mt-2">
					<div className="skimmer w-1/5 h-5 rounded-md mr-2" />
					<div className="skimmer w-1/5 h-5 rounded-md mr-2" />
					<div className="skimmer w-1/5 h-5 rounded-md mr-2" />
					<div className="skimmer w-1/5 h-5 rounded-md" />
				</div>
			</div>
		</div>
	</div>
);

const TagSkimmer = () => (
	<div className="cursor-pointer items-center justify-between bg-gray-300 text-gray-300 rounded-full px-4 py-2 m-1 inline-flex">
		<div className="skimmer w-20 h-5 rounded-md" />
		<div className="h-5 border-l border-black-400 mx-2" />
		<div className="skimmer w-10 h-5 rounded-md" />
	</div>
);

const CategorySkimmer = () => (
	<div className="cursor-pointer items-center justify-between bg-gray-300 text-gray-300 rounded-full px-4 py-2 m-2 inline-block">
		<div className="skimmer w-32 h-5 rounded-md" />
	</div>
);

const Category = ({ selectedCategory, setSelectedCategory, data }) => {
	const handleCategoryClick = () => {
		if (selectedCategory === data.slug) setSelectedCategory();
		else setSelectedCategory(data.slug);
	};

	return (
		<div
			onClick={handleCategoryClick}
			className={`cursor-pointer items-center justify-between rounded-full px-4 py-2 m-2 inline-block  text-gray-100
      ${
				selectedCategory === data.slug ? "bg-sky-600" : "border border-sky-600"
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
	return (
		<div
			onClick={() => handleTagClick({ selectedTags, setSelectedTags, tag })}
			className="cursor-pointer items-center justify-between bg-gray-50 rounded-full px-4 py-2 m-1 inline-flex"
		>
			<span className="text-left">{tag.name}</span>
			<div className="h-5 border-l border-black-400 mx-2" />
			<span>{tag.numTopics}</span>
		</div>
	);
};

const SelectedTag = ({ tag, onRemove }) => (
	<div
		onClick={() => onRemove(tag.slug)}
		className="cursor-pointer items-center justify-between bg-blue-200 rounded-full px-4 py-2 m-1 inline-flex"
	>
		<span>{tag.name}</span>
		<button className="ml-1 text-gray-500 hover:text-gray-700">✕</button>
	</div>
);

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

				<div className="flex justify-center p-4">
					<div className="w-7/12">
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

					<div className="w-5/12 ml-4">
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
		return (
			<div className="bg-white shadow-lg">
				{loading ? (
					Array.from({ length: 5 }).map((_, index) => (
						<TweetBoxSkimmer key={index} />
					))
				) : tweets.length == 0 ? (
					<div className="font-medium text-lg">
						There aren't any discuss topics here yet!
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
		);
	}
);

const TabsSection = React.memo(({ tabValue, tabs, setTabValue }) => {
	return (
		<Tabs
			value={tabValue}
			onChange={(event, newValue) => setTabValue(newValue)}
			className="mb-4 border-b border-gray-300"
			variant="scrollable"
			scrollButtons="auto"
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
		return (
			<div className="flex items-center mb-4">
				<FormControl variant="outlined" className="mr-2">
					<InputLabel id="sort-label">Sort</InputLabel>
					<Select
						labelId="sort-label"
						value={sortOption}
						onChange={(e) => setSortOption(e.target.value)}
						className="rounded-full w-auto"
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
					className="rounded-full flex-grow"
					value={searchedTopic}
					onChange={(e) => setSearchedTopic(e.target.value)}
					autoComplete="off"
				/>
			</div>
		);
	}
);

const CategoriesSection = React.memo(
	({ loading, categories, selectedCategory, setSelectedCategory }) => {
		return (
			<div className="bg-black rounded-2xl p-4 mb-4 border border-gray-400">
				<h3 className="font-bold mb-2 text-xl">Categories</h3>
				{loading
					? Array.from({ length: 5 }).map((_, index) => (
							<CategorySkimmer key={index} />
					  ))
					: categories.map((value, index) => (
							<Category
								key={index}
								data={value}
								selectedCategory={selectedCategory}
								setSelectedCategory={setSelectedCategory}
							/>
					  ))}
			</div>
		);
	}
);

const TrendingSection = React.memo(({ isPanelOpen, setIsPanelOpen }) => {
	const togglePanel = () => {
		setIsPanelOpen((prevState) => !prevState);
	};

	return (
		<div className="bg-black rounded-2xl p-4 mb-4 border border-gray-400 relative">
			<h3 className="font-bold mb-2 text-xl">What's Happening</h3>

			{/* Button to toggle the panel on the top-right */}
			<button
				onClick={togglePanel}
				className="absolute top-4 right-4 text-white"
			>
				{isPanelOpen ? <PanelTopOpen /> : <PanelTopClose />}
			</button>

			{!isPanelOpen && (
				<span className="ml-2 text-sm text-gray-500">
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
		const removeTag = (id) => {
			setSelectedTags((prevTags) =>
				prevTags.filter((prevtag) => prevtag.slug !== id)
			);
		};

		const selectedSlugs = new Set(selectedTags.map((tag) => tag.slug));
		const unSelectedTags = tags.filter((tag) => !selectedSlugs.has(tag.slug));

		return (
			<div className="bg-black rounded-2xl p-4 border border-gray-400">
				{!loading &&
					selectedTags.map((item, index) => (
						<SelectedTag key={index} tag={item} onRemove={removeTag} />
					))}
				<h3 className="font-bold mb-2 text-xl">Tags</h3>
				<TextField
					variant="outlined"
					placeholder="Search tags..."
					value={searchedTag}
					onChange={(e) => setSearchedTag(e.target.value)}
					fullWidth
					className="mb-2"
					autoComplete="off"
				/>
				<div className="mt-2">
					{loading
						? Array.from({ length: 5 }).map((_, index) => (
								<TagSkimmer key={index} />
						  ))
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
		);
	}
);

export default DiscussionPage;
