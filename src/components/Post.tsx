import { timeStamp } from "console";
import {
	addDoc,
	collection,
	deleteDoc,
	DocumentData,
	getFirestore,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	doc,
	setDoc,
	getDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { BsThreeDots, BsChat } from "react-icons/bs";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { BiTagAlt } from "react-icons/bi";
import Moment from "react-moment";
import SaveIcon from "./SaveIcon";
function Post({
	id,
	username,
	caption,
	imageUrl,
	user,
	timestamp,
	profilePic,
	uid,
}: {
	id: string;
	username: string;
	caption: string;
	imageUrl: string;
	user: any;
	timestamp: any;
	profilePic: string;
	uid: string;
}) {
	// useEffect(() => {
	// 	console.log("postcom", comments);
	// 	sortComments(comments);
	// }, [comments]);
	// console.log("sortedcomm", comments);
	// const sortedComments: [] = [];
	// function sortComments(comments: [] | undefined) {
	// 	console.log("some coms", comments);

	// 	comments?.forEach((com) => {
	// 		console.log("com", com);
	// 	});

	// 	comments?.forEach((comment) => {
	// 		console.log("com0", comment[0], id, comments, comments.length);
	// 		if (comment[0] === id) {
	// 			sortedComments.push(comment);
	// 		}
	// 	});
	// 	console.log("sorted", sortedComments, id);
	// }
	const [openPostMenu, setOpenPostMenu] = useState(false);
	const [comment, setComment] = useState("");
	const [comments, setComments] = useState<DocumentData>();
	const [likes, setLikes] = useState<DocumentData>();
	const [hasliked, setHasLiked] = useState(false);
	const [isSaved, setIsSaved] = useState(false);
	const db = getFirestore();
	// const postDate = new Date(timestamp.seconds * 1000);

	useEffect(() => {
		onSnapshot(
			query(
				collection(db, "posts", id, "comments"),
				orderBy("timestamp", "desc")
			),
			(snapshot) => {
				console.log("snapshot", snapshot.docs);
				const commentsToDisplay = snapshot.docs.map((doc) => {
					return doc;
				});
				console.log("KOMY", commentsToDisplay.length);

				setComments(commentsToDisplay);
			}
		);
	}, [db, id]);

	useEffect(() => {
		onSnapshot(collection(db, "posts", id, "likes"), (snapshot) => {
			setLikes(snapshot.docs);
		});
	}, [db, id]);

	useEffect(() => {
		setHasLiked(
			likes?.findIndex((like: { id: any }) => like.id === user.uid) !== -1
		);
	}, [likes]);

	useEffect(() => {
		if (!user?.uid) return;
		onSnapshot(doc(db, "user", user?.uid, "savedPosts", id), (snapshot) => {
			if (!snapshot?.data()) {
				setIsSaved(false);
				return;
			}
			setIsSaved(true);
		});
	}, [db]);

	// useEffect(() => {
	// 	onSnapshot(
	// 		collection(db, "user", user.uid, "savedPosts", id),
	// 		(snapshot) => {}
	// 	);
	// }, []);

	const addComment = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
		const commentToSend = comment;
		setComment("");

		await addDoc(collection(db, "posts", id, "comments"), {
			comment: commentToSend,
			username: user.displayName,
			timestamp: serverTimestamp(),
			profilePicture: user.photoURL,
			uid: user.uid,
		});
	};

	const likePost = async () => {
		if (hasliked) {
			await deleteDoc(doc(db, "posts", id, "likes", user.uid));
		} else {
			await setDoc(doc(db, "posts", id, "likes", user.uid), {
				username: user.displayName,
			});
		}
	};

	const handleSavePost = () => {
		if (isSaved) {
			deleteDoc(doc(db, "user", user.uid, "savedPosts", id));
			return;
		}
		setDoc(doc(db, "user", user.uid, "savedPosts", id), {
			postid: id,
		});
		console.log("jd");
	};

	return (
		<div className="post">
			<div className="post-header">
				<h2>
					{profilePic ? (
						<img src={profilePic} alt="profile" />
					) : (
						<FaUserCircle />
					)}
					{username}
				</h2>
				<div>
					<BsThreeDots
						size={"2em"}
						onClick={() => {
							setOpenPostMenu(true);
						}}
					/>
				</div>
				{openPostMenu ? (
					<div
						className="modal"
						onClick={() => {
							setOpenPostMenu(false);
						}}
					>
						<div className="post-buttons">
							{uid == user.uid ? (
								<button
									className="post-delete"
									onClick={(e) => {
										e.stopPropagation();
										deleteDoc(doc(db, "posts", id));
										setOpenPostMenu(false);
									}}
								>
									Delete Post
								</button>
							) : (
								""
							)}
							<button
								onClick={() => {
									setOpenPostMenu(false);
								}}
							>
								Cancel
							</button>
						</div>
					</div>
				) : (
					""
				)}
			</div>
			<div className="post-image">
				<img src={imageUrl} alt="" />
			</div>
			{/* <Moment fromNow date={postDate.toDateString()} /> */}
			<div className="post-icons">
				<div>
					{hasliked ? (
						<AiFillHeart size={"2em"} color={"red"} onClick={likePost} />
					) : (
						<AiOutlineHeart size={"2em"} onClick={likePost} />
					)}
					<BsChat className="post-chaticon" size={"2em"} />
					<FiSend size={"2em"} />
				</div>
				<SaveIcon
					color={isSaved ? "black" : null}
					handleSave={handleSavePost}
				/>
			</div>
			<p>{likes ? likes.length : 0} likes </p>
			<h4 className="post-caption" style={{ fontWeight: "normal" }}>
				{caption ? (
					<>
						<strong>{username}</strong>: {caption}
					</>
				) : (
					""
				)}
			</h4>
			<div className="post-comments">
				{comments
					? comments.length
						? comments.map((com: any) => {
								// console.log(com.data());

								return (
									<div key={com.id} className="comment">
										<img
											src={com.data().profilePicture}
											alt="profile"
											style={{
												width: "2rem",
												height: "2rem",
												borderRadius: "50%",
												marginRight: "0.5rem",
											}}
										/>
										{com.data().username}
										{": "}
										{com.data().comment}
									</div>
								);
						  })
						: ""
					: ""}
			</div>
			{timestamp ? <Moment fromNow date={timestamp.toDate()} /> : null}

			<form className="post-formcomment">
				<input
					type="text"
					placeholder="Add comment"
					value={comment}
					onChange={(e) => {
						setComment(e.target.value);
					}}
				/>
				<button
					type="submit"
					disabled={!comment.trim()}
					style={{ color: !comment.trim() ? "#0095f64d" : "#0095f6" }}
					onClick={addComment}
				>
					Post
				</button>
			</form>
		</div>
	);
}

export default Post;
