import { ObjectComponent } from "./objectcomponent.js";
import { ColliderDesc } from "@dimforge/rapier2d-compat";
import { Globals } from "../globals.js";
import { RigidBody } from "./rigidbody.js";
export class BallCollider extends ObjectComponent {
  constructor() {
    super();
    this.radius = 0.4;
  }

  setRadius(r) {
    this.radius = r;
    return this;
  }

  init() {
    this.rb = this.getComponent(RigidBody);
    if (!this.rb) return;
    this._rapierColliderDesc = ColliderDesc.ball(this.radius);
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

  setTranslationWrtParent(x, y) {
    this._rapierCollider.setTranslationWrtParent({
      x,
      y
    });

    return this;
  }

}