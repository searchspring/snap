export const configurable = (controller, ...params) => {
	controller.log.debug('configurable plugin has parameters:', ...params);
};
