/* eslint-disable*/
import { Url } from "../value-objects/Url";
import { Name } from "../value-objects/Name";
import { Age } from "../value-objects/Age";
export class User{
    private name: Name
    private age: Age
    private url: Url
    constructor(name: Name, age: Age, url: Url) {
        this.name = name;
        this.age = age;
        this.url = url;
    }
}