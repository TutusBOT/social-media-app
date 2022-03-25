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
	const [comments, setComments] = useState<[]>();
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
	setTimeout(() => {
		console.log("posty", posts);
	}, 500);
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
			const reqPostsData = await FB(setComments);
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
				setUser(user);
			} else {
				setUser(null);
			}

			console.log("user", user);
		});
	}, []);
	return (
		<div className="main">
			<Header
				searchInput={searchInput}
				setSearchInput={setSearchInput}
				open={openCreatePost}
				setOpen={setOpenCreatePost}
				user={user}
				logOutButton={logOutButton}
			/>
			{user ? (
				<>
					<CreatePost
						user={user}
						show={openCreatePost}
						handleShow={setOpenCreatePost}
					/>

					<div className="posts">
						{posts
							? posts.map((post: IPosts) => {
									return (
										<Post
											key={post.id}
											username={post.username}
											caption={post.caption}
											imageUrl={post.imageUrl}
											profilePictureUrl={""}
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

async function FB(setComments: SetStateAction<any>) {
	const db = getFirestore();
	const colRef = collection(db, "posts");
	const querySnapshot = await getDocs(colRef);
	console.log(querySnapshot);

	const data: DocumentData[] = [];
	querySnapshot.forEach((doc) => {
		console.log(doc);

		const post = doc.data();
		const id = doc.id;
		data.push({ id, ...post });
	});
	const dataWithComments: DocumentData[] = [];
	data.forEach(async (doc) => {
		const commmentsRef = collection(db, `posts/${doc.id}/comments`);
		const queryComments = await getDocs(commmentsRef);
		queryComments.forEach((commentObj) => {
			const comment = commentObj.data();
			dataWithComments.push([
				doc.id,
				comment.comment,
				comment.likes,
				comment.username,
			]);
		});
		setComments(dataWithComments);
		console.log("coms", dataWithComments);
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
export { storage };
