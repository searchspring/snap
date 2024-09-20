import { useEffect, useRef } from 'preact/hooks';

const prismClassname = 'prism-block';

export const highlightedCode = (props: { children?: any; className?: string }) => {
	const elemRef = useRef<HTMLElement>(null);

	useEffect(() => {
		if (elemRef.current && props.className?.includes('lang-') && !props.className?.includes(prismClassname)) {
			// @ts-ignore - window obj
			window?.Prism?.highlightElement(elemRef.current);
		}
	}, [props.className, props.children, elemRef]);

	return <code {...props} ref={elemRef} data-prismjs-copy="Copy" />;
};
