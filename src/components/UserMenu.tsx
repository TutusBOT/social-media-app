function UserMenu({ setOpen, open }: { setOpen: any; open: boolean }) {
	return (
		<>
			<button
				onClick={() => {
					if (open) {
						setOpen(false);
					} else {
						setOpen(true);
					}
				}}
			>
				+
			</button>
		</>
	);
}

export default UserMenu;
