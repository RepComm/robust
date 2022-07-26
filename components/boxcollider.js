import { ObjectComponent } from "./objectcomponent.js";
import { ColliderDesc } from "@dimforge/rapier2d-compat";
import { Globals } from "../globals.js";
import { RigidBody } from "./rigidbody.js";
import { Vec2 } from "@repcomm/scenario2d";
export class BoxCollider extends ObjectComponent {
  constructor() {
    super();
    this.size = new Vec2();
  }

  setSize(x, y) {
    this.size.set(x, y);
    return this;
  }

  init() {
    this.rb = this.getComponent(RigidBody);
    if (!this.rb) return;
    this._rapierColliderDesc = ColliderDesc.cuboid(this.size.x, this.size.y);
    this._rapierCollider = Globals.rapierWorld.createCollider(this._rapierColliderDesc, this.rb._rapierRigidBody);
  }

  deinit() {
    if (!this._rapierCollider) return;
    Globals.rapierWorld.removeCollider(this._rapierCollider, true);
  }

  onAttach() {
    this.init();
  }

  onDetach() {
    this.deinit();
  }

  onReactivate() {
    this.init();
  }

  onDeactivate() {
    this.deinit();
  }

}