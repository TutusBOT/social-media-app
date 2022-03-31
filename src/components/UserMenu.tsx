import { Dispatch, SetStateAction, useState } from "react";
import { AiOutlinePlusCircle, AiFillHome } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";

function UserMenu({
	setOpen,
	open,
	profilePicture,
	logOut,
	setShowProfile,
	setSearchInput,
}: {
	setOpen: any;
	open: boolean;
	profilePicture: string | null;
	logOut: JSX.Element;
	setShowProfile: Dispatch<SetStateAction<boolean>>;
	setSearchInput: Dispatch<SetStateAction<string>>;
}) {
	const [openUser, setOpenUser] = useState("none");
	return (
		<div className="navbar-usermenu">
			<AiFillHome
				size={"2em"}
				onClick={() => {
					setShowProfile(false);
					setSearchInput("");
				}}
			/>
			<AiOutlinePlusCircle
				size={"2em"}
				onClick={() => {
					setOpen(true);
				}}
			/>
			{profilePicture ? (
				<img
					onClick={() => {
						setOpenUser("flex");
					}}
					src={
						profilePicture ||
						"https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"
					}
					alt=""
				/>
			) : (
				<FaUserCircle />
			)}

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
					<li>
						<button
							onClick={() => {
								setShowProfile(true);
								setOpenUser("none");
							}}
						>
							Profile
						</button>
					</li>
					<li>{logOut}</li>
				</ul>
			</div>
		</div>
	);
}

export default UserMenu;
