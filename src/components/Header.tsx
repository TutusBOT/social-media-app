import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";

function Header() {
	return (
		<nav className="navbar">
			<div>LOGO</div>
			<SearchBar />
			<UserMenu />
		</nav>
	);
}

export default Header;
