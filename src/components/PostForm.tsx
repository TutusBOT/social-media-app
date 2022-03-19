import { useState } from "react";

function PostForm() {
	const [postText, setPostText] = useState("");
	return (
		<form>
			<input
				type="text"
				value={postText}
				onChange={(e) => {
					setPostText(e.target.value);
				}}
			/>
			<button onClick={() => {}}>POST</button>
		</form>
	);
}

export default PostForm;
