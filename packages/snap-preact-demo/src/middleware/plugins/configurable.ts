export const configurable = (controller: AbstractController, ...params: any) => {
	controller.log.debug('configurable plugin has parameters:', ...params);
};
