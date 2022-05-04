import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { BreakpointsProps, BreakpointsEntry } from '../types';

export function useDisplaySettings(breakpointsObj: BreakpointsProps): BreakpointsEntry | undefined {
	if (!breakpointsObj || !Object.keys(breakpointsObj).length) return;

	// Call getDisplaySettings right away to prevent flashing
	const [displaySettings, setDisplaySettings] = useState(getDisplaySettings(breakpointsObj));

	useEffect(() => {
		function handleResize() {
			// Set display settings to state
			setDisplaySettings(getDisplaySettings(breakpointsObj));
		}
		// Add event listener
		const debouncedHandleResize = debounce(() => handleResize());
		window.addEventListener('resize', debouncedHandleResize);

		// Remove event listener on cleanup
		return () => window.removeEventListener('resize', debouncedHandleResize);
	}, []);

	return displaySettings;
}

const getDisplaySettings = (breakpoints: BreakpointsProps): BreakpointsEntry | undefined => {
	let breakpointsSettings;

	const currentScreenWidth = window.innerWidth;
	const sortedList = Object.keys(breakpoints)
		?.sort((a, b) => parseInt(a) - parseInt(b))
		.map((vp) => ({ [vp]: breakpoints[vp as unknown as keyof typeof breakpoints] }));
	if (sortedList.length) {
		//loop through and find the desired breakpoints setting
		for (let i = 0; i < sortedList.length; i++) {
			const entry = sortedList[i];
			const breakpoint = parseInt(Object.keys(entry)[0]);
			const isLastEntry = i + 1 === sortedList.length;
			const isFirstEntry = i === 0;
			if (isLastEntry || (isFirstEntry && currentScreenWidth < breakpoint)) {
				// last entry or a '0' value breakpoint was not provided
				breakpointsSettings = sortedList[i][breakpoint];
				break;
			} else {
				const nextBreakpoint = parseInt(Object.keys(sortedList[i + 1])[0]);
				if (currentScreenWidth >= breakpoint && currentScreenWidth < nextBreakpoint) {
					breakpointsSettings = sortedList[i][breakpoint];
					break;
				}
			}
		}

		return breakpointsSettings;
	}

	return breakpointsSettings;
};

const debounce = (func: () => void, timeout = 200) => {
	let timer: any;
	return (...args: any) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			func.apply(this, args);
		}, timeout);
	};
};
