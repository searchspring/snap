// TODO move to components library
import { h, Component } from 'preact';

type ProfileProps = {
	name: string;
	controller: SearchController;
	context?: any;
};

export class Profile extends Component<ProfileProps> {
	name;
	controller;
	log;
	profiler;
	profile;

	logComponent = {
		creation: ({ name }: { name: string }) => {
			this.log.dev(
				`%c +  %c<${name}/>  %c::  %cCREATED`,
				`color: ${this.log.colors.orange}; font-weight: bold; font-size: 14px; line-height: 12px;`,
				`color: ${this.log.colors.orange};`,
				`color: ${this.log.colors.orangedark};`,
				`color: ${this.log.colors.orange}; font-weight: bold;`
			);
		},
		change: ({ name, info = 'changed' }: { name: string; info: string }) => {
			this.log.dev(
				`%c ${this.log.emoji.lightning}  %c<${name}/>  %c::  %c${info.toUpperCase()}`,
				`color: ${this.log.colors.orange}; font-weight: bold; font-size: 14px; line-height: 12px;`,
				`color: ${this.log.colors.orange};`,
				`color: ${this.log.colors.orangedark};`,
				`color: ${this.log.colors.orangedark}; font-weight: bold;`
			);
		},
		error: ({ name, error = 'component crash' }: { name: string; error: string }) => {
			this.log.dev(
				`%c ${this.log.emoji.bang}  %c<${name}/>  %c::  %cERROR  %c::  %c${error}`,
				`color: ${this.log.colors.red}`,
				`color: ${this.log.colors.red};`,
				`color: ${this.log.colors.orangedark};`,
				`color: ${this.log.colors.red}; font-weight: bold;`,
				`color: ${this.log.colors.orangedark};`,
				`color: ${this.log.colors.redlight};`
			);
		},
		render: ({ name, time }: { name: string; time: number }) => {
			this.log.dev(
				`%c ${this.log.emoji.magic}  %c<${name}/>  %c::  %cRENDERED  %c::  %c${time}ms`,
				`color: ${this.log.colors.orange};`,
				`color: ${this.log.colors.orange};`,
				`color: ${this.log.colors.orangedark};`,
				`color: ${this.log.colors.orangedark}; font-weight: bold;`,
				`color: ${this.log.colors.orangedark};`,
				`color: ${this.log.colors.grey};`
			);
		},
		removal: ({ name }: { name: string }) => {
			this.log.dev(
				`%c -  %c<${name}/>  %c::  %cREMOVED`,
				`color: ${this.log.colors.orange}; font-weight: bold; font-size: 14px; line-height: 12px;`,
				`color: ${this.log.colors.orange};`,
				`color: ${this.log.colors.orangedark};`,
				`color: ${this.log.colors.reddark}; font-weight: bold;`
			);
		},
	};

	constructor(props: ProfileProps) {
		super(props);

		this.name = props.name;
		this.controller = props.controller;
		this.log = this.controller.log;
		this.profiler = this.controller.profiler;
		this.context = props.context;
		this.profile = this.createProfile();
	}

	shouldComponentUpdate() {
		this.profile = this.createProfile();
		this.logComponent.change({ name: this.name, info: 'update triggered' });
		return true;
	}

	componentDidMount() {
		this.profile.stop();
		this.logComponent.render({ name: this.name, time: this.profile.time.run });
	}

	componentDidUpdate() {
		this.profile.stop();

		this.logComponent.change({ name: this.name, info: 'updated' });
	}

	componentDidCatch(error: string) {
		this.logComponent.error({ name: this.name, error });
	}

	createProfile() {
		return this.profiler.create({ type: 'component', name: this.name, context: this.context }).start();
	}

	render() {
		return this.props.children;
	}
}
