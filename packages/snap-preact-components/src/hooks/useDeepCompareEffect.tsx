import { h } from 'preact';
import { useEffect, useRef, useMemo } from 'preact/hooks';
import type { EffectCallback, Inputs } from 'preact/hooks';
import { dequal as deepEqual } from 'dequal';

export function useDeepCompareMemoize<T>(value: T) {
	const ref = useRef<T>(value);
	const signalRef = useRef<number>(0);

	if (!deepEqual(value, ref.current)) {
		ref.current = value;
		signalRef.current += 1;
	}

	return useMemo(() => ref.current, [signalRef.current]);
}

export function useDeepCompareEffect(callback: EffectCallback, dependencies: Inputs | undefined) {
	return useEffect(callback, useDeepCompareMemoize(dependencies));
}
