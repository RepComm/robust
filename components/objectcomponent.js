import { Component } from "../ecs.js";
export class ObjectComponent extends Component {
  get entity() {
    return this._entity;
  }

  constructor() {
    super();
  }

}