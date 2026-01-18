export const PORT = 5555;

export const yearly_query = `
query userProfileCalendar($username: String!, $year : Int!) {
    matchedUser(username: $username) {
      userCalendar(year: $year) {
          activeYears
          streak
          totalActiveDays
          submissionCalendar
        }
    }
}
`;

export const discussion_query = `
query discussRootCategories {
    rootCategory {
      ...DiscussCategorySummary
    }
}
fragment DiscussCategorySummary on DiscussCategoryNode {
    title
    description
    slug
}`;

export const sub_category_query = `
query categoryInfo($slugs: [String!]!) {
    discussCategory(slugs: $slugs) {
        subcategories {
            ...DiscussCategorySummary
        }
    }
}
fragment DiscussCategorySummary on DiscussCategoryNode {
  title
  description
  slug
}`;

export const category_topic_tags_query = `
query categoryTopicTags($tagType: String, $categorySlugs: [String!]!, $selectedTags: [String!], $numTags: Int, $query: String) {
    topicTags(tagType: $tagType, categorySlugs: $categorySlugs, selectedTags: $selectedTags, numTags: $numTags, query: $query) {
        ...TopicTag
      }
}
fragment TopicTag on DiscussTopicTagNode {
    name
    slug
    numTopics
}`;

//isHidden,status, post.author.isActive
export const discussion_topic_list_query = `
query categoryTopicList($categories: [String!]!, $first: Int!, $orderBy: TopicSortingOption, $skip: Int, $query: String, $tags: [String!]) {
    categoryTopicList(categories: $categories, orderBy: $orderBy, skip: $skip, query: $query, first: $first, tags: $tags) {
        ...TopicsList
    }
}
fragment TopicsList on TopicConnection {
    totalNum
    edges {
        node {
            id
            title
            commentCount
            viewCount
            pinned
            tags {
                name
                slug
            }
            post {
                voteCount
                creationDate
                isHidden
                author {
                    username
                    profile {
                        userAvatar
                        realName
                        reputation
                    }
                }
            }
        }
    }
}`;

export const discussion_topic_query = `
query DiscussTopic($topicId: Int!) {
    topic(id: $topicId) {
        viewCount
        topLevelCommentCount
        title
        tags
        post {
            ...DiscussPost
        }
    }
}
fragment DiscussPost on PostNode {
    voteCount
    content
    updationDate
    creationDate
    author {
        username
        profile {
            userAvatar
            reputation
            realName
        }
    }
}`

export const discussion_topic_comments_query = `
query discussComments($topicId: Int!, $orderBy: String = \"newest_to_oldest\", $pageNo: Int = 1, $numPerPage: Int = 10) {
    topicComments(topicId: $topicId, orderBy: $orderBy, pageNo: $pageNo, numPerPage: $numPerPage) {
        data {
            id
            post {
                ...DiscussPost
            }
            numChildren
        }
    }
}
fragment DiscussPost on PostNode {
    voteCount
    content
    updationDate
    creationDate
    author {
        username
        profile {
            userAvatar
            reputation
            realName
        }
    }
}`

export const discussion_topic_comment_reply_query = `
query fetchCommentReplies($commentId: Int!) {
    commentReplies(commentId: $commentId) {
        id
        post {
            ...DiscussPost
        }
    }
}
fragment DiscussPost on PostNode {
    id
    voteCount
    content
    updationDate
    creationDate
    author {
        username
        profile {
            userAvatar
            reputation
            realName
        }
    }
}
`

export const study_plan_query = `
query GetStudyPlanListAds {
    studyPlansV2AdFeature {
        cover
        name
        highlight
        questionNum
        premiumOnly
        slug
    }
    studyPlanV2Catalogs {
        name
        slug
    }
}    
`;

export const question_query = `query questionTitle($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
        questionFrontendId
        title
        titleSlug
        isPaidOnly
        difficulty
        likes
        dislikes
        categoryTitle
        topicTags{
          name
          slug
        }
        stats
    }
}`;
export const favorite_problems_list_query = `
query favoriteQuestionList($favoriteSlug: String!, $filter: FavoriteQuestionFilterInput) {
    favoriteQuestionList(favoriteSlug: $favoriteSlug, filter: $filter) {
        questions {
            difficulty
            paidOnly
            questionFrontendId
            title
            titleSlug
            translatedTitle
            topicTags {
                name
                nameTranslated
                slug
            }
        }
    totalLength
    hasMore
  }
}
`;

export const more_study_plan_query = `
query GetStudyPlanByCatalog($catalogSlug: String!, $offset: Int!, $limit: Int!) {
    studyPlansV2ByCatalog(catalogSlug: $catalogSlug, offset: $offset, limit: $limit) {
        hasMore
        total
        studyPlans {
            slug
            questionNum
            premiumOnly
            name
            highlight
            cover
        }
    }
}`;

export const potd_query = `
query questionOfToday {
    activeDailyCodingChallengeQuestion {
        date
        link
        question {
            acRate
            difficulty
            frontendQuestionId: questionFrontendId
            title
            hasVideoSolution
            hasSolution
            topicTags {
                name
                id
                slug
            }
        }
    }
}`;

export const gfg_potd_query = `https://practiceapi.geeksforgeeks.org/api/vr/problems-of-day/problem/today/`;

export const study_plan_questions_query = `
query studyPlanPastSolved($slug: String!) {
    studyPlanV2Detail(planSlug: $slug) {
        planSubGroups {
            questions {
                titleSlug
            }
        }
    }
}
`;

export const recent_submission_query = `
query recentAcSubmissions($username: String!, $limit: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit) {
        id
        title
        titleSlug
        timestamp
    }
}`;

// query languageStats($username: String!) {
//   matchedUser(username: $username) {
//     languageProblemCount {
//       languageName
//       problemsSolved
//     }
//   }
// }

export const details_query = `
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      username
      githubUrl
      twitterUrl
      linkedinUrl
      languageProblemCount {
        languageName
        problemsSolved
      }
      profile {
        ranking
        userAvatar
        realName
        aboutMe
        school
        websites
        countryName
        company
        jobTitle
        skillTags
        postViewCount
        reputation
        solutionCount
        categoryDiscussCount
      }
      tagProblemCounts {
        advanced {
            tagName
            tagSlug
            problemsSolved
        }
        intermediate {
            tagName
            tagSlug
            problemsSolved
        }
        fundamental {
            tagName
            tagSlug
            problemsSolved
        }
      }
      submitStats {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
        totalSubmissionNum{
            difficulty
            count
            submissions
        }
      }
      badges {
        id
        name
        displayName
        icon
        hoverText
        creationDate
        medal {
          slug
          config {
            iconGif
            iconGifBackground
          }
        }
      }
      userCalendar(year: 2024) {
        activeYears
      }
    }
    userContestRanking(username: $username) {
      attendedContestsCount
      rating
      globalRanking
      totalParticipants
      topPercentage
      badge {
        name
      }
    }
    userContestRankingHistory(username: $username) {
      attended
      trendDirection
      problemsSolved
      totalProblems
      rating
      ranking
      contest {
        title
        startTime
      }
    }
    createdPublicFavoriteList(userSlug: $username) {
      hasMore
      totalLength
      favorites {
        slug
        name
        isPublicFavorite
        viewCount
        description
        questionNumber
      }
    }
  }
`;
