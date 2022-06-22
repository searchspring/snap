import { jsx } from '@emotion/react';
import preact, { h, createContext, ComponentChildren, ComponentType } from 'preact';
import { useContext } from 'preact/hooks';
import type { AbstractController } from '@searchspring/snap-controller';

const ControllerContext = createContext<null | AbstractController>(null);

export const ControllerProvider = ({ children, controller }: { children: ComponentChildren; controller: AbstractController }) => {
	return <ControllerContext.Provider value={controller}>{children}</ControllerContext.Provider>;
};

export const useController = () => useContext(ControllerContext);

export const withController = (Component: ComponentType) => (props: any) => {
	return <Component controller={useController()} {...props} />;
};
