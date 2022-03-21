import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";

function Header({
	searchInput,
	setSearchInput,
	open,
	setOpen,
}: {
	searchInput: string;
	setSearchInput: any;
	open: boolean;
	setOpen: any;
}) {
	return (
		<nav className="navbar">
			<div className="navbar-logo">LOGO</div>
			<SearchBar searchInput={searchInput} setSearchInput={setSearchInput} />
			<UserMenu open={open} setOpen={setOpen} />
		</nav>
	);
}

export default Header;
