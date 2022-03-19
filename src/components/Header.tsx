import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";

function Header({
	searchInput,
	setSearchInput,
}: {
	searchInput: string;
	setSearchInput: any;
}) {
	return (
		<nav className="navbar">
			<div className="navbar-logo">LOGO</div>
			<SearchBar searchInput={searchInput} setSearchInput={setSearchInput} />
			<UserMenu />
		</nav>
	);
}

export default Header;
