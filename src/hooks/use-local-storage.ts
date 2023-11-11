import React from "react";

export function useLocalStorage(
	key: string,
	initialValue: string,
	disableStorage: boolean,
): [string, React.Dispatch<React.SetStateAction<string>>] {
	const [value, setValue] = React.useState(initialValue);
	const [noStorage, setNoStorage] = React.useState(disableStorage);

	React.useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const noStorageParam = urlParams.get("disable-storage");
		if (noStorageParam !== null) {
			setNoStorage(noStorageParam === "true");
		}
	}, []);

	React.useEffect(() => {
		if (!noStorage) {
			const storedValue = localStorage.getItem(key);
			if (storedValue !== null) {
				setValue(storedValue);
			}
		}
	}, [noStorage]);

	React.useEffect(() => {
		if (!noStorage) {
			localStorage.setItem(key, value);
		}
	}, [key, value, noStorage]);

	return [value, setValue];
}
