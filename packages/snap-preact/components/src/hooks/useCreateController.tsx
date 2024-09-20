import { useEffect, useState } from 'preact/hooks';

import type { ControllerTypes, ControllerConfigs, Controllers } from '@searchspring/snap-controller';
import type { Snap } from '../../../src';

export const useCreateController = <ControllerType extends Controllers>(
	snap: Snap,
	type: keyof typeof ControllerTypes,
	config: ControllerConfigs
): ControllerType => {
	const [controller, setController] = useState<Controllers | undefined>(undefined);

	useEffect(() => {
		// check if the controller already exists, and use that if it does, otherwise create one
		snap
			.getController(config.id)
			.then((controller: Controllers) => {
				setController(controller);
			})
			.catch(() => {
				snap.createController(type, config).then((controller: Controllers) => {
					setController(controller);
				});
			});
	}, []);

	return controller as ControllerType;
};
