import { useState, useEffect, SetStateAction } from "react";
import "./Main.css";
import Header from "./components/Header";
import Post from "./components/Post";
import { initializeApp } from "firebase/app";
import {
	getFirestore,
	collection,
	getDocs,
	DocumentData,
	onSnapshot,
	query,
	orderBy,
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
import { getStorage, ref } from "firebase/storage";
import firebaseConfig from "./components/firebaseConfig";
import CreatePost from "./components/CreatePost";
import Profile from "./components/Profile";

const firebaseApp = initializeApp(firebaseConfig);
let auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);
console.log(storage);

console.log("test", auth);

function App() {
	const [searchInput, setSearchInput] = useState("");
	const [posts, setPosts] = useState<DocumentData>();
	const [user, setUser] = useState<null | User>(null);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const [openCreatePost, setOpenCreatePost] = useState(false);
	// const [comments, setComments] = useState<[]>();
	// const [updateComments, setUpdateComments] = useState(0);
	const [showProfile, setShowProfile] = useState(false);
	const logOutButton = (
		<button
			onClick={() => {
				signOut(auth);
				auth = getAuth(firebaseApp);
			}}
		>
			Sign out
		</button>
	);

	console.log(user);

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
		return onSnapshot(
			query(collection(db, "posts"), orderBy("timestamp", "desc")),
			(snapshot) => {
				setPosts(snapshot.docs);
			}
		);
	}, []);

	console.log(posts);

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setUser(user);
			} else {
				setUser(null);
			}

			console.log("user", user);
		});
	}, []);

	// useEffect(() => {
	// 	// console.log("kommy", comments);
	// 	console.log(updateComments);

	// 	setUpdateComments(updateComments + 1);
	// }, [comments]);
	return (
		<main className="main">
			<Header
				searchInput={searchInput}
				setSearchInput={setSearchInput}
				open={openCreatePost}
				setOpen={setOpenCreatePost}
				user={user}
				logOutButton={logOutButton}
				signIn={signIn}
				signUp={signUp}
				showProfile={showProfile}
				setShowProfile={setShowProfile}
			/>
			{user ? (
				<>
					<CreatePost
						user={user}
						show={openCreatePost}
						handleShow={setOpenCreatePost}
					/>

					<div className="posts">
						{showProfile ? (
							<Profile user={user} posts={posts} db={db} />
						) : (
							<>
								{posts
									? !searchInput
										? posts.map((post: DocumentData) => {
												console.log("id", post.id, post);

												return (
													<Post
														key={post.id}
														id={post.id}
														username={post.data().username}
														caption={post.data().caption}
														imageUrl={post.data().imageUrl}
														user={user}
														timestamp={post.data().timestamp}
														profilePic={post.data().profilePicture}
														uid={post.data().uid}
													/>
												);
										  })
										: posts.map((post: DocumentData) => {
												if (post.data().caption.includes(searchInput)) {
													return (
														<Post
															key={post.id}
															id={post.id}
															username={post.data().username}
															caption={post.data().caption}
															imageUrl={post.data().imageUrl}
															user={user}
															timestamp={post.data().timestamp}
															profilePic={post.data().profilePicture}
															uid={post.data().uid}
														/>
													);
												}
										  })
									: ""}
							</>
						)}
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
		</main>
	);
}

const db = getFirestore();
// async function FB(
// 	setUpdateComments: SetStateAction<any>,
// 	updateComments: number
// ) {
// 	const colRef = collection(db, "posts");
// 	const querySnapshot = await getDocs(colRef);
// 	console.log(querySnapshot);

// 	const data: DocumentData[] = [];
// 	querySnapshot.forEach((doc) => {
// 		// console.log(doc);

// 		const post = doc.data();
// 		const id = doc.id;
// 		data.push({ id, ...post });
// 	});

// 	setUpdateComments(updateComments + 1);

// 	return data;
// }

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
export { storage };
