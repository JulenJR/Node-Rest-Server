/* eslint-disable*/

export class Url {

	private readonly url;

	constructor(url: string) {
		if (url.length === 0) {
			throw new Error("Not valid url");
		}
        this.url = url
	}
}
