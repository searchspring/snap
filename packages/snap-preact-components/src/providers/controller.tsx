import preact, { h, createContext } from 'preact';
import { useContext } from 'preact/hooks';

const ControllerContext = createContext(null);

export const ControllerProvider = ({ children, controller }) => {
	return <ControllerContext.Provider value={controller}>{children}</ControllerContext.Provider>;
};

export const useController = () => useContext(ControllerContext);

export const withController = (Component) => (props) => {
	return <Component {...props} controller={useController()} />;
};
