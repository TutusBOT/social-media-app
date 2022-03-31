import { Dispatch, SetStateAction, useState } from "react";

function SearchBar({
	setSearchInput,
}: {
	setSearchInput: Dispatch<SetStateAction<string>>;
}) {
	const [value, setValue] = useState("");
	return (
		<form
			action=""
			onSubmit={(e) => {
				e.preventDefault();
			}}
		>
			<input
				type="text"
				value={value}
				onChange={(e) => {
					setValue(e.target.value);
				}}
			/>
			<button
				onClick={() => {
					setSearchInput(value);
				}}
			>
				Search
			</button>
		</form>
	);
}

export default SearchBar;
