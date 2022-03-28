import { updateProfile, User } from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { storage } from "../App";

function Profile({ user }: { user: User | null }) {
	const [image, setImage] = useState<any>();
	const [username, setUsername] = useState(user?.displayName);
	useEffect(() => {
		setUsername(user?.displayName);
	}, [user]);
	const imageRef = ref(storage, `profilePictures/${user?.uid}`);

	const changeUsername = () => {
		if (!user) return;
		updateProfile(user, {
			displayName: username,
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
				console.log("Upload is " + progress + "% done");
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
						});
					}
				});
			}
		);
	};
	return (
		<div>
			<p>
				Username:{" "}
				<input
					type="text"
					value={username ?? ""}
					onChange={(e) => {
						setUsername(e.target.value);
					}}
				/>
			</p>{" "}
			<button onClick={changeUsername}>Submit</button>
			<p>{user?.email}</p>
			<input
				type="file"
				onChange={(e) => {
					handleChange(e);
				}}
			/>
			<button onClick={handleUpload}>Change ProfPic</button>
			<img src={user?.photoURL || ""} alt="" />
		</div>
	);
}

export default Profile;
