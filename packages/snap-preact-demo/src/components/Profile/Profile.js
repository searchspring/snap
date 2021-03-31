// TODO move to components library

import { h, Component } from 'preact';
export class Profile extends Component {
	logComponent = {
		creation: ({ name }) => {
			this.log.dev(
				`%c +  %c<${name}/>  %c::  %cCREATED`,
				`color: ${this.log.colors.orange}; font-weight: bold; font-size: 14px; line-height: 12px;`,
				`color: ${this.log.colors.orange};`,
				`color: ${this.log.colors.orangedark};`,
				`color: ${this.log.colors.orange}; font-weight: bold;`
			);
		},
		change: ({ name, info = 'changed' }) => {
			this.log.dev(
				`%c ${this.log.emoji.lightning}  %c<${name}/>  %c::  %c${info.toUpperCase()}`,
				`color: ${this.log.colors.orange}; font-weight: bold; font-size: 14px; line-height: 12px;`,
				`color: ${this.log.colors.orange};`,
				`color: ${this.log.colors.orangedark};`,
				`color: ${this.log.colors.orangedark}; font-weight: bold;`
			);
		},
		error: ({ name, error = 'component crash' }) => {
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
		render: ({ name, time }) => {
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
		removal: ({ name }) => {
			this.log.dev(
				`%c -  %c<${name}/>  %c::  %cREMOVED`,
				`color: ${this.log.colors.orange}; font-weight: bold; font-size: 14px; line-height: 12px;`,
				`color: ${this.log.colors.orange};`,
				`color: ${this.log.colors.orangedark};`,
				`color: ${this.log.colors.reddark}; font-weight: bold;`
			);
		},
	};

	constructor(props) {
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
	}

	componentDidMount() {
		this.profile.stop();
		this.logComponent.render({ name: this.name, time: this.profile.time.run });
	}

	componentDidUpdate() {
		this.profile.stop();

		this.logComponent.change({ name: this.name, info: 'updated' });
	}

	componentDidCatch(error) {
		this.logComponent.error({ name: this.name, error });
	}

	createProfile() {
		return this.profiler.create({ type: 'component', name: this.name, context: this.context }).start();
	}

	render() {
		return this.props.children;
	}
}
