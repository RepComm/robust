
import { RigidBodyDesc, RigidBody as RapierRigidBody, RigidBodyType, Vector, RayColliderIntersection } from "@dimforge/rapier2d-compat";
import { Globals } from "../globals.js";
import { RAD2DEG, Vec2 } from "@repcomm/scenario2d";

import { ObjectComponent } from "./objectcomponent.js";

import { Ray } from "../utils/ray.js";

export class RigidBody extends ObjectComponent {
  _rapierRigidBodyDesc: RigidBodyDesc;
  _rapierRigidBody: RapierRigidBody;
  type: RigidBodyType;
  canSleep: boolean;
  ccd: boolean;
  additionalMass: number;

  velocity: Vec2;

  private getVelocity (v: Vec2): this {
    let vel = this._rapierRigidBody.linvel();
    v.set(vel.x, vel.y);
    return this;
  }

  constructor () {
    super();
    this.type = RigidBodyType.Dynamic;
    this.canSleep = true;
    this.ccd = false;
    this.additionalMass = 1;
    this.velocity = new Vec2();

    this.onUpdate = ()=>{
      this.getVelocity( this.velocity );
      let { x, y } = this._rapierRigidBody.translation();
      this.entity.position.set(x, y);
      this.entity.rotation = this._rapierRigidBody.rotation() * RAD2DEG;
    };
  }
  setTranslation (x: number, y: number): this {
    this._rapierRigidBody.setTranslation({x, y}, true);
    return this;
  }
  setAdditionalMass (m: number): this {
    this.additionalMass = m;
    return this;
  }
  setCcd (ccd: boolean): this {
    this.ccd = ccd;
    return this;
  }
  setCanSleep (s: boolean): this {
    this.canSleep = s;
    return this;
  }
  setType (t: RigidBodyType): this {
    this.type = t;
    return this;
  }
  setLockRotations (locked: boolean): this {
    this._rapierRigidBody.lockRotations(locked, true);
    return this;
  }
  setLockTranslations (locked: boolean): this {
    this._rapierRigidBody.lockTranslations(locked, true);
    return this;
  }
  init () {
    this.deinit();

    this._rapierRigidBodyDesc = new RigidBodyDesc(this.type)
    .setTranslation(
      this.entity.position.x,
      this.entity.position.y
    )
    .setRotation(this.entity.rotation)
    .setCanSleep(this.canSleep)
    .setCcdEnabled(this.ccd)
    .setAdditionalMass(this.additionalMass);
  
    this._rapierRigidBody = Globals.rapierWorld.createRigidBody(this._rapierRigidBodyDesc);  
  }
  deinit () {
    if (this._rapierRigidBody) Globals.rapierWorld.removeRigidBody(this._rapierRigidBody);
  }
  onAttach(): void {
    this.init();
  }
  onReactivate(): void {
    this.init();
  }
  onDeactivate(): void {
    this.deinit();
  }
  onDetach(): void {
    this.deinit();
  }
  resetForces(wake: boolean = true): this {
    this._rapierRigidBody.resetForces(wake);
    return this;
  }
  resetTorques(wake: boolean = true): this {
    this._rapierRigidBody.resetTorques(wake);
    return this;
  }
  addForce(f: Vector, wake: boolean = true): this {
    this._rapierRigidBody.addForce(f, wake);
    return this;
  }
  addTorque(t: number, wake: boolean = true): this {
    this._rapierRigidBody.addTorque(t, wake);
    return this;
  }
  addForceAtPoint(f: Vector, p: Vector, wake: boolean = true): this {
    this._rapierRigidBody.addForceAtPoint(f, p, wake);
    return this;
  }

  applyImpulse(f: Vector, wake: boolean = true): this {
    this._rapierRigidBody.applyImpulse(f, wake);
    return this;
  }
  applyTorqueImpulse(t: number, wake: boolean = true): this {
    this._rapierRigidBody.applyTorqueImpulse(t, wake);
    return this;
  }
  applyImpulseAtPoint(f: Vector, p: Vector, wake: boolean = true): this {
    this._rapierRigidBody.applyImpulseAtPoint(f, p, wake);
    return this;
  }
  raycast (r: Ray, maxToi: number): RayColliderIntersection {
    return Globals.rapierWorld.castRayAndGetNormal(
      r._rapierRay,
      maxToi,
      false,
      undefined, undefined, undefined,
      this._rapierRigidBody
    );
  }
}
