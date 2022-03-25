function Post({
	username,
	caption,
	imageUrl,
	profilePictureUrl,
}: {
	username: string;
	caption: string;
	imageUrl: string;
	profilePictureUrl: string;
}) {
	return (
		<div className="post">
			<h2 className="post-header">{username}</h2>
			<div className="post-image">
				<img src={imageUrl} alt="" />
			</div>
			<h4 className="post-caption" style={{ fontWeight: "normal" }}>
				<strong>{username}</strong>: {caption}
			</h4>
			<div className="post-comments">Comments?</div>
		</div>
	);
}

export default Post;
