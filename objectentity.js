import { Object2D } from "@repcomm/scenario2d";
import { Entity } from "./ecs.js";
export const ESC_NAMESPACE = "__ESC__";
export function resolveObject2DEntity(o) {
  return o[ESC_NAMESPACE] || null;
}
export function linkObject2DEntity(o, e) {
  o[ESC_NAMESPACE] = e;
}
export class ObjectEntity extends Entity {
  constructor(label) {
    super(label);
    this.object = new Object2D();
    linkObject2DEntity(this.object, this);
  }

  get parent() {
    return resolveObject2DEntity(this.object.parent);
  }

  get children() {
    if (!this.object.hasChildren()) return null;
    let result = new Array();
    let childEsc;

    for (let child of this.object.children) {
      childEsc = resolveObject2DEntity(child);
      if (childEsc !== null) result.push(childEsc);
    }

    return result || null;
  }

  get transform() {
    return this.object.localTransform;
  }

  get globalTransform() {
    return this.object.globalTransform;
  }

  get position() {
    return this.transform.position;
  }

  get rotation() {
    return this.transform.rotation;
  }

  set rotation(r) {
    this.transform.rotation = r;
  }

  get scale() {
    return this.transform.scale;
  }

  set scale(s) {
    this.transform.scale = s;
  }

  add(o) {
    this.object.add(o.object);
    return this;
  }

  remove(o) {
    this.object.remove(o.object);
    return this;
  }

  onUpdate() {
    super.onUpdate();
    if (!this.object || !this.object.hasChildren()) return;
    let oe;

    for (let child of this.object.children) {
      oe = child[ESC_NAMESPACE];

      if (oe) {
        oe.onUpdate();
      }
    }
  }

}