// TODO move to components library
import { h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

type ProfileProps = {
	name: string;
	controller: SearchController;
	context?: any;
	children?: any;
};

export const Profile = ({ name, controller, context, children }: ProfileProps) => {
	const log = controller.log;
	const profiler = controller.profiler;
	const profileRef = useRef(profiler.create({ type: 'component', name, context }).start());

	const logComponent = {
		creation: ({ name }: { name: string }) => {
			log.dev(
				`%c +  %c<${name}/>  %c::  %cCREATED`,
				`color: ${log.colors.orange}; font-weight: bold; font-size: 14px; line-height: 12px;`,
				`color: ${log.colors.orange};`,
				`color: ${log.colors.orangedark};`,
				`color: ${log.colors.orange}; font-weight: bold;`
			);
		},
		change: ({ name, info = 'changed' }: { name: string; info: string }) => {
			log.dev(
				`%c ${log.emoji.lightning}  %c<${name}/>  %c::  %c${info.toUpperCase()}`,
				`color: ${log.colors.orange}; font-weight: bold; font-size: 14px; line-height: 12px;`,
				`color: ${log.colors.orange};`,
				`color: ${log.colors.orangedark};`,
				`color: ${log.colors.orangedark}; font-weight: bold;`
			);
		},
		error: ({ name, error = 'component crash' }: { name: string; error: string }) => {
			log.dev(
				`%c ${log.emoji.bang}  %c<${name}/>  %c::  %cERROR  %c::  %c${error}`,
				`color: ${log.colors.red}`,
				`color: ${log.colors.red};`,
				`color: ${log.colors.orangedark};`,
				`color: ${log.colors.red}; font-weight: bold;`,
				`color: ${log.colors.orangedark};`,
				`color: ${log.colors.redlight};`
			);
		},
		render: ({ name, time }: { name: string; time: number }) => {
			log.dev(
				`%c ${log.emoji.magic}  %c<${name}/>  %c::  %cRENDERED  %c::  %c${time}ms`,
				`color: ${log.colors.orange};`,
				`color: ${log.colors.orange};`,
				`color: ${log.colors.orangedark};`,
				`color: ${log.colors.orangedark}; font-weight: bold;`,
				`color: ${log.colors.orangedark};`,
				`color: ${log.colors.grey};`
			);
		},
		removal: ({ name }: { name: string }) => {
			log.dev(
				`%c -  %c<${name}/>  %c::  %cREMOVED`,
				`color: ${log.colors.orange}; font-weight: bold; font-size: 14px; line-height: 12px;`,
				`color: ${log.colors.orange};`,
				`color: ${log.colors.orangedark};`,
				`color: ${log.colors.reddark}; font-weight: bold;`
			);
		},
	};

	useEffect(() => {
		const profile = profileRef.current;
		profile.stop();
		logComponent.render({ name, time: profile.time.run });

		return () => {
			logComponent.removal({ name });
		};
	}, []);

	useEffect(() => {
		const profile = profiler.create({ type: 'component', name, context }).start();
		profileRef.current = profile;
		logComponent.change({ name, info: 'update triggered' });

		return () => {
			profile.stop();
			logComponent.change({ name, info: 'updated' });
		};
	});

	return <>{children}</>;
};
