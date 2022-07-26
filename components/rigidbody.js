import { ObjectComponent } from "./objectcomponent.js";
import { RigidBodyDesc, RigidBodyType } from "@dimforge/rapier2d-compat";
import { Globals } from "../globals.js";
import { RAD2DEG } from "@repcomm/scenario2d";
export class RigidBody extends ObjectComponent {
  constructor() {
    super();
    this.type = RigidBodyType.Dynamic;
    this.canSleep = true;
    this.ccd = false;
    this.additionalMass = 1;

    this.onUpdate = () => {
      let {
        x,
        y
      } = this._rapierRigidBody.translation();

      this.entity.position.set(x, y);
      this.entity.rotation = this._rapierRigidBody.rotation() * RAD2DEG;
    };
  }

  setTranslation(x, y) {
    this._rapierRigidBody.setTranslation({
      x,
      y
    }, true);

    return this;
  }

  setAdditionalMass(m) {
    this.additionalMass = m;
    return this;
  }

  setCcd(ccd) {
    this.ccd = ccd;
    return this;
  }

  setCanSleep(s) {
    this.canSleep = s;
    return this;
  }

  setType(t) {
    this.type = t;
    return this;
  }

  setLockRotations(locked) {
    this._rapierRigidBody.lockRotations(locked, true);

    return this;
  }

  setLockTranslations(locked) {
    this._rapierRigidBody.lockTranslations(locked, true);

    return this;
  }

  init() {
    this.deinit();
    this._rapierRigidBodyDesc = new RigidBodyDesc(this.type).setTranslation(this.entity.position.x, this.entity.position.y).setRotation(this.entity.rotation).setCanSleep(this.canSleep).setCcdEnabled(this.ccd).setAdditionalMass(this.additionalMass);
    this._rapierRigidBody = Globals.rapierWorld.createRigidBody(this._rapierRigidBodyDesc);
  }

  deinit() {
    if (this._rapierRigidBody) Globals.rapierWorld.removeRigidBody(this._rapierRigidBody);
  }

  onAttach() {
    this.init();
  }

  onReactivate() {
    this.init();
  }

  onDeactivate() {
    this.deinit();
  }

  onDetach() {
    this.deinit();
  }

  resetForces(wake = true) {
    this._rapierRigidBody.resetForces(wake);

    return this;
  }

  resetTorques(wake = true) {
    this._rapierRigidBody.resetTorques(wake);

    return this;
  }

  addForce(f, wake = true) {
    this._rapierRigidBody.addForce(f, wake);

    return this;
  }

  addTorque(t, wake = true) {
    this._rapierRigidBody.addTorque(t, wake);

    return this;
  }

  addForceAtPoint(f, p, wake = true) {
    this._rapierRigidBody.addForceAtPoint(f, p, wake);

    return this;
  }

  applyImpulse(f, wake = true) {
    this._rapierRigidBody.applyImpulse(f, wake);

    return this;
  }

  applyTorqueImpulse(t, wake = true) {
    this._rapierRigidBody.applyTorqueImpulse(t, wake);

    return this;
  }

  applyImpulseAtPoint(f, p, wake = true) {
    this._rapierRigidBody.applyImpulseAtPoint(f, p, wake);

    return this;
  }

}