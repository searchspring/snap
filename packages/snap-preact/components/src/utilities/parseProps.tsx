import type { AbstractController } from '@searchspring/snap-controller';

export function parseProps<T>(controller: AbstractController, props: T): T {
	const parsedProps: any = props;

	if (parsedProps && typeof parsedProps == 'object') {
		Object.keys(parsedProps).forEach((prop) => {
			const value = parsedProps[prop as keyof typeof parsedProps];
			// find supported string

			if (typeof value == 'string') {
				const templateVariables = value.match(/{{.[^}}]*}}/g);

				if (templateVariables && controller.store.loaded && !controller.store.loading) {
					templateVariables?.forEach((templateVariable) => {
						const paths = templateVariable.replace('{{', '').replace('}}', '').trim().split('.');

						const variable = paths.reduce((currentLevel: any, path) => {
							if (typeof currentLevel[path as keyof typeof currentLevel] != 'undefined') {
								return currentLevel[path as keyof typeof currentLevel];
							}
						}, controller);

						if (typeof variable == 'undefined') {
							controller.log.error('unable to locate variable: ', templateVariable);
						} else if (typeof variable == 'string' || typeof variable == 'number') {
							// validate that value can be used (it is a string or number)
							parsedProps[prop as keyof typeof parsedProps] = parsedProps[prop as keyof typeof parsedProps].replace(
								templateVariable,
								variable.toString()
							);
						} else {
							controller.log.error('invalid variable - must be type string or number:', templateVariable);
						}
					});
				} else if (templateVariables) {
					parsedProps[prop as keyof typeof parsedProps] = '';
				}
			}
		});
	}

	return parsedProps;
}
