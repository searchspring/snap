// needed for css.escape usage
declare module 'css.escape' {
	function esc(className: string): string;

	export = esc;
}
