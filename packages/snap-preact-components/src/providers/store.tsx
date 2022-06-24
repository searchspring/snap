import preact, { h, createContext, ComponentChildren, ComponentType } from 'preact';
import { useContext } from 'preact/hooks';
import type { AbstractStore } from '@searchspring/snap-store-mobx';

const StoreContext = createContext<null | AbstractStore>(null);

export const StoreProvider = ({ children, store }: { children: ComponentChildren; store: AbstractStore }) => {
	return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

export const useStore = () => useContext(StoreContext);

export const withStore = (Component: ComponentType) => (props: any) => {
	return <Component store={useStore()} {...props} />;
};
