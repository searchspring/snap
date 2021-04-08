import preact, { h, createContext } from 'preact';
import { useContext } from 'preact/hooks';

const StoreContext = createContext(null);

export const StoreProvider = ({ children, store }) => {
	return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

export const useStore = () => useContext(StoreContext);

export const withStore = (Component) => (props) => {
	return <Component {...props} store={useStore()} />;
};
