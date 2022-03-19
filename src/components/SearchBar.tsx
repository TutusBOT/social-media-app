function SearchBar({
	searchInput,
	setSearchInput,
}: {
	searchInput: string;
	setSearchInput: any;
}) {
	return (
		<form action="">
			<input
				type="text"
				value={searchInput}
				onChange={(e) => {
					setSearchInput(e.target.value);
				}}
			/>
		</form>
	);
}

export default SearchBar;
