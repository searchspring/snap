import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { ResponsiveProps, ResponsiveEntry } from '../components/Organisms/Results/Results';

export function useDisplaySettings(responsiveObj: ResponsiveProps): ResponsiveEntry {
	if (!responsiveObj || !Object.keys(responsiveObj).length) return;

	// Call getDisplaySettings right away to prevent flashing
	const [displaySettings, setDisplaySettings] = useState(getDisplaySettings(responsiveObj));

	useEffect(() => {
		function handleResize() {
			// Set display settings to state
			setDisplaySettings(getDisplaySettings(responsiveObj));
		}
		// Add event listener
		const debouncedHandleResize = debounce(() => handleResize());
		window.addEventListener('resize', debouncedHandleResize);

		// Remove event listener on cleanup
		return () => window.removeEventListener('resize', debouncedHandleResize);
	}, []);

	return displaySettings;
}

const getDisplaySettings = (responsive: ResponsiveProps): ResponsiveEntry => {
	let responsiveSettings;

	const currentScreenWidth = window.innerWidth;
	const sortedList = Object.keys(responsive)
		?.sort((a, b) => parseInt(a) - parseInt(b))
		.map((vp) => ({ [vp]: responsive[vp] }));
	if (sortedList.length) {
		//loop through and find the desired responsive setting
		for (let i = 0; i < sortedList.length; i++) {
			const entry = sortedList[i];
			const breakpoint = parseInt(Object.keys(entry)[0]);
			const isLastEntry = i + 1 === sortedList.length;
			const isFirstEntry = i === 0;
			if (isLastEntry || (isFirstEntry && currentScreenWidth < breakpoint)) {
				// last entry or a '0' value breakpoint was not provided
				responsiveSettings = sortedList[i][breakpoint];
				break;
			} else {
				const nextBreakpoint = parseInt(Object.keys(sortedList[i + 1])[0]);
				if (currentScreenWidth >= breakpoint && currentScreenWidth < nextBreakpoint) {
					responsiveSettings = sortedList[i][breakpoint];
					break;
				}
			}
		}

		return responsiveSettings;
	}
};

const debounce = (func, timeout = 200) => {
	let timer;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			func.apply(this, args);
		}, timeout);
	};
};
