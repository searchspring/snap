import { h, createContext, ComponentChildren, ComponentType } from 'preact';
import { useContext } from 'preact/hooks';

const TreePathContext = createContext<null | string>(null);

export const TreePathProvider = ({ children, path }: { children: ComponentChildren; path: string }) => {
	return <TreePathContext.Provider value={path}>{children}</TreePathContext.Provider>;
};

export const useTreePath = () => useContext(TreePathContext) || undefined;

export function withTreePath<C extends ComponentType>(Component: C): C {
	return ((props: any) => {
		// additional props must come after store prop
		const treePath = useTreePath();
		return <Component treePath={treePath} {...props} />;
	}) as C;
}
