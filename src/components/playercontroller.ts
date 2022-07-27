
import { GameInput } from "@repcomm/gameinput-ts";
import { ObjectComponent } from "./objectcomponent.js";
import { RigidBody } from "./rigidbody.js";
import { Timer } from "../utils/timer.js";
import { Ray } from "../utils/ray.js";

export class PlayerController extends ObjectComponent {
  input: GameInput;
  rb: RigidBody;
  speed: number;
  velocitySpeedCutoff: number;
  jumpMag: number;

  jumpTimer: Timer;
  ray: Ray;
  isOnGround: boolean;
  groundedMaxDistance: number;

  constructor () {
    super();
    this.speed = 1;
    this.velocitySpeedCutoff = 0.5;
    this.jumpMag = -10;
    this.isOnGround = false;
    this.groundedMaxDistance = 0.5;

    this.jumpTimer = new Timer(100);
    this.ray = new Ray();

    this.onUpdate = ()=>{
      let hor = this.input.getAxisValue("hor");
      if (hor < 0.5 && hor > -0.5) {
        hor = -this.rb.velocity.x * 0.5;
      } else {
        if (this.canWalkAccel) {
          console.log("speed accel");
          hor *= this.speed;
        } else {
          console.log("speed max");
          hor = 0;
        }
      }
      this.detectNearGround();
      
      this.rb.applyImpulse({
        x: hor,
        y: this.canJump ? this.jumpMag : 0
      });
    };
  }
  get canWalkAccelLeft (): boolean {
    return (
      this.rb.velocity.x > -this.velocitySpeedCutoff
    );
  }
  get canWalkAccelRight (): boolean {
    return (
      this.rb.velocity.x < this.velocitySpeedCutoff
    );
  }
  get canWalkAccel (): boolean {
    let vx = this.rb.velocity.x;
    return (
      (vx > 0 && this.canWalkAccelRight) ||
      (vx < 0 && this.canWalkAccelLeft)
    );
  }
  detectNearGround () {
    this.ray.setOriginVec2(this.entity.transform.position);
    this.ray.setDir(0, 1);
    let hit = this.rb.raycast(this.ray, this.groundedMaxDistance);
    this.isOnGround = (
      hit &&
      hit.toi < this.groundedMaxDistance
    );
  }
  get canJump (): boolean {
    return (
      this.input.getAxisValue("jump") > 0.5 && 
      this.jumpTimer.effective &&
      this.isOnGround
    );
  }
  onAttach(): void {
    this.input = GameInput.get();
    this.rb = this.getComponent(RigidBody);

    this.input.getOrCreateAxis("hor")
    .addInfluence({
      value: 1,
      keys: ["d"]
    })
    .addInfluence({
      value: -1,
      keys: ["a"]
    });

    this.input.getOrCreateAxis("jump")
    .addInfluence({
      value: 1,
      keys: ["w"]
    });
  }
}
