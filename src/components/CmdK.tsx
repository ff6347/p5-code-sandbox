import React from "react";
import { Command } from "cmdk";
import "./cmdk-raycast.css";

export function RaycastCMDK({ paletteIsOpen, setPaletteIsOpen }) {
	const [value, setValue] = React.useState("");

	return (
		<div className="raycast">
			<Command.Dialog
				open={paletteIsOpen}
				onOpenChange={setPaletteIsOpen}
				label="Global Command Menu"
				className="raycast"
			>
				<Command value={value} onValueChange={(v) => setValue(v)}>
					<Command.Input
						autoFocus
						placeholder="Search for apps and commands..."
					/>
					<Command.List>
						<Command.Empty>No results found.</Command.Empty>
						<Command.Group heading="Suggestions">
							<Command.Item value="Example">Example</Command.Item>
						</Command.Group>
					</Command.List>
				</Command>
			</Command.Dialog>
		</div>
	);
}
