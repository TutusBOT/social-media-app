import { useState } from "react";

function UserMenu({
	setOpen,
	open,
	profilePicture,
	logOut,
}: {
	setOpen: any;
	open: boolean;
	profilePicture: string | null;
	logOut: JSX.Element;
}) {
	const [openUser, setOpenUser] = useState("none");
	const handleCloseUser = () => {};
	return (
		<div className="navbar-usermenu">
			<button
				onClick={() => {
					setOpen(true);
				}}
			>
				+
			</button>
			<div
				onClick={() => {
					setOpenUser("flex");
				}}
			>
				<img
					src={
						profilePicture ||
						"https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
					}
					alt=""
				/>
			</div>
			<div
				className="usermenu-modal"
				onClick={() => {
					setOpenUser("none");
				}}
				style={{ display: openUser }}
			>
				<ul
					onClick={(e) => {
						e.stopPropagation();
					}}
					className="usermenu-modal-list"
				>
					<li>{logOut}</li>
					<li>settings?</li>
				</ul>
			</div>
		</div>
	);
}

export default UserMenu;
