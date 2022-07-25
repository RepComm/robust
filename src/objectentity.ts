import { Object2D, Transform2d, Vec2 } from "@repcomm/scenario2d";
import { Entity } from "./ecs.js";

export const ESC_NAMESPACE = "__ESC__";

export function resolveObject2DEntity (o: Object2D): ObjectEntity|null {
  return o[ESC_NAMESPACE] || null;
}
export function linkObject2DEntity (o: Object2D, e: ObjectEntity) {
  o[ESC_NAMESPACE] = e;
}

export class ObjectEntity extends Entity {
  object: Object2D;

  constructor (label?: string) {
    super(label);
    this.object = new Object2D();
    linkObject2DEntity(this.object, this);
  }
  get parent(): ObjectEntity|null {
    return resolveObject2DEntity(this.object.parent);
  }
  get children (): Array<ObjectEntity>|null {
    if (!this.object.hasChildren()) return null;

    let result = new Array<ObjectEntity>();

    let childEsc: ObjectEntity;

    for (let child of this.object.children) {
      childEsc = resolveObject2DEntity(child);
      if (childEsc !== null) result.push(childEsc);
    }

    return result || null;
  }
  get transform (): Transform2d {
    return this.object.localTransform;
  }
  get globalTransform (): Transform2d {
    return this.object.globalTransform;
  }
  get position (): Vec2 {
    return this.transform.position;
  }
  get rotation (): number {
    return this.transform.rotation;
  }
  set rotation (r: number) {
    this.transform.rotation = r;
  }
  get scale (): number {
    return this.transform.scale;
  }
  set scale (s: number) {
    this.transform.scale = s;
  }
  add (o: ObjectEntity): this {
    this.object.add(o.object);
    return this;
  }
  remove (o: ObjectEntity): this {
    this.object.remove(o.object);
    return this;
  }
  onUpdate(): void {
    super.onUpdate();
    if (!this.object || !this.object.hasChildren()) return;
    let oe: ObjectEntity;

    for (let child of this.object.children) {
      oe = child[ESC_NAMESPACE];
      if (oe) {
        oe.onUpdate();
      }
    }
  }
}
