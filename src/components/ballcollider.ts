
import { ObjectComponent } from "./objectcomponent.js";
import { Collider, ColliderDesc } from "@dimforge/rapier2d-compat";
import { Globals } from "../globals.js";
import { RigidBody } from "./rigidbody.js";

export class BallCollider extends ObjectComponent {
  _rapierColliderDesc: ColliderDesc;
  _rapierCollider: Collider;

  radius: number;
  rb: RigidBody;

  constructor() {
    super();
    this.radius = 0.4;
  }
  setRadius(r: number): this {
    this.radius = r;
    return this;
  }
  init() {
    this.rb = this.getComponent(RigidBody);
    if (!this.rb) return;
    this._rapierColliderDesc = ColliderDesc.ball(this.radius);
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
  setTranslationWrtParent(x: number, y: number): this {
    this._rapierCollider.setTranslationWrtParent({x, y});
    return this;
  }
}
