import { jsx } from '@emotion/react';
import preact, { h, createContext } from 'preact';
import { useContext } from 'preact/hooks';

const ControllerContext = createContext(null);

export const ControllerProvider = ({ children, controller }: { children: any; controller: any }) => {
	return <ControllerContext.Provider value={controller}>{children}</ControllerContext.Provider>;
};

export const useController = () => useContext(ControllerContext);

export const withController = (Component: any) => (props: any) => {
	return <Component controller={useController()} {...props} />;
};
