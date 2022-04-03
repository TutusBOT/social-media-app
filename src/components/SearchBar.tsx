import { Dispatch, SetStateAction, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

function SearchBar({
	setSearchInput,
}: {
	setSearchInput: Dispatch<SetStateAction<string>>;
}) {
	const [value, setValue] = useState("");
	return (
		<form
			className="navbar-searchbar"
			action=""
			onSubmit={(e) => {
				e.preventDefault();
			}}
		>
			<div
				className="navbar-searchbar-icon"
				onClick={() => {
					setSearchInput(value);
				}}
			>
				<AiOutlineSearch />
			</div>
			<input
				type="text"
				className="navbar-searchbar-input"
				placeholder={"Search by caption"}
				value={value}
				onChange={(e) => {
					setValue(e.target.value);
				}}
				onKeyDown={(e) => {
					if (e.key === "Enter") setSearchInput(value);
				}}
			/>
		</form>
	);
}

export default SearchBar;
