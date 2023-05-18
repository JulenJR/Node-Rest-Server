/* eslint-disable*/

import { User } from "../../domain/entities/User";
import { Name } from "../../domain/value-objects/Name";
import { Age } from "../../domain/value-objects/Age";
import { Url } from "../../domain/value-objects/Url";

type UserRequest = {
    name: string;
    age: number;
    url: string;
}

export class UserCreator {
    constructor() {}

    run(data: UserRequest): User {

        const { name, age, url } = data;

        const user = new User(new Name(name), new Age(age), new Url(url))
 
        return user
    }
}