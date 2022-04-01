import { updateProfile, User } from "firebase/auth";
import {
	collection,
	DocumentData,
	Firestore,
	getDoc,
	onSnapshot,
	query,
	QueryDocumentSnapshot,
	updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { storage } from "../App";
import Post from "./Post";

function Profile({
	user,
	posts,
	db,
}: {
	user: User | null;
	posts: DocumentData | undefined;
	db: Firestore;
}) {
	const [image, setImage] = useState<any>();
	const [username, setUsername] = useState(user?.displayName);
	const [showPostModal, setShowPostModal] = useState<boolean | string>(false);
	const [showSaved, setShowSaved] = useState(false);
	const [savedPosts, setSavedPosts] = useState<
		QueryDocumentSnapshot<DocumentData>[] | undefined
	>();
	const filteredPosts = posts?.filter((post: DocumentData) => {
		return post.data().uid === user?.uid;
	});

	useEffect(() => {
		setUsername(user?.displayName);
	}, [user]);

	useEffect(() => {
		if (!user?.uid) return;
		onSnapshot(collection(db, "user", user?.uid, "savedPosts"), (snapshot) => {
			setSavedPosts(snapshot.docs);
		});
	}, [db]);
	const imageRef = ref(storage, `profilePictures/${user?.uid}`);

	const changeUsername = () => {
		if (!user) return;
		updateProfile(user, {
			displayName: username,
		}).then(() => {
			const filteredPosts = posts?.filter((post: any) => {
				return post.data().uid === user.uid;
			});
			console.log("działa>>??", filteredPosts);
			filteredPosts.forEach((filteredPost: DocumentData) => {
				console.log("filtered", filteredPost);
				const a = getDoc(filteredPost.ref);
				console.log("document", a);

				updateDoc(filteredPost.ref, {
					username: user.displayName,
				});
			});
		});
	};
	const handleChange = (event: any) => {
		if (event.target.files[0]) {
			setImage(event.target.files[0]);
			console.log(event.target.files[0]);
		}
	};
	const handleUpload = async () => {
		const uploadImage = uploadBytesResumable(imageRef, image);
		uploadImage.on(
			"state_changed",
			(snapshot) => {
				// Observe state change events such as progress, pause, and resume
				// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				console.log(
					"Upload is " + progress + "% done",
					snapshot.state,
					snapshot.task
				);
				// setProgressPCT(progress);
				switch (snapshot.state) {
					case "paused":
						console.log("Upload is paused");
						break;
					case "running":
						console.log("Upload is running");
						break;
				}
			},
			(error) => {
				// Handle unsuccessful uploads
				console.log("error with uploading", error);
			},
			() => {
				// Handle successful uploads on complete
				// For instance, get the download URL: https://firebasestorage.googleapis.com/...
				getDownloadURL(uploadImage.snapshot.ref).then((downloadURL) => {
					//   console.log('File available at', downloadURL);
					if (user) {
						updateProfile(user, {
							photoURL: downloadURL,
						}).then(() => {
							const filteredPosts = posts?.filter((post: any) => {
								return post.data().uid === user?.uid;
							});
							console.log("działa>>??", filteredPosts);
							filteredPosts.forEach((filteredPost: DocumentData) => {
								console.log("filtered", filteredPost);
								updateDoc(filteredPost.ref, {
									profilePicture: downloadURL,
								});
							});
						});
					}
				});
			}
		);
	};

	return (
		<div>
			<p>
				<label htmlFor="username">Username: </label>
				<input
					id="username"
					type="text"
					value={username ?? ""}
					onChange={(e) => {
						setUsername(e.target.value);
					}}
				/>
				<button onClick={changeUsername}>Submit</button>
			</p>
			<p>{user?.email}</p>
			<img src={user?.photoURL || ""} alt="" />
			<input
				type="file"
				accept="image/*"
				onChange={(e) => {
					handleChange(e);
				}}
			/>
			<button onClick={handleUpload}>Change ProfPic</button>
			<div className="profile-posts-header">
				<h2
					style={{ textDecoration: !showSaved ? "underline" : "none" }}
					onClick={() => {
						setShowSaved(false);
					}}
				>
					POSTS
				</h2>
				<h2
					style={{ textDecoration: showSaved ? "underline" : "none" }}
					onClick={() => {
						setShowSaved(true);
					}}
				>
					SAVED
				</h2>
			</div>
			<div className="profile-posts">
				{!showSaved
					? filteredPosts.map((post: DocumentData) => {
							return (
								<div
									key={post.id}
									className="profile-post"
									onClick={() => {
										console.log(post.id);
										setShowPostModal(post.id);
									}}
								>
									<img src={post.data().imageUrl} alt="" />
									{showPostModal === post.id ? (
										<div
											className="modal"
											onClick={(e) => {
												e.stopPropagation();
												setShowPostModal(false);
												console.log(showPostModal);
											}}
										>
											<div
												className="profile-modal-post"
												onClick={(e) => e.stopPropagation()}
											>
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
											</div>
										</div>
									) : (
										<></>
									)}
								</div>
							);
					  })
					: posts?.map((post: DocumentData) => {
							const filt = savedPosts?.filter((savedpost) => {
								console.log("saved", savedpost);

								return savedpost.data().postid === post.id;
							});
							console.log(filt);
							if (!filt?.length) return;
							return (
								<div
									key={post.id}
									className="profile-post"
									onClick={() => {
										console.log(post.id);
										setShowPostModal(post.id);
									}}
								>
									<img src={post.data().imageUrl} alt="" />
									{showPostModal === post.id ? (
										<div
											className="modal"
											onClick={(e) => {
												e.stopPropagation();
												setShowPostModal(false);
												console.log(showPostModal);
											}}
										>
											<div
												className="profile-modal-post"
												onClick={(e) => e.stopPropagation()}
											>
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
											</div>
										</div>
									) : (
										<></>
									)}
								</div>
							);
					  })}
			</div>
		</div>
	);
}

export default Profile;
