import { Dispatch, SetStateAction, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
	collection,
	addDoc,
	getFirestore,
	Timestamp,
	serverTimestamp,
} from "firebase/firestore";
import { storage } from "../App";
import { User } from "firebase/auth";

function CreatePost({
	user,
	show,
	handleShow,
}: {
	user: null | User;
	show: boolean;
	handleShow: Dispatch<SetStateAction<boolean>>;
}) {
	const [image, setImage] = useState<any>();
	const [caption, setCaption] = useState("");
	const [progressPCT, setProgressPCT] = useState(0);
	const db = getFirestore();
	const handleChange = (event: any) => {
		if (event.target.files[0]) {
			setImage(event.target.files[0]);
			console.log(event.target.files[0]);
		}
		console.log("chuj", user);
	};

	const handleUpload = () => {
		const imageRef = ref(storage, `images/${image.name}`);
		const uploadImage = uploadBytesResumable(imageRef, image);
		uploadImage.on(
			"state_changed",
			(snapshot) => {
				// Observe state change events such as progress, pause, and resume
				// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
				const progress =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				console.log("Upload is " + progress + "% done");
				setProgressPCT(progress);
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
					const docRef = addDoc(collection(db, "posts"), {
						username: user?.displayName,
						caption: caption,
						imageUrl: downloadURL,
						timestamp: serverTimestamp(),
					});
					//   console.log('File available at', downloadURL);
				});
			}
		);
	};
	return (
		<div
			className="createpost"
			style={{ display: show ? "flex" : "none", opacity: show ? "1" : "0" }}
			onClick={() => {
				handleShow(false);
			}}
		>
			<div
				className="createpost-wrapper"
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				<h2>Create new post</h2>
				<input
					type="text"
					value={caption}
					onChange={(e) => {
						setCaption(e.target.value);
					}}
				/>
				<input
					type="file"
					onChange={(e) => {
						handleChange(e);
					}}
				/>
				<button
					onClick={() => {
						handleUpload();
					}}
				>
					Post
				</button>
			</div>
		</div>
	);
}

export default CreatePost;
