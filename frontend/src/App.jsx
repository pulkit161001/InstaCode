// import './App.css'
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RecoilRoot, useRecoilValue } from "recoil";
import { themeAtom } from "./atoms/themeAtom";
import Sidebar, { navigationItems } from "./components/Sidebar";
import MobileNav from "./components/MobileNav";
import MobileDrawer from "./components/MobileDrawer";
import DiscussionPage from "./pages/DiscussionPage";
import DiscussionTopicPage from "./pages/DiscussionTopicPage";
import HomePage from "./pages/HomePage";
import MessagesPage from "./pages/MessagesPage";
import NotesPage from "./pages/NotesPage";
import PlaygroundPage from "./pages/PlaygroundPage";
import ProfilePage from "./pages/ProfilePage";

function AppContent() {
	const theme = useRecoilValue(themeAtom);
	const isDarkMode = theme === "dark";

	return (
		<div className={isDarkMode ? "dark" : ""}>
			{/* Mobile navigation header */}
			<div className={`md:hidden flex items-center p-4 border-b ${isDarkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"}`}>
				<MobileNav />
				<h1 className={`ml-4 text-xl font-bold ${isDarkMode ? "text-white" : ""}`}>InstaCode</h1>
			</div>

			{/* Main layout */}
			<div className={`flex ${isDarkMode ? "bg-gray-900 text-white" : "bg-white"}`}>
				{/* Desktop sidebar */}
				<div className="hidden md:block">
					<Sidebar />
				</div>

				{/* Mobile drawer */}
				<MobileDrawer navItems={navigationItems} />

				{/* Main content */}
				<div
					className={`flex-1 h-screen overflow-y-auto p-4 ${
						isDarkMode ? "bg-gray-900" : "bg-white"
					}`}
				>
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/playground" element={<PlaygroundPage />} />
						<Route path="/messages" element={<MessagesPage />} />
						<Route path="/notes" element={<NotesPage />} />
						<Route path="/discuss" element={<DiscussionPage />} />
						<Route
							path="/discuss_topic/:topicId"
							element={<DiscussionTopicPage />}
						/>
						<Route path="/:username" element={<ProfilePage />} />
					</Routes>
				</div>
			</div>
		</div>
	);
}

function App() {
	return (
		<>
			{/* HelmetProvider used to change the tab header */}
			{/* <NetworkStatusAlert /> */}
			<RecoilRoot>
				<HelmetProvider>
					<BrowserRouter>
						<AppContent />
					</BrowserRouter>
				</HelmetProvider>
			</RecoilRoot>
		</>
	);
}

export default App;
