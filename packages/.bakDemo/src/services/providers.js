import { h, createContext } from 'preact';
import { useContext } from 'preact/hooks';

// store providers
const StoreContext = createContext();

export const StoreProvider = ({ children, store }) => {
	return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

export const useStore = () => useContext(StoreContext);

export const withStore = (Component) => (props) => {
	return <Component {...props} store={useStore()} />;
};
