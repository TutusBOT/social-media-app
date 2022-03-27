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
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import Moment from "react-moment";
function Post({
	id,
	username,
	caption,
	imageUrl,
	user,
	timestamp,
}: {
	id: string;
	username: string;
	caption: string;
	imageUrl: string;
	user: any;
	timestamp: any;
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
	const db = getFirestore();
	const postDate = new Date(timestamp.seconds * 1000);

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
	}, [db]);

	const addComment = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
		const commentToSend = comment;
		setComment("");

		await addDoc(collection(db, "posts", id, "comments"), {
			comment: commentToSend,
			username: user.displayName,
			likes: 0,
			timestamp: serverTimestamp(),
		});
	};

	return (
		<div className="post">
			<div className="post-header">
				<h2>{username}</h2>
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
						{username == user.displayName ? (
							<button
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
					</div>
				) : (
					""
				)}
			</div>
			<div className="post-image">
				<img src={imageUrl} alt="" />
			</div>
			<h4 className="post-caption" style={{ fontWeight: "normal" }}>
				{caption ? (
					<>
						<strong>{username}</strong>: {caption}
					</>
				) : (
					""
				)}
			</h4>
			<Moment fromNow date={postDate.toDateString()} />
			<div className="post-comments">
				{/* {sortedComments.length ? (
					<>
						Comments: <br />
					</>
				) : (
					""
				)}
				{sortedComments.map((com) => {
					return <Comment text={com[1]} likes={com[2]} username={com[3]} />;
				})} */}

				{/* {comments.length > 0 &&
					comments.map((comment: any) => {
						<div key={comment.id}>comment.data().likes</div>;
					})} */}
				{/* {setTimeout(() => {
					comments.length ? "są" : "nie są";
				}, 500)	} */}
				{comments
					? comments.length
						? comments.map((com: any) => {
								console.log(com.data());

								return (
									<div key={com.id} className="comment">
										<p>
											{com.data().username}
											{": "}
											{com.data().comment}
										</p>
										<p>
											<Moment fromNow date={com.data().timestamp?.toDate()} />
										</p>
										<p>{com.data().likes} likes</p>
									</div>
								);
						  })
						: ""
					: ""}
			</div>
			<form>
				<input
					type="text"
					value={comment}
					onChange={(e) => {
						setComment(e.target.value);
					}}
				/>
				<button type="submit" disabled={!comment.trim()} onClick={addComment}>
					Post
				</button>
			</form>
		</div>
	);
}

export default Post;
