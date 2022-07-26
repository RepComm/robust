
import { Vec2 } from "@repcomm/scenario2d";

/**Bounding box 2d
 * 
 */
export class Box {
  position: Vec2;
  size: Vec2;

  constructor() {
    this.position = new Vec2();
    this.size = new Vec2();
  }
  
  //TODO - doesn't work for non-halfExtents
  static extend(aabb: Box, left: number, right: number, up: number, down: number) {
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
  offset: Vec2;
  private inactiveBoxes: Set<Box>;
  boxes: Set<Box>;

  constructor () {
    this.inactiveBoxes = new Set();
    this.boxes = new Set();
    this.offset = new Vec2();
  }

  /**Get a box from the inactive set (recycled boxes)*/
  getInactiveBox (): Box {
    let result = undefined;
    for (let box of this.inactiveBoxes) {
      result = box;
      break;
    }
    return result;
  }
  /**Instantiate a box*/
  createBox (): Box {
    return new Box();
  }
  /**Get or create a box*/
  acquireBox (): Box {
    let result = this.getInactiveBox();
    if (!result) result = this.createBox();
    return result;
  }
  /**Sets a box to be activated (responsible for collision)*/
  setBoxActivated (box: Box, activate: boolean = true): this {
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
  boxAt (x: number, y: number, w: number, h: number): Box {
    let result = this.acquireBox();
    result.position.set(x, y);

    result.size.set(w, h);
    this.setBoxActivated(result);
    return result;
  }
  /**Recycle all collision*/
  clear (): this {
    for (let box of this.boxes) {
      this.setBoxActivated(box, false);
    }
    return this;
  }
  /**Get active box count*/
  getBoxCount (): number {
    return this.boxes.size;
  }
}
