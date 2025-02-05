import { FunctionalComponent, RenderableProps } from 'preact';
import { CustomComponentWrapper } from './CustomComponentWrapper';

export const CustomComponent = async (props: CustomComponentProps) => {
	const { type, name, componentFn } = props;
	const Component = await componentFn();
	return (props: any) => {
		return (
			<CustomComponentWrapper type={type} name={name}>
				<Component {...props} />
			</CustomComponentWrapper>
		);
	};
};

export interface CustomComponentProps {
	type: string;
	name: string;
	componentFn: (args?: any) => Promise<FunctionalComponent<RenderableProps<any>>> | FunctionalComponent<RenderableProps<any>>;
}
