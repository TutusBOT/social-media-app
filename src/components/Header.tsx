import { User } from "firebase/auth";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";

function Header({
	searchInput,
	setSearchInput,
	open,
	setOpen,
	user,
	logOutButton,
}: {
	searchInput: string;
	setSearchInput: any;
	open: boolean;
	setOpen: any;
	user: null | User;
	logOutButton: JSX.Element;
}) {
	return (
		<nav className="navbar">
			<div className="navbar-logo">LOGO</div>
			<SearchBar searchInput={searchInput} setSearchInput={setSearchInput} />
			{user ? (
				<UserMenu
					open={open}
					setOpen={setOpen}
					profilePicture={user.photoURL}
					logOut={logOutButton}
				/>
			) : (
				<></>
			)}
		</nav>
	);
}

export default Header;
