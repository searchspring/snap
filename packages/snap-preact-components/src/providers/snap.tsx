import { h, createContext, ComponentChildren, ComponentType } from 'preact';
import { useContext } from 'preact/hooks';

// TODO: change from any -> Snap
const SnapContext = createContext<null | any>(null);

export const SnapProvider = ({ children, snap }: { children: ComponentChildren; snap: any }) => {
	return <SnapContext.Provider value={snap}>{children}</SnapContext.Provider>;
};

export const useSnap = () => useContext(SnapContext);

export function withSnap<C extends ComponentType>(Component: C): C {
	return ((props: any) => (
		// additional props must come after controller prop
		<Component snap={useSnap()} {...props} />
	)) as C;
}
