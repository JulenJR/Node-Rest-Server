/* eslint-disable*/

export class Age {
    
	private readonly age;

	constructor(age: number) {
		if (age < 0 || age > 150) {
			throw new Error("Not valid age");
		}
        this.age = age

	}

}