import { ObjectComponent } from "./objectcomponent.js";
import { ColliderDesc } from "@dimforge/rapier2d-compat";
import { Globals } from "../globals.js";
import { RigidBody } from "./rigidbody.js";
export class MeshCollider extends ObjectComponent {
  constructor() {
    super();
  }

  setTrimesh(vs, inds) {
    this.vertices = vs;
    this.indices = inds; //try init

    if (!this._rapierCollider) this.init();
    return this;
  }

  init() {
    this.rb = this.getComponent(RigidBody);
    if (!this.rb || !this.vertices) return;
    this._rapierColliderDesc = ColliderDesc.polyline(this.vertices, this.indices);
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