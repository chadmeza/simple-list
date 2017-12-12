import {Item} from "./item";
export class User {
  public uid: string;
  public items: Item[] = [];

  constructor(public name: string,
              public email: string,
              public image: string) {}
}
