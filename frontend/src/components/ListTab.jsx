import { Dialog } from "@mui/material";

import { axiosInstance } from "../lib/axios";
import React, { useState } from "react";
import { eyeIcon, problemCountIcon } from "../utils/SvgIcons";

const ListTab = React.memo(({ userData }) => {
	return (
		<div className="grid grid-cols-2 gap-4 p-4">
			{userData.createdPublicFavoriteList.favorites.map((item, index) => (
				<ListItem key={index} item={item} />
			))}
		</div>
	);
});

function ListItem({ item }) {
	const [openList, setOpenList] = useState(false);
	const [problemlist, setProblemList] = useState([]);
	const [loading, setLoading] = useState(false);

	const handleOpenDialog = async () => {
		setOpenList(true);

		if (problemlist.length === 0) {
			// Fetch only if data hasn't been loaded yet
			setLoading(true);
			try {
				const res = await axiosInstance.get(`/favoritelist/${item.slug}`);
				setProblemList(res.data.favoriteQuestionList.questions || []);
			} catch (error) {
				console.error("Error fetching user data:", error);
				setProblemList([]);
			} finally {
				setLoading(false);
			}
		}
	};

	return (
		<>
			<div
				className="flex flex-col justify-between border rounded-lg p-4 shadow-sm bg-gray-100 cursor-pointer"
				style={{ minHeight: "120px" }}
				title={item.description}
				onClick={handleOpenDialog} // Fetch data on dialog open
			>
				{/* Top Section */}
				<div className="flex justify-between items-center mb-2">
					<div className="flex items-center">
						{problemCountIcon}
						<span className="font-semibold text-lg ml-2">
							{item.questionNumber}
						</span>
					</div>
					<div className="flex items-center space-x-1">
						{eyeIcon}
						<span className="text-sm text-gray-600">{item.viewCount}</span>
					</div>
				</div>

				{/* Bottom Section */}
				<div className="mt-auto mb-2">
					<p className="text-gray-700">{item.name}</p>
				</div>
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
										className={`text-sm font-semibold rounded-full px-2 py-0.5 ${
											problem.difficulty === "HARD"
												? "bg-red-500 text-white"
												: problem.difficulty === "MEDIUM"
												? "bg-yellow-500 text-white"
												: "bg-sky-400 text-white"
										}`}
									>
										{problem.difficulty}
									</span>
								</div>
							</a>
						))
					) : (
						<p>No problems found.</p>
					)}
				</div>
			</Dialog>
		</>
	);
}

export default ListTab;
