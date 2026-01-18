import { darkModeIcon, lightModeIcon } from "../utils/SvgIcons";
import SearchBox from "./SearchBox";

const Header = () => {
	return (
		<nav className="fixed top-0 w-full border-b bg-white z-10">
			{/* <!-- navbar container --> */}
			<div className="flex flex-row justify-between items-center py-1 px-3 sm:px-4 md:px-6 xl:w-4/6 xl:py-2 xl:px-8 mx-auto">
				{/* <!-- logo --> */}
				<img
					draggable="false"
					className="h-8 sm:h-10 object-contain cursor-pointer"
					src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
					alt=""
				/>

				<SearchBox />

				{/* <!-- icons container  --> */}
				<div className="flex items-center space-x-6 sm:mr-5">
					<p className="cursor-pointer">{lightModeIcon}</p>
					<p className="cursor-pointer">{darkModeIcon}</p>
				</div>

				{/* {profileToggle &&
                    <ProfileDetails setProfileToggle={setProfileToggle} />
                }

                <NewPost newPost={newPost} setNewPost={setNewPost} /> */}
			</div>
		</nav>
	);
};

export default Header;
