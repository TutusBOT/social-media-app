import { User } from "firebase/auth";
import { Dispatch, SetStateAction, useState } from "react";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";

function Header({
	searchInput,
	setSearchInput,
	open,
	setOpen,
	user,
	logOutButton,
	signIn,
	signUp,
	showProfile,
	setShowProfile,
}: {
	searchInput: string;
	setSearchInput: Dispatch<SetStateAction<string>>;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	user: null | User;
	logOutButton: JSX.Element;
	signIn: Function;
	signUp: Function;
	showProfile: boolean;
	setShowProfile: Dispatch<SetStateAction<boolean>>;
}) {
	const [openSignUp, setOpenSignUp] = useState(false);
	const [openSignIn, setOpenSignIn] = useState(false);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	return (
		<nav className="navbar">
			<div className="navbar-logo">LOGO</div>
			<SearchBar setSearchInput={setSearchInput} />
			{user ? (
				<UserMenu
					open={open}
					setOpen={setOpen}
					profilePicture={user.photoURL}
					logOut={logOutButton}
					setShowProfile={setShowProfile}
					setSearchInput={setSearchInput}
				/>
			) : (
				<>
					<button
						onClick={() => {
							setOpenSignUp(true);
						}}
					>
						Sign Up
					</button>
					<button onClick={() => [setOpenSignIn(true)]}>Sign In</button>
				</>
			)}
			{openSignIn ? (
				<form
					className="navbar-signin modal"
					onSubmit={(e) => {
						e.preventDefault();
						signIn(email, password);
						setOpenSignIn(false);
					}}
					onClick={() => {
						setOpenSignIn(false);
					}}
				>
					<div onClick={(e) => [e.stopPropagation()]}>
						email:{" "}
						<input
							type="email"
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
							}}
						/>
						password:{" "}
						<input
							type="password"
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
							}}
						/>
						<button type="submit">Sign In</button>
					</div>
				</form>
			) : (
				""
			)}
			{openSignUp ? (
				<form
					className="navbar-signup modal"
					onSubmit={(e) => {
						e.preventDefault();
						signUp(email, password, username);
						setOpenSignUp(false);
					}}
					onClick={() => {
						setOpenSignUp(false);
					}}
				>
					<div onClick={(e) => [e.stopPropagation()]}>
						email:{" "}
						<input
							type="email"
							value={email}
							onChange={(e) => {
								setEmail(e.target.value);
							}}
						/>
						password:{" "}
						<input
							type="password"
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
							}}
						/>
						<input
							type="text"
							value={username}
							onChange={(e) => {
								setUsername(e.target.value);
							}}
						/>
						<button
							type="submit"
							disabled={
								!username.trim() || password.trim().length < 8 || !email.trim()
							}
						>
							Sign Up
						</button>
					</div>
				</form>
			) : (
				""
			)}
		</nav>
	);
}

export default Header;
