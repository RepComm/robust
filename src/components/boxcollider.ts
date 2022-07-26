
import { ObjectComponent } from "./objectcomponent.js";
import { Collider, ColliderDesc } from "@dimforge/rapier2d-compat";
import { Globals } from "../globals.js";
import { RigidBody } from "./rigidbody.js";
import { Vec2 } from "@repcomm/scenario2d";

export class BoxCollider extends ObjectComponent {
  _rapierColliderDesc: ColliderDesc;
  _rapierCollider: Collider;

  size: Vec2;
  rb: RigidBody;

  constructor() {
    super();
    this.size = new Vec2();
  }
  setSize(x: number, y: number): this {
    this.size.set(x, y);
    return this;
  }
  init() {
    this.rb = this.getComponent(RigidBody);
    if (!this.rb) return;
    this._rapierColliderDesc = ColliderDesc.cuboid(this.size.x, this.size.y)
    this._rapierCollider = Globals.rapierWorld.createCollider(
      this._rapierColliderDesc,
      this.rb._rapierRigidBody
    );
  }
  deinit() {
    if (!this._rapierCollider) return;
    Globals.rapierWorld.removeCollider(this._rapierCollider, true);
  }
  onAttach(): void {
    this.init();
  }
  onDetach(): void {
    this.deinit();
  }
  onReactivate(): void {
    this.init();
  }
  onDeactivate(): void {
    this.deinit();
  }
}
