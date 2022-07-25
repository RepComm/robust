import { Component, Entity } from "../ecs.js";
import { ObjectEntity } from "../objectentity.js";

export class ObjectComponent extends Component {
  protected _entity: ObjectEntity;
  get entity(): ObjectEntity {
    return this._entity;
  }
  constructor () {
    super();
  }
}
