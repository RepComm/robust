
import{ Ray as RapierRay, Vector, Vector2 }from "@dimforge/rapier2d-compat";
import type { Vec2 } from "@repcomm/scenario2d";
import { Globals } from "../globals";

export class Ray {
  _rapierRay: RapierRay;
  private _rapierOrigin: Vector;
  private _rapierDir: Vector;

  constructor () {
    this._rapierOrigin = new Vector2(0, 0);
    this._rapierDir = new Vector2(0,-1);
    this._rapierRay = new RapierRay(this._rapierOrigin, this._rapierDir);
  }
  setOriginVec2 (v: Vec2): this {
    this._rapierRay.origin.x = v.x;
    this._rapierRay.origin.y = v.y;
    return this;
  }
  setOrigin (x: number, y: number): this {
    this._rapierRay.origin.x = x;
    this._rapierRay.origin.y = y;
    return this;
  }
  setDir (x: number, y: number): this {
    this._rapierRay.dir.x = x;
    this._rapierRay.dir.y = y;
    return this;
  }
  setDirVec2 (d: Vec2): this {
    this._rapierRay.dir.x = d.x;
    this._rapierRay.dir.y = d.y;
    return this;
  }
}
