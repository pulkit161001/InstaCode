import express, { query } from "express";
import {
	PORT,
	details_query,
	yearly_query,
	recent_submission_query,
	study_plan_query,
	more_study_plan_query,
	study_plan_questions_query,
	question_query,
	favorite_problems_list_query,
	potd_query,
	gfg_potd_query,
	discussion_query,
	sub_category_query,
	category_topic_tags_query,
	discussion_topic_list_query,
	discussion_topic_query,
	discussion_topic_comments_query,
	discussion_topic_comment_reply_query,
} from "./config.js";
import axios from "axios";
import cors from "cors";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
	});
}

app.get("/studyplan", async (req, res) => {
	try {
		const userDetails = await getStudyPlan();
		if (!userDetails) {
			return res.status(404).json({ error: "Study Plan not found" });
		}
		res.json(userDetails);
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ error: "Failed to fetch LeetCode user details" });
	}
});

app.get("/morestudyplan/:category", async (req, res) => {
	const { category } = req.params;
	try {
		const userDetails = await getMoreStudyPlan(category);
		if (!userDetails) {
			return res.status(404).json({ error: "Study Plan not found" });
		}
		res.json(userDetails);
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ error: "Failed to fetch LeetCode user details" });
	}
});

app.get("/studyplanquestions/:category", async (req, res) => {
	const { category } = req.params;
	try {
		const userDetails = await getStudyPlanQuestions(category);
		if (!userDetails) {
			return res.status(404).json({ error: "Study Plan not found" });
		}
		res.json(userDetails);
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ error: "Failed to fetch LeetCode user details" });
	}
});

app.post("/compile", (req, res) => {
	let code = req.body.code;
	let language = req.body.language;
	let input = req.body.input;

	let languageMap = {
		cpp: { language: "c++", version: "10.2.0" },
		java: { language: "java", version: "15.0.2" },
		python: { language: "python", version: "3.10.0" },
	};

	if (!languageMap[language]) {
		return res.status(400).send({ error: "Unsupported language" });
	}

	// Prepare data for API request
	let data = {
		language: languageMap[language].language,
		version: languageMap[language].version,
		files: [
			{
				name: "main",
				content: code,
			},
		],
		stdin: input,
	};

	let config = {
		method: "post",
		url: "https://emkc.org/api/v2/piston/execute",
		headers: {
			"Content-Type": "application/json",
		},
		data: data,
	};

	// calling the code compilation API
	axios(config)
		.then((response) => {
			res.json(response.data.run);
		})
		.catch((error) => {
			res.status(500).send({ error: "Something went wrong", error });
		});
});

app.get("/discuss", async (req, res) => {
	try {
		const discussionDetails = await getDiscussionDetails();
		if (!discussionDetails) {
			return res.status(404).json({ error: "Discussion not found" });
		}
		res.json(discussionDetails);
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ error: "Failed to fetch LeetCode user details" });
	}
});

// discuss/interview-question only this have sub-category
//sub-category, topicTags, topicLists
app.get("/discuss/:category", async (req, res) => {
	const { category } = req.params;
	//this query parameter is the searched topic query paramter text
	const { currentPage, orderBy, query, tag } = req.query;
	const selectedTags = Array.isArray(tag) ? tag : tag ? [tag] : [];
	try {
		const subCategoryDetails = await getSubCategoryDetails([category]);
		const topicTags = await getCategoryTopicTags([category], selectedTags);
		const first = 15;
		const skip = (currentPage - 1) * first;
		const topicList = await getCategoryTopicList(
			[category],
			skip,
			orderBy,
			query,
			selectedTags,
			first
		);
		if (!subCategoryDetails || !topicTags || !topicList) {
			return res.status(404).json({ error: "Discussion not found" });
		}
		res.json({ subCategoryDetails, topicTags, topicList });
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ error: "Failed to fetch LeetCode user details" });
	}
});

app.get("/discuss/:category/tags-only", async (req, res) => {
	const { category } = req.params;
	const { query, tag } = req.query;
	const selectedTags = Array.isArray(tag) ? tag : tag ? [tag] : [];

	try {
		const topicTags = await getCategoryTopicTags(
			[category],
			selectedTags,
			query
		);
		if (!topicTags) {
			return res.status(404).json({ error: "No tags found" });
		}

		res.json({ topicTags });
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ error: "Failed to fetch tags" });
	}
});

app.get("/discuss/:category/list-and-tags-only", async (req, res) => {
	const { category } = req.params;
	const { skip, orderBy, query, tag, sub_category } = req.query;
	const selectedTags = Array.isArray(tag) ? tag : tag ? [tag] : [];
	const first = 15;
	const categories = sub_category ? [category, sub_category] : [category];

	try {
		const topicList = await getCategoryTopicList(
			categories,
			skip,
			orderBy,
			query,
			selectedTags,
			first
		);
		const topicTags = await getCategoryTopicTags(categories, selectedTags);
		if (!topicList || !topicTags) {
			return res.status(404).json({ error: "No topics or tags found" });
		}
		res.json({ topicList, topicTags });
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ error: "Failed to fetch topics or tags" });
	}
});

app.get("/discuss/:category/list-only", async (req, res) => {
	const { category } = req.params;
	const { skip, orderBy, query, tag, sub_category } = req.query;
	const selectedTags = Array.isArray(tag) ? tag : tag ? [tag] : [];
	const first = 15;
	const categories = sub_category ? [category, sub_category] : [category];

	try {
		const topicList = await getCategoryTopicList(
			categories,
			skip,
			orderBy,
			query,
			selectedTags,
			first
		);

		if (!topicList) {
			return res.status(404).json({ error: "No topics found" });
		}

		res.json({ topicList });
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ error: "Failed to fetch topic list" });
	}
});

app.get("/discusstopic/:topicId", async (req, res) => {
	const { topicId } = req.params;
	const { orderBy, pageNo, numPerPage } = req.query;
	try {
		const discussTopicDetails = await getDiscussionTopicDetails(topicId);
		const discussionTopicComments = await getDiscussionTopicComments(
			orderBy,
			pageNo,
			numPerPage,
			topicId
		);
		if (!discussTopicDetails || !discussionTopicComments) {
			return res.status(404).json({ error: "Discussion Topic not found" });
		}
		res.json({ discussTopicDetails, discussionTopicComments });
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ error: "Failed to fetch LeetCode user details" });
	}
});

app.get("/discusstopic/reply/:commentId", async (req, res) => {
	const { commentId } = req.params;
	try {
		const topicCommentReply = await getDiscussionTopicCommentReply(commentId);
		if (!topicCommentReply) {
			return res.status(404).json({ error: "topicCommentReply not found" });
		}
		res.json({ topicCommentReply });
	} catch (error) {
		console.error(error.message);
		res
			.status(500)
			.json({ error: "Failed to fetch topicCommentReply details" });
	}
});

//TO-DO: App router to differentiate between routes
// app.get("/discuss/:category/:subcategory",async (req,res)=>{
//   //topicTags,topicLists
//   const { category,subcategory } = req.params;
//   //this query parameter is the searched topic query paramter text
//   const {currentPage, orderBy,query,tag} = req.query;
//   const selectedTags = Array.isArray(tag) ? tag : tag ? [tag] : [];
//   try {
//     const topicTags = await getCategoryTopicTags([category,subcategory],selectedTags)
//     const first = 15;
//     const skip = (currentPage - 1) * first;
//     const topicList = await getCategoryTopicList([category,subcategory],skip,orderBy,query,selectedTags,first)
//     if (!topicTags || !topicList) {
//       return res.status(404).json({ error: "Discussion not found" });
//     }
//     res.json({topicTags,topicList} );
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ error: "Failed to fetch LeetCode user details" });
//   }
// })

// TO-DO: Show POTD as story and image of that will be (that leetcode random color weird design user_logo_dp)
app.get("/potd", async (req, res) => {
	try {
		const problem = await getPOTD();
		if (!problem) {
			return res.status(404).json({ error: "POTD not found" });
		}
		res.json(problem);
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ error: "Failed to fetch LeetCode potd" });
	}
});

app.get("/gfgpotd", async (req, res) => {
	try {
		const problem = await getGFGPOTD();
		if (!problem) {
			return res.status(404).json({ error: "POTD not found" });
		}
		res.json(problem);
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ error: "Failed to fetch GFG potd" });
	}
});

//this is public favorite list of a user
app.get("/favoritelist/:category", async (req, res) => {
	const { category } = req.params;
	try {
		const userDetails = await getFavoriteListProblems(category);
		if (!userDetails) {
			return res.status(404).json({ error: "List not found" });
		}
		res.json(userDetails);
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ error: "Failed to fetch LeetCode user details" });
	}
});

app.get("/problems/:title", async (req, res) => {
	const { title } = req.params;
	try {
		const userDetails = await getProblemDetails(title);
		if (!userDetails) {
			return res.status(404).json({ error: "Study Plan not found" });
		}
		res.json(userDetails);
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ error: "Failed to fetch LeetCode user details" });
	}
});

//if signed in get detials with streak

// here i have all activeYears so i can make a dropdown
app.get("/:username", async (req, res) => {
	const { username } = req.params;
	try {
		const userDetails = await getLeetCodeUserDetails(username);
		if (!userDetails) {
			return res.status(404).json({ error: "User not found" });
		}
		res.json(userDetails);
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ error: "Failed to fetch LeetCode user details" });
	}
});

app.get("/:username/year/:year", async (req, res) => {
	const { username, year } = req.params;
	try {
		const userDetails = await getLeetCodeUserYearlyDetails(username, year);
		if (!userDetails) {
			return res.status(404).json({ error: "Yearly Details not found" });
		}
		res.json(userDetails);
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ error: "Failed to fetch LeetCode user details" });
	}
});

//limit (help to check the last visited time)
app.get("/:username/recent/:limit", async (req, res) => {
	const { username, limit } = req.params;
	try {
		const userDetails = await getRecentSubmission(username, limit);
		if (!userDetails) {
			return res.status(404).json({ error: "Recent Submission not found" });
		}
		res.json(userDetails);
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ error: "Failed to fetch LeetCode user details" });
	}
});

app.listen(PORT, () => {
	console.log(`App is running on PORT ${PORT}`);
});

// TO-DO - this is a confusion i am not able to get tags associate to discussion topic
async function getDiscussionTopicDetails(topicId) {
	try {
		const response = await axios.post("https://leetcode.com/graphql", {
			query: discussion_topic_query,
			variables: { topicId },
		});

		return response.data.data;
	} catch (error) {
		throw new Error(
			"Error fetching discussion topic details: " + error.message
		);
	}
}

async function getDiscussionTopicComments(
	orderBy = "best",
	pageNo = 1,
	numPerPage = 10,
	topicId
) {
	try {
		const response = await axios.post("https://leetcode.com/graphql", {
			query: discussion_topic_comments_query,
			variables: { orderBy, pageNo, numPerPage, topicId },
		});

		return response.data.data;
	} catch (error) {
		throw new Error(
			"Error fetching discussion topic comments: " + error.message
		);
	}
}

async function getDiscussionTopicCommentReply(commentId) {
	try {
		const response = await axios.post("https://leetcode.com/graphql", {
			query: discussion_topic_comment_reply_query,
			variables: { commentId },
		});

		return response.data.data;
	} catch (error) {
		throw new Error(
			"Error fetching getDiscussionTopicCommentReply: " + error.message
		);
	}
}

async function getFavoriteListProblems(favoriteSlug) {
	try {
		const FavoriteQuestionFilterInputObj = {
			positionRoleTagSlug: "",
			skip: 0,
			limit: 100,
		};
		const response = await axios.post("https://leetcode.com/graphql", {
			query: favorite_problems_list_query,
			variables: { favoriteSlug, FavoriteQuestionFilterInputObj },
		});

		return response.data.data;
	} catch (error) {
		throw new Error(
			"Error fetching favorite list problems details: " + error.message
		);
	}
}

async function getPOTD() {
	try {
		const response = await axios.post("https://leetcode.com/graphql", {
			query: potd_query,
		});

		return response.data.data;
	} catch (error) {
		throw new Error("Error fetching potd details: " + error.message);
	}
}

async function getGFGPOTD() {
	try {
		const response = await axios.get(gfg_potd_query);

		return response.data;
	} catch (error) {
		throw new Error("Error fetching gfg potd details: " + error.message);
	}
}

async function getProblemDetails(titleSlug) {
	try {
		const response = await axios.post("https://leetcode.com/graphql", {
			query: question_query,
			variables: { titleSlug },
		});

		return response.data.data;
	} catch (error) {
		throw new Error(
			"Error fetching problems details details: " + error.message
		);
	}
}

async function getStudyPlanQuestions(slug) {
	try {
		const response = await axios.post("https://leetcode.com/graphql", {
			query: study_plan_questions_query,
			variables: { slug },
		});

		return response.data.data;
	} catch (error) {
		throw new Error(
			"Error fetching study plan questions details: " + error.message
		);
	}
}

async function getStudyPlan() {
	try {
		const response = await axios.post("https://leetcode.com/graphql", {
			query: study_plan_query,
		});

		return response.data.data;
	} catch (error) {
		throw new Error("Error fetching study plan details: " + error.message);
	}
}

async function getMoreStudyPlan(catalogSlug) {
	try {
		const offset = 0,
			limit = 12;
		const response = await axios.post("https://leetcode.com/graphql", {
			query: more_study_plan_query,
			variables: { catalogSlug, offset, limit },
		});

		return response.data.data;
	} catch (error) {
		throw new Error("Error fetching more study plan details: " + error.message);
	}
}

async function getDiscussionDetails() {
	try {
		const response = await axios.post("https://leetcode.com/graphql", {
			query: discussion_query,
		});

		return response.data.data;
	} catch (error) {
		throw new Error(
			"Error fetching discussion details details: " + error.message
		);
	}
}

async function getSubCategoryDetails(slugs) {
	//instead of array i need to send root_slug, sub-category slug
	try {
		const response = await axios.post("https://leetcode.com/graphql", {
			query: sub_category_query,
			variables: { slugs },
		});

		return response.data.data;
	} catch (error) {
		throw new Error("Error fetching sub category details: " + error.message);
	}
}

//TO-DO - this query is useful when we type something in the tags section this query will get that searched text and call respective query
async function getCategoryTopicTags(
	categorySlugs,
	selectedTags,
	query = "",
	tagType = "",
	numTags = 10
) {
	try {
		const response = await axios.post("https://leetcode.com/graphql", {
			query: category_topic_tags_query,
			variables: { tagType, categorySlugs, selectedTags, numTags, query },
		});
		return response.data.data;
	} catch (error) {
		throw new Error("Error fetching category topic tags: " + error.message);
	}
}

async function getCategoryTopicList(
	categories,
	skip = 0,
	orderBy = "hot",
	query = "",
	tags = [],
	first = 15
) {
	try {
		const response = await axios.post("https://leetcode.com/graphql", {
			query: discussion_topic_list_query,
			variables: { categories, first, orderBy, skip, query, tags },
		});
		return response.data.data;
	} catch (error) {
		throw new Error("Error fetching discussion topic list: " + error.message);
	}
}

async function getLeetCodeUserDetails(username) {
	try {
		const response = await axios.post("https://leetcode.com/graphql", {
			query: details_query,
			variables: { username },
		});

		return response.data.data;
	} catch (error) {
		throw new Error(
			"Error fetching leetcode user details details: " + error.message
		);
	}
}

async function getRecentSubmission(username, limit) {
	try {
		const response = await axios.post("https://leetcode.com/graphql", {
			query: recent_submission_query,
			variables: { username, limit },
		});

		return response.data.data;
	} catch (error) {
		throw new Error(
			"Error fetching recent submissions details: " + error.message
		);
	}
}

async function getLeetCodeUserYearlyDetails(username, year) {
	try {
		const response = await axios.post("https://leetcode.com/graphql", {
			query: yearly_query,
			variables: { username, year },
		});

		return response.data.data;
	} catch (error) {
		throw new Error("Error fetching user details: " + error.message);
	}
}
