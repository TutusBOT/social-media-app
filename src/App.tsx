import { useState, useEffect } from "react";
import "./Main.css";
import Header from "./components/Header";
import Post from "./components/Post";
import { initializeApp } from "firebase/app";
import {
	getFirestore,
	collection,
	getDocs,
	DocumentData,
} from "firebase/firestore";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import firebaseConfig from "./components/firebaseConfig";

function App() {
	const [searchInput, setSearchInput] = useState("");
	const [posts, setPosts] = useState<DocumentData>();
	// 	[
	// 	{
	// 		username: "TutusBOT",
	// 		caption: "dasda",
	// 		imageUrl:
	// 			"https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg",
	// 	},
	// 	{
	// 		username: "ziom",
	// 		caption: "jd",
	// 		imageUrl:
	// 			"https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg",
	// 	},
	// ]
	useEffect(() => {
		const test = async () => {
			const reqPostsData = await FB();
			console.log("elo", reqPostsData);
			setPosts(reqPostsData);
			return reqPostsData;
		};
		test();
	}, []);
	const user = authentication("", "");
	return (
		<div className="App">
			<Header searchInput={searchInput} setSearchInput={setSearchInput} />
			<div className="posts">
				{posts
					? posts.map((post: IPosts) => {
							return (
								<Post
									key={post.id}
									username={post.username}
									caption={post.caption}
									imageUrl={post.imageUrl}
								/>
							);
					  })
					: ""}
			</div>
		</div>
	);
}
interface IPosts {
	id: string;
	username: string;
	caption: string;
	imageUrl: string;
}
const firebaseApp = initializeApp(firebaseConfig);
async function FB() {
	const db = getFirestore();
	const colRef = collection(db, "posts");
	const querySnapshot = await getDocs(colRef);
	const data: DocumentData[] = [];
	querySnapshot.forEach((doc) => {
		const post = doc.data();
		const id = doc.id;
		data.push({ id, ...post });
	});

	// docSnap.data()
	// console.log(data);

	// const sth = await (snapshot)  =>{
	// 	const postsData = snapshot.docs.map((doc) => {
	// 		let data = doc.data();
	// 		return { data };
	// 	});
	// }
	// 	// .then((snapshot) => {
	// 	const postsData = snapshot.docs.map((doc) => {
	// 		let data = doc.data();
	// 		return { data };
	// 	});
	// })
	// .catch((err) => {
	// 	console.log(err.message);
	// });
	const storage = getStorage(firebaseApp);
	return data;
}
function authentication(email: string, password: string) {
	const auth = getAuth(firebaseApp);
	createUserWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			const user = userCredential.user;
			return user;
		})
		.catch((e) => {
			console.log(e);
		});
}
export default App;
