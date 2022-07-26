
import { ObjectComponent } from "./objectcomponent.js";
import { Collider, ColliderDesc } from "@dimforge/rapier2d-compat";
import { Globals } from "../globals.js";
import { RigidBody } from "./rigidbody.js";

export class MeshCollider extends ObjectComponent {
  _rapierColliderDesc: ColliderDesc;
  _rapierCollider: Collider;

  rb: RigidBody;
  vertices: Float32Array;
  indices: Uint32Array;

  constructor() {
    super();
  }
  setTrimesh (vs: Float32Array, inds?: Uint32Array): this {
    this.vertices = vs;
    this.indices = inds;
    //try init
    if (!this._rapierCollider) this.init();
    return this;
  }
  init() {
    this.rb = this.getComponent(RigidBody);
    if (!this.rb || !this.vertices) return;
    this._rapierColliderDesc = ColliderDesc.polyline(this.vertices, this.indices)
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
