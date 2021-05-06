// needed for TS to resolve md files

declare module '*.md' {
	const content: string;
	export default content;
}
