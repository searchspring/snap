import { h, createContext, ComponentChildren, ComponentType } from 'preact';
import { useContext } from 'preact/hooks';
import type { AbstractController } from '@searchspring/snap-controller';

const ControllerContext = createContext<null | AbstractController>(null);

export const ControllerProvider = ({ children, controller }: { children: ComponentChildren; controller: AbstractController }) => {
	return <ControllerContext.Provider value={controller}>{children}</ControllerContext.Provider>;
};

export const useController = () => useContext(ControllerContext);

export function withController<C extends ComponentType>(Component: C): C {
	return ((props: any) => (
		<ControllerContext.Consumer>{(controller) => <Component {...props} controller={controller} />}</ControllerContext.Consumer>
	)) as C;
}
