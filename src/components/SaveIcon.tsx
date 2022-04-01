import React from "react";

function SaveIcon({
	color,
	handleSave,
}: {
	color: string | null;
	handleSave: Function;
}) {
	return (
		<svg
			onClick={() => {
				handleSave();
			}}
			className="post-saveicon"
			aria-label="Save"
			color="#262626"
			fill="#262626"
			height="32"
			role="img"
			viewBox="0 0 24 24"
			width="32"
		>
			<polygon
				fill={color ?? "none"}
				points="20 21 12 13.44 4 21 4 3 20 3 20 21"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			></polygon>
		</svg>
	);
}

export default SaveIcon;
