import { AppMode } from '@searchspring/snap-toolbox';
import { colors } from './colors';
import { emoji } from './emoji';

export type LoggerConfig = {
	prefix?: string;
	mode?: keyof typeof AppMode | AppMode;
};

export class Logger {
	private mode = AppMode.production;
	public emoji = emoji;
	public colors = colors;
	private prefix = '';

	constructor(config?: LoggerConfig) {
		this.prefix = config?.prefix || '';
		this.mode = (config?.mode || AppMode.production) as AppMode;
	}

	public setNamespace(group: string): void {
		this.prefix = ` [${group}] :: `;
	}

	public error(...params: any[]): void {
		let text = '';
		let rest = params;
		if (params.length && typeof params[0] == 'string') {
			[text, ...rest] = params;
		}

		console.log(
			`%c ${emoji.bang} %c${this.prefix}${text}`,
			`color: ${colors.red}; font-weight: bold; font-size: 14px; line-height: 12px;`,
			`color: ${colors.red}; font-weight: bold;`,
			...rest
		);
	}

	public warn(...params: any[]): void {
		let text = '';
		let rest = params;
		if (params.length && typeof params[0] == 'string') {
			[text, ...rest] = params;
		}

		console.log(
			`%c ${emoji.warning} %c${this.prefix}%c${text}`,
			`color: ${colors.yellow}; font-weight: bold; font-size: 14px; line-height: 12px;`,
			`color: ${colors.yellow}; font-weight: normal;`,
			`color: ${colors.yellow}; font-weight: bold;`,
			...rest
		);
	}

	public image({ url, width, height }: { url: string; width: number | string; height: number | string }, ...params: any[]): void {
		const styles = {
			size: `font-size: 1px; padding: ${height || width} ${width || height};`,
			background: `background: url("${url}") no-repeat; background-size: contain;`,
		};

		this.dev(`%c...`, `${styles.size} ${styles.background}`, ...params);
	}

	public imageText({ url, text = '', style }: { url: string; text: string; style: string }, ...params: any[]): void {
		const styles = {
			background: `margin-left: 6px; background: url("${url}") no-repeat; background-size: contain;`,
			custom: style,
		};

		let imgText = text;
		let rest = params;
		if (!imgText && params?.length) {
			[imgText, ...rest] = params;
		}

		this.dev(`%c ${'  ' + this.prefix}${imgText}`, `${styles.background} ${styles.custom}`, ...rest);
	}

	public debug(...params: any[]): void {
		let text = '';
		let rest = params;
		if (params.length && typeof params[0] == 'string') {
			[text, ...rest] = params;
		}

		this.dev(
			`%c ${emoji.interobang} %c${this.prefix}${text}`,
			`color: ${colors.orangelight}; font-weight: bold; font-size: 14px; line-height: 12px;`,
			`color: ${colors.orangelight}; font-weight: bold;`,
			...rest
		);
	}

	public profile(profile: any, ...params: any[]): void {
		this.dev(
			`%c ${emoji.gear} %c${this.prefix}%c${profile.type}  %c~  ${profile.name}  ::  %c${profile.status.toUpperCase()}${
				profile.status == 'finished' ? '  ::  %c' + profile.time.run + 'ms' : ''
			}`,
			`color: ${colors.orange}; font-size: 14px; line-height: 12px;`,
			`color: ${colors.orange};`,
			`color: ${colors.orange}; font-style: italic;`,
			`color: ${colors.orange};`,
			`color: ${colors.orange}; font-weight: bold;`,
			`color: ${colors.grey};`,
			...params
		);
	}

	public dev(...params: any[]): void {
		if (this.mode === AppMode.development) {
			console.log(...params);
		}
	}
}
