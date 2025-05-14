export const componentNameToClassName = (name: string) => {
	// eg. searchHorizontal -> search-horizontal
	return name.replace(/([A-Z])/g, (match) => '-' + match.toLowerCase());
};
