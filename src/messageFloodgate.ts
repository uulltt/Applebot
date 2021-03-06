// TODO: higher resolution timers

export default class MessageFloodgate {

	// seconds
	private _delay: number;
	private _last = 0;

	constructor(delay: number) {
		this._delay = delay;
	}

	createResponder(responder: (content: string) => Promise<void>): (content: string, bypass: boolean) => Promise<void> {
		return async (content, bypass) => {
			await this.post(() => responder(content), bypass);
		};
	}

	async post(task: () => Promise<void>, bypass = false): Promise<void> {
		const now = process.hrtime()[0];
		if (bypass || now - this._last > this._delay) {
			this._last = now;
			await task();
		}
	}

}