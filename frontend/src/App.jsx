// import './App.css'
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";
import Sidebar from "./components/Sidebar";
import DiscussionPage from "./pages/DiscussionPage";
import DiscussionTopicPage from "./pages/DiscussionTopicPage";
import HomePage from "./pages/HomePage";
import MessagesPage from "./pages/MessagesPage";
import NotesPage from "./pages/NotesPage";
import PlaygroundPage from "./pages/PlaygroundPage";
import ProfilePage from "./pages/ProfilePage";
import ReelsPage from "./pages/ReelsPage";

function App() {
	return (
		<>
			{/* HelmetProvider used to change the tab header */}
			{/* <NetworkStatusAlert /> */}
			<RecoilRoot>
				<HelmetProvider>
					<BrowserRouter>
						<div className="flex">
							<Sidebar />
							<div className="flex-1 h-screen overflow-y-auto p-4">
								<Routes>
									<Route path="/" element={<HomePage />} />
									<Route path="/playground" element={<PlaygroundPage />} />
									<Route path="/messages" element={<MessagesPage />} />
									<Route path="/reels" element={<ReelsPage />} />
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
					</BrowserRouter>
				</HelmetProvider>
			</RecoilRoot>
		</>
	);
}

export default App;
