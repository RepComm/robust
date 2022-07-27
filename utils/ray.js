import { Ray as RapierRay, Vector2 } from "@dimforge/rapier2d-compat";
export class Ray {
  constructor() {
    this._rapierOrigin = new Vector2(0, 0);
    this._rapierDir = new Vector2(0, -1);
    this._rapierRay = new RapierRay(this._rapierOrigin, this._rapierDir);
  }

  setOriginVec2(v) {
    this._rapierRay.origin.x = v.x;
    this._rapierRay.origin.y = v.y;
    return this;
  }

  setOrigin(x, y) {
    this._rapierRay.origin.x = x;
    this._rapierRay.origin.y = y;
    return this;
  }

  setDir(x, y) {
    this._rapierRay.dir.x = x;
    this._rapierRay.dir.y = y;
    return this;
  }

  setDirVec2(d) {
    this._rapierRay.dir.x = d.x;
    this._rapierRay.dir.y = d.y;
    return this;
  }

}