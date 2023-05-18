/* eslint-disable*/

export class Name {
    
	private readonly name;

	constructor(name: string) {
		if (!name) {
			throw new Error("Not valid name");
		}
        this.name = name
	}
}
