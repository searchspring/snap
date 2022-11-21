import { h, createContext, ComponentChildren, ComponentType } from 'preact';
import { useContext } from 'preact/hooks';
import type { AbstractStore } from '@searchspring/snap-store-mobx';

const StoreContext = createContext<null | AbstractStore>(null);

export const StoreProvider = ({ children, store }: { children: ComponentChildren; store: AbstractStore }) => {
	return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

export const useStore = () => useContext(StoreContext);

export function withStore<C extends ComponentType>(Component: C): C {
	return ((props: any) => (
		// additional props must come after store prop
		<Component store={useStore()} {...props} />
	)) as C;
}
