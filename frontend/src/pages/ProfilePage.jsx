import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import BackdropLoader from "../layouts/BackdropLoader";
import {
	moreIcon,
	streakIcon,
	problemListIcon,
	badgeIcon,
	linkIcon,
	tickIcon,
	pinIcon,
	redirectIcon,
	postsIconFill,
	reputation_icon_1,
	reputation_icon_2,
	reputation_icon_3,
	reputation_icon_4,
	reputation_icon_5,
} from "../utils/SvgIcons";
import { UserPlus } from "lucide-react";
import linkedin from "../assets/linkedin.png";
import twitter from "../assets/twitter.png";
import github from "../assets/github.png";
import NotFound from "./NotFound";
import ListTab from "../components/ListTab";
import BadgesTab from "../components/BadgesTab";
import StreakTab from "../components/StreakTab";
import EmptyTab from "../components/EmptyTab";
import MetaData from "../layouts/MetaData";
import PrivateAccount from "../components/PrivateAccount";
import AboutThisAccount from "../layouts/AboutThisAccount";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dialog } from "@mui/material";
import ContestGraphDialog from "../layouts/ContestGraphDialog";
import { AnimatedNumber } from "../animation/increasingCounter";

const ProfilePage = () => {
	const [userData, setUserData] = useState(null);
	const { username } = useParams();
	const [moreSection, setMoreSection] = useState(false);
	const [moreUser, setMoreUser] = useState(false);
	const [showAboutProfile, setShowAboutProfile] = useState(false);
	const [section, setSection] = useState("badges");
	const [loading, setLoading] = useState(true);
	const [contestDialog, setContestDialog] = useState(false);
	const navigate = useNavigate();

	const [streakData, setStreakData] = useState({
		activeDays: 0,
		submissionDates: new Map(),
	});
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

	const handleAboutProfileClick = () => {
		setMoreSection(false); // Close the initial dialog
		setShowAboutProfile(true); // Open the AboutThisAccount dialog
	};

	const renderActiveTabContent = useMemo(() => {
		if (!userData?.matchedUser) return null;
		switch (section) {
			case "badges":
				return userData.matchedUser.badges.length > 0 ? (
					<BadgesTab userData={userData} />
				) : (
					<EmptyTab text="badges" />
				);
			case "streak":
				return (
					<StreakTab
						userData={userData}
						selectedYear={selectedYear}
						setSelectedYear={setSelectedYear}
						streakData={streakData}
						setStreakData={setStreakData}
					/>
				);
			case "list":
				return userData.createdPublicFavoriteList.totalLength > 0 ? (
					<ListTab userData={userData} />
				) : (
					<EmptyTab text="Public List" />
				);
			default:
				return null;
		}
	}, [section, userData, streakData, selectedYear]);

	useEffect(() => {
		setLoading(true);
		const handleSearchButton = async () => {
			try {
				const res = await axiosInstance.get(`/${username}`);
				//valid user
				if (res.data.matchedUser != null) {
					// Create a new search object
					const newSearch = {
						username,
						realName: res.data.matchedUser.profile.realName,
						reputation: res.data.matchedUser.profile.reputation,
						userAvatar: res.data.matchedUser.profile.userAvatar,
					};

					//store if not exist
					const storedSearches =
						JSON.parse(localStorage.getItem("recentSearches")) || [];
					const updatedSearches = [
						newSearch,
						...storedSearches.filter((item) => item.username !== username),
					];
					localStorage.setItem(
						"recentSearches",
						JSON.stringify(updatedSearches)
					);
				}
				setUserData(res.data);
			} catch (error) {
				console.error("Error fetching user data:", error);
				setUserData(null);
			} finally {
				setLoading(false);
			}
		};
		handleSearchButton();
	}, [username]);

	return (
		<>
			{loading ? (
				<BackdropLoader />
			) : userData && userData.matchedUser ? (
				<div className="mt-8 xl:w-2/3 mx-auto">
					<MetaData
						title={`${userData.matchedUser.profile.realName} (@${userData.matchedUser.username}) • Badges, Streak and list`}
					/>
					<div className="sm:flex w-full sm:pt-8 pb-4">
						<ProfilePicture userData={userData} />
						<ProfileDetails
							changeMoreSection={() => setMoreSection(true)}
							changeMoreUser={() => setMoreUser(!moreUser)}
							userData={userData}
							contestDialog={contestDialog}
							setContestDialog={setContestDialog}
						/>
					</div>

					{moreUser && (
						<SuggestedUsers
							navigate={navigate}
							username={username}
							changeMoreUser={() => setMoreUser(!moreUser)}
						/>
					)}

					{moreSection && (
						<Dialog
							open={moreSection}
							onClose={() => setMoreSection(false)}
							PaperProps={{
								style: {
									borderRadius: "12px",
									width: "400px",
									maxWidth: "90%",
								},
							}}
						>
							<a
								href={`https://leetcode.com/${userData.matchedUser.username}`}
								target="_blank"
								rel="noopener noreferrer" // Adds security protection for new tab links
								className="border-t py-2.5 w-full bg-gray-50 cursor-pointer text-center block"
							>
								Visit Profile
							</a>
							<button
								onClick={handleAboutProfileClick}
								className="border-t py-2.5 w-full bg-gray-50 cursor-pointer text-center"
							>
								About this account
							</button>
							<button
								onClick={() => setMoreSection(false)}
								className="border-t py-2.5 w-full bg-gray-50 cursor-pointer text-center"
							>
								Cancel
							</button>
						</Dialog>
					)}

					<AboutThisAccount
						open={showAboutProfile}
						onClose={() => setShowAboutProfile(false)}
						userData={userData}
					/>

					{/* no_social_media_profiles && no_badges && problems_solved<10 */}
					{!userData.matchedUser.githubUrl &&
					!userData.matchedUser.twitterUrl &&
					!userData.matchedUser.linkedinUrl &&
					userData.matchedUser.badges.length == 0 &&
					userData.matchedUser.submitStats.acSubmissionNum[0].count < 10 ? (
						<PrivateAccount />
					) : (
						<div className="sm:ml-8 sm:mr-14">
							<div className="flex overflow-x-auto space-x-4 p-4">
								<SocialMediaStory userData={userData} />
							</div>
							<div className="border-t">
								<Tabs setSection={setSection} section={section} />
							</div>

							<div className="mt-4 w-full">{renderActiveTabContent}</div>
						</div>
					)}
					<ToastContainer
						position="bottom-left"
						autoClose={3000}
						hideProgressBar
					/>
				</div>
			) : (
				<NotFound />
			)}
		</>
	);
};

function SuggestedUsers({ navigate, username, changeMoreUser }) {
	const [users, setUsers] = useState([]);

	const handleDelete = (term) => {
		const updatedUsers = users.filter(
			(search) => search.username !== term.username
		);
		setUsers(updatedUsers);
		localStorage.setItem("recentSearches", JSON.stringify(updatedUsers));
	};

	useEffect(() => {
		const storedUsers = JSON.parse(localStorage.getItem("recentSearches"));
		if (storedUsers) setUsers(storedUsers);
	}, []);

	return (
		<div className="p-6 text-white">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-lg font-semibold">Suggested for you</h2>
				<a onClick={changeMoreUser} className="text-blue-500 text-sm">
					Close
				</a>
			</div>

			<div className="flex space-x-4 overflow-x-auto scrollbar-hide">
				{users.map((user, index) => {
					if (user.username === username) return;
					return (
						<div
							key={index}
							className="relative rounded-sm pt-4 w-40 text-center border-2 flex-shrink-0 cursor-pointer"
							style={{ minWidth: "140px", minHeight: "180px" }}
							onClick={() => navigate(`/${user.username}`)}
						>
							{/* Close Icon */}
							<button
								className="absolute top-2 right-2 text-gray-400 hover:text-gray-300 text-xl"
								onClick={(e) => {
									e.stopPropagation(); // Prevents navigate on delete
									handleDelete(user);
								}}
							>
								&times;
							</button>

							{/* User Avatar */}
							<img
								src={user.userAvatar}
								alt={`${user.username}'s avatar`}
								className="rounded-full w-16 h-16 mx-auto mb-2 object-cover border border-gray-600"
							/>

							{/* User Info */}
							<h3 className="text-sm font-semibold mt-2">{user.username}</h3>
							<p className="text-xs text-gray-400 mb-4">{user.realName}</p>

							{/* Follow Button */}
							<button className="text-blue-500 font-medium border-t pt-2 w-full">
								Follow
							</button>
						</div>
					);
				})}
			</div>
		</div>
	);
}

const ProfilePicture = React.memo(({ userData }) => {
	const { reputation } = userData.matchedUser.profile;

	const latestBadge = userData.matchedUser.badges?.reduce((latest, badge) => {
		const badgeDate = new Date(badge.creationDate);
		return badgeDate > new Date(latest.creationDate) ? badge : latest;
	}, userData.matchedUser.badges?.[0]);

	const creationDate = new Date(latestBadge?.creationDate);
	const today = new Date();
	const isNewBadge = (today - creationDate) / (1000 * 60 * 60 * 24) <= 7;
	const [openImage, setOpenImage] = useState(false);
	const gifBackground = latestBadge?.medal?.config.iconGifBackground;
	const gifUrl = latestBadge?.medal?.config.iconGif;
	const badgeDisplayName = latestBadge?.displayName;
	const fullDateFormat = creationDate.toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});

	// Determine the appropriate icon based on reputation
	let reputationIcon = null;
	if (reputation >= 500) {
		reputationIcon = reputation_icon_5;
	} else if (reputation >= 400) {
		reputationIcon = reputation_icon_4;
	} else if (reputation >= 300) {
		reputationIcon = reputation_icon_3;
	} else if (reputation >= 200) {
		reputationIcon = reputation_icon_2;
	} else if (reputation >= 100) {
		reputationIcon = reputation_icon_1;
	}

	return (
		<>
			{" "}
			<div className="sm:w-1/3 flex justify-center items-center mx-auto sm:mx-0 relative">
				<div
					className={`relative rounded-full p-1 ${
						isNewBadge ? "border-4 border-yellow-600" : ""
					}`}
					onClick={isNewBadge ? () => setOpenImage(true) : () => {}}
				>
					{/* Image */}
					<img
						draggable="false"
						className={`w-40 h-40 rounded-full ${
							isNewBadge ? "cursor-pointer" : ""
						}`}
						src={userData.matchedUser.profile.userAvatar}
						alt=""
					/>

					{/* Reputation Box */}
					{reputation >= 10 && (
						<div
							className="cursor-pointer absolute flex items-center top-2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-300 hover:bg-gray-200 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md"
							title="Reputation"
							onClick={() =>
								toast(`This account has ${reputation} reputation.`)
							}
						>
							{reputationIcon && <span className="mr-1">{reputationIcon}</span>}
							<span className="mr-1">{reputation}</span>
							<span className="text-xs">upvotes</span>
						</div>
					)}
				</div>
			</div>
			<Dialog
				open={openImage}
				onClose={() => setOpenImage(false)}
				maxWidth="xl"
			>
				<div
					className="relative sm:h-[90vh] w-full "
					style={{
						backgroundImage: `url(${gifBackground})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
						height: "90vh", // Ensure it has a height for the background to show
					}}
				>
					<img
						draggable="false"
						className="object-contain h-full w-full"
						src={gifUrl}
						title={`Earned on: ${fullDateFormat}\nStatus will disappear in 7 days`}
						alt={badgeDisplayName}
					/>
				</div>
			</Dialog>
		</>
	);
});

const ProfileDetails = React.memo(
	({
		userData,
		changeMoreSection,
		contestDialog,
		setContestDialog,
		changeMoreUser,
	}) => {
		// Helper function to format large numbers
		const formatNumber = (number) => {
			return number.toLocaleString(undefined, { maximumFractionDigits: 2 });
		};

		return (
			<div className="flex flex-col gap-6 p-4 sm:w-2/3 sm:p-1">
				{/* user_name, rank, rating */}
				<div className="flex items-center gap-4 sm:justify-start justify-between">
					<h2 className="text-xl sm:text-2xl font-thin">
						{userData.matchedUser.username}
					</h2>
					{userData.matchedUser.submitStats.acSubmissionNum[0].count >= 500 ? (
						<span title={"500+ problems solved"}>{tickIcon}</span>
					) : (
						<></>
					)}
					<div className="flex gap-3 items-center">
						{/* Display rating in short format with exact value on hover */}
						{userData.userContestRanking?.rating ? (
							<button
								className="bg-blue-500 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-blue-600"
								title={`Rating ${parseInt(userData.userContestRanking.rating)}`}
								onClick={() => {
									if (userData?.userContestRankingHistory?.length) {
										setContestDialog(true);
									}
								}}
							>
								Rating{" "}
								{/* {formatNumber(parseInt(userData.userContestRanking.rating))} */}
							</button>
						) : null}

						<ContestGraphDialog
							open={contestDialog}
							onClose={() => setContestDialog(false)}
							contestHistory={userData.userContestRankingHistory || []}
							contestRanking={userData.userContestRanking || null}
						/>

						{userData.matchedUser.profile.ranking ? (
							<button
								className="bg-gray-300 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-900"
								title={`Rank ${parseInt(userData.matchedUser.profile.ranking)}`}
								onClick={() => {
									toast(
										`Rank ${formatNumber(userData.matchedUser.profile.ranking)}`
									);
								}}
							>
								Rank
							</button>
						) : null}

						<div
							onClick={changeMoreUser}
							className="sm:block hidden cursor-pointer bg-gray-300 rounded-lg px-1.5 py-1.5"
						>
							<UserPlus className="w-6 h-6" />
						</div>

						<span
							onClick={changeMoreSection}
							className="sm:block hidden cursor-pointer"
						>
							{moreIcon}
						</span>
					</div>
				</div>

				{/* problems solved */}
				<div className="flex justify-between items-center max-w-[21.5rem]">
					<div style={{ color: "#50E5E5" }}>
						<AnimatedNumber
							target={userData.matchedUser.submitStats.acSubmissionNum[1].count}
						/>{" "}
						easy
					</div>
					<div style={{ color: "#FFBE1A" }}>
						<AnimatedNumber
							target={userData.matchedUser.submitStats.acSubmissionNum[2].count}
						/>{" "}
						medium
					</div>
					<div style={{ color: "#F74242" }}>
						<AnimatedNumber
							target={userData.matchedUser.submitStats.acSubmissionNum[3].count}
						/>{" "}
						hard
					</div>
				</div>

				{/* bio */}
				<div className="max-w-full">
					<p className="font-medium">{userData.matchedUser.profile.realName}</p>
					{userData.matchedUser.profile.company &&
					userData.matchedUser.profile.jobTitle ? (
						<div className="flex items-center space-x-2">
							<div className="bg-gray-100 text-white px-3 py-1 rounded-full text-sm">
								{userData.matchedUser.profile.company} |{" "}
								{userData.matchedUser.profile.jobTitle}
							</div>
						</div>
					) : null}

					{userData.matchedUser.profile.school ? (
						<p className="text-gray-400 whitespace-pre-line">
							{userData.matchedUser.profile.school}
						</p>
					) : null}

					{userData.matchedUser.profile.aboutMe ? (
						<p className="whitespace-pre-line">
							{userData.matchedUser.profile.aboutMe}
						</p>
					) : null}

					{userData.matchedUser.profile.websites?.length > 0 ? (
						<div className="flex items-center">
							<span className="sm:block text-blue-900 flex items-center">
								{linkIcon}
							</span>
							<a
								href={userData.matchedUser.profile.websites[0]}
								target="_blank"
								className="text-blue-900 font-medium hover:underline"
							>
								{new URL(userData.matchedUser.profile.websites[0]).hostname}
							</a>
						</div>
					) : null}
				</div>
			</div>
		);
	}
);

function Tabs({ section, setSection }) {
	// TO-DO - discussion tab
	return (
		<div className="flex gap-12 justify-center ">
			<span
				onClick={() => setSection("badges")}
				className={`${
					section === "badges" ? "border-t border-black" : "text-gray-400"
				} 
          py-3 cursor-pointer flex items-center text-[13px] uppercase gap-3 tracking-[1px] font-medium`}
			>
				{postsIconFill} Badges
			</span>
			<span
				onClick={() => setSection("streak")}
				className={`${
					section === "streak" ? "border-t border-black" : "text-gray-400"
				} py-3 cursor-pointer flex items-center text-[13px] uppercase gap-3 tracking-[1px] font-medium`}
			>
				{streakIcon} Streak
			</span>
			<span
				onClick={() => setSection("list")}
				className={`${
					section === "list" ? "border-t border-black" : "text-gray-400"
				} py-3 cursor-pointer flex items-center text-[13px] uppercase gap-3 tracking-[1px] font-medium`}
			>
				{problemListIcon} List
			</span>
		</div>
	);
}

function SocialMediaStory({ userData }) {
	return (
		<div className="w-full flex overflow-hidden rounded">
			{userData.matchedUser.linkedinUrl ? (
				<a
					href={userData.matchedUser.linkedinUrl}
					target="_blank"
					rel="noopener noreferrer"
				>
					<div className="flex flex-col text-left justify-start items-center p-2 cursor-pointer">
						<div className="w-20 h-20 rounded-full border border-gray-500 p-1">
							<img
								loading="lazy"
								className="rounded-full h-full w-full"
								src={linkedin} // Path to your icon
								draggable="false"
								alt="GitHub"
							/>
						</div>
						<span className="text-xs font-medium text-white mt-2">
							LinkedIn
						</span>
					</div>
				</a>
			) : (
				<></>
			)}

			{/* twitter */}
			{/* change bg to white */}
			{userData.matchedUser.twitterUrl ? (
				<a
					href={userData.matchedUser.twitterUrl}
					target="_blank"
					rel="noopener noreferrer"
				>
					<div className="flex flex-col text-left justify-start items-center p-2 cursor-pointer">
						<div className="w-20 h-20 rounded-full border border-gray-500 p-1">
							<img
								loading="lazy"
								className="rounded-full h-full w-full"
								src={twitter} // Path to your icon
								draggable="false"
								alt="GitHub"
							/>
						</div>
						<span className="text-xs font-medium text-white mt-2">Twitter</span>
					</div>
				</a>
			) : (
				<></>
			)}

			{/* github */}
			{userData.matchedUser.githubUrl ? (
				<a
					href={userData.matchedUser.githubUrl}
					target="_blank"
					rel="noopener noreferrer"
				>
					<div className="flex flex-col text-left justify-start items-center p-2 cursor-pointer">
						<div className="w-20 h-20 rounded-full border border-gray-500 p-1">
							<img
								loading="lazy"
								className="rounded-full h-full w-full"
								src={github} // Path to your icon
								draggable="false"
								alt="GitHub"
							/>
						</div>
						<span className="text-xs font-medium text-white mt-2">GitHub</span>
					</div>
				</a>
			) : (
				<></>
			)}
		</div>
	);
}

export default ProfilePage;
