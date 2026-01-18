import { Outlet } from "react-router-dom";
import PostsContainer from "../components/PostsContainer";
import MetaData from "../layouts/MetaData";

const HomePage = () => {
	return (
		<>
			{/* Centered Home Page Content 
      TO-DO also there are lot of card in explore tab so build end-point for that and show in the HOME-PAGE
      studyplan's + exploreTab cards
      */}
			<MetaData title="InstaCode" />
			<div className="flex h-full md:w-4/5 lg:w-4/6 mx-auto">
				<PostsContainer />
				<Outlet />
			</div>
			{/* <RightSidebar/> */}
			{/* TO-DO - continbutions on the right side of posts like suggested peoples */}
			{/* TO-DO - all problems with search filer sort icon like we have buttons here https://leetcode.com/problem-list/5mlhopqr/ */}
		</>
	);
};

export default HomePage;
