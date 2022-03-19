function Post({
	username,
	caption,
	imageUrl,
}: {
	username: string;
	caption: string;
	imageUrl: string;
}) {
	return (
		<div>
			<h3>{username}</h3>
			<img src={imageUrl} alt="" />
			<h4>
				{username}: {caption}
			</h4>
			<div>Comments?</div>
		</div>
	);
}

export default Post;
