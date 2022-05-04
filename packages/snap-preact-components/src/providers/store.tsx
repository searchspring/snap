import preact, { h, createContext } from 'preact';
import { useContext } from 'preact/hooks';

const StoreContext = createContext(null);

export const StoreProvider = ({ children, store }: { children: any; store: any }) => {
	return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

export const useStore = () => useContext(StoreContext);

export const withStore = (Component: any) => (props: any) => {
	return <Component store={useStore()} {...props} />;
};
