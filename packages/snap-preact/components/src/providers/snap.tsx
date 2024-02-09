import { h, createContext, ComponentChildren, ComponentType } from 'preact';
import { useContext } from 'preact/hooks';
import type { Snap, SnapTemplates } from '../../../src';

const SnapContext = createContext<undefined | Snap | SnapTemplates>(undefined);

export const SnapProvider = ({ children, snap }: { children: ComponentChildren; snap: Snap }) => {
	return <SnapContext.Provider value={snap}>{children}</SnapContext.Provider>;
};

export const useSnap = () => useContext(SnapContext);

export function withSnap<C extends ComponentType>(Component: C): C {
	return ((props: any) => (
		// additional props must come after controller prop
		<Component snap={useSnap()} {...props} />
	)) as C;
}
