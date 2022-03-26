import React from "react";

function Comment({
	text,
	likes,
	username,
}: {
	text: string;
	likes: number;
	username: string;
}) {
	return (
		<div>
			<p>
				<strong>{username}: </strong>
				{text}
			</p>
		</div>
	);
}

export default Comment;
