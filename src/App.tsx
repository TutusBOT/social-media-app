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
import {
	createUserWithEmailAndPassword,
	getAuth,
	onAuthStateChanged,
	User,
	signOut,
	signInWithEmailAndPassword,
	updateProfile,
} from "firebase/auth";
import { getStorage } from "firebase/storage";
import firebaseConfig from "./components/firebaseConfig";
import SignUp from "./components/SignUp";
import CreatePost from "./components/CreatePost";

const firebaseApp = initializeApp(firebaseConfig);
let auth = getAuth(firebaseApp);

console.log("test", auth);

function App() {
	const [searchInput, setSearchInput] = useState("");
	const [posts, setPosts] = useState<DocumentData>();
	const [logged, setLogged] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const [openCreatePost, setOpenCreatePost] = useState(false);
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

		// const checkauth = getAuth(firebaseApp);
		// const a = checkauth;
		// console.log("start", a.currentUser);
	}, []);
	// useEffect(() => {
	// 	console.log("jd");
	// }, [auth.currentUser]);
	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setLogged(true);
			} else {
				setLogged(false);
			}

			console.log("user", user);
		});
	}, []);
	return (
		<div className="App">
			<Header
				searchInput={searchInput}
				setSearchInput={setSearchInput}
				open={openCreatePost}
				setOpen={setOpenCreatePost}
			/>
			{openCreatePost ? <CreatePost /> : null}
			{auth.currentUser ? (
				<>
					<button
						onClick={() => {
							signOut(auth);
							auth = getAuth(firebaseApp);
						}}
					>
						Sign out
					</button>
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
				</>
			) : (
				<form
					className="authentication"
					onSubmit={(e) => {
						e.preventDefault();
					}}
				>
					username:{" "}
					<input
						type="text"
						value={username}
						onChange={(e) => {
							setUsername(e.target.value);
						}}
					/>
					email:{" "}
					<input
						type="email"
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
						}}
					/>{" "}
					password:{" "}
					<input
						type="password"
						value={password}
						onChange={(e) => {
							setPassword(e.target.value);
						}}
					/>
					<button
						onClick={() => {
							signUp(email, password, username);
						}}
					>
						Sign Up
					</button>{" "}
					<button
						onClick={() => {
							signIn(email, password);
						}}
					>
						Sign in
					</button>
				</form>
			)}
		</div>
	);
}
interface IPosts {
	id: string;
	username: string;
	caption: string;
	imageUrl: string;
}

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
function signUp(email: string, password: string, username: string) {
	if (!email || !password) return;
	console.log(auth);

	createUserWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			const user = userCredential.user;
			updateProfile(userCredential.user, {
				displayName: username,
			});
			console.log("usercredential", user);
			return user;
		})
		.catch((e) => {
			console.log(e);
		});
}
function signIn(email: string, password: string) {
	if (!email || !password) return;
	signInWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			const user = userCredential.user;
			auth = getAuth(firebaseApp);
			return user;
		})
		.catch((e) => {
			console.log(e);
		});
}
export default App;
