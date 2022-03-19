import { useState, useEffect } from "react";
import "./Main.css";
import Header from "./components/Header";
import Post from "./components/Post";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import firebaseConfig from "./components/firebaseConfig";

function App() {
	const [searchInput, setSearchInput] = useState("");
	const [posts, setPosts] = useState([
		{
			username: "TutusBOT",
			caption: "dasda",
			imageUrl:
				"https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg",
		},
		{
			username: "ziom",
			caption: "jd",
			imageUrl:
				"https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg",
		},
	]);
	useEffect(() => {}, [posts]);
	return (
		<div className="App">
			<Header searchInput={searchInput} setSearchInput={setSearchInput} />
			<div className="posts">
				{posts.map((post) => {
					return (
						<Post
							key={post.caption}
							username={post.username}
							caption={post.caption}
							imageUrl={post.imageUrl}
						/>
					);
				})}
			</div>
		</div>
	);
}

function FB() {
	const firebaseApp = initializeApp(firebaseConfig);
	const db = getFirestore();
	const colRef = collection(db, "posts");
	getDocs(colRef)
		.then((snapshot) => {
			const postsData = snapshot.docs.map((doc) => {
				let data = doc.data();
				return { data };
			});
			console.log(postsData);
		})
		.catch((err) => {
			console.log(err.message);
		});
	const auth = getAuth(firebaseApp);
	const storage = getStorage(firebaseApp);
}
FB();

export default App;
