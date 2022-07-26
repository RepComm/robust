import { Vec2 } from "@repcomm/scenario2d";
/**Bounding box 2d
 * 
 */

export class Box {
  constructor() {
    this.position = new Vec2();
    this.size = new Vec2();
  } //TODO - doesn't work for non-halfExtents


  static extend(aabb, left, right, up, down) {
    if (left !== 0) {
      aabb.size.x += left / 2;
      aabb.position.x -= left / 2;
    }

    if (right !== 0) {
      aabb.size.x += right / 2;
      aabb.position.x += right / 2;
    }

    if (up !== 0) {
      aabb.size.y += up / 2;
      aabb.position.y -= up / 2;
    }

    if (down !== 0) {
      aabb.size.y += down / 2;
      aabb.position.y += down / 2;
    }
  }

}
export class BoxList {
  constructor() {
    this.inactiveBoxes = new Set();
    this.boxes = new Set();
    this.offset = new Vec2();
  }
  /**Get a box from the inactive set (recycled boxes)*/


  getInactiveBox() {
    let result = undefined;

    for (let box of this.inactiveBoxes) {
      result = box;
      break;
    }

    return result;
  }
  /**Instantiate a box*/


  createBox() {
    return new Box();
  }
  /**Get or create a box*/


  acquireBox() {
    let result = this.getInactiveBox();
    if (!result) result = this.createBox();
    return result;
  }
  /**Sets a box to be activated (responsible for collision)*/


  setBoxActivated(box, activate = true) {
    if (activate) {
      this.inactiveBoxes.delete(box);
      this.boxes.add(box);
    } else {
      this.boxes.delete(box);
      this.inactiveBoxes.add(box);
    }

    return this;
  }
  /**Make a collision at a specific aabb*/


  boxAt(x, y, w, h) {
    let result = this.acquireBox();
    result.position.set(x, y);
    result.size.set(w, h);
    this.setBoxActivated(result);
    return result;
  }
  /**Recycle all collision*/


  clear() {
    for (let box of this.boxes) {
      this.setBoxActivated(box, false);
    }

    return this;
  }
  /**Get active box count*/


  getBoxCount() {
    return this.boxes.size;
  }

}