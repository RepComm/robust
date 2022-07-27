import { GameInput } from "@repcomm/gameinput-ts";
import { ObjectComponent } from "./objectcomponent.js";
import { RigidBody } from "./rigidbody.js";
import { Timer } from "../utils/timer.js";
import { Ray } from "../utils/ray.js";
export class PlayerController extends ObjectComponent {
  constructor() {
    super();
    this.speed = 0.1;
    this.jumpMag = -10;
    this.isOnGround = false;
    this.groundedMaxDistance = 0.5;
    this.jumpTimer = new Timer(100);
    this.ray = new Ray();

    this.onUpdate = () => {
      let hor = this.input.getAxisValue("hor") * this.speed;
      this.detectNearGround();
      this.rb.applyImpulse({
        x: hor,
        y: this.canJump ? this.jumpMag : 0
      });
    };
  }

  detectNearGround() {
    this.ray.setOriginVec2(this.entity.transform.position);
    this.ray.setDir(0, 1);
    let hit = this.rb.raycast(this.ray, this.groundedMaxDistance);
    this.isOnGround = hit && hit.toi < this.groundedMaxDistance;
  }

  get canJump() {
    return this.input.getAxisValue("jump") > 0.5 && this.jumpTimer.effective && this.isOnGround;
  }

  onAttach() {
    this.input = GameInput.get();
    this.rb = this.getComponent(RigidBody);
    this.input.getOrCreateAxis("hor").addInfluence({
      value: 1,
      keys: ["d"]
    }).addInfluence({
      value: -1,
      keys: ["a"]
    });
    this.input.getOrCreateAxis("jump").addInfluence({
      value: 1,
      keys: ["w"]
    });
  }

}