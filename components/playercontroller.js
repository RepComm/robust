import { GameInput } from "@repcomm/gameinput-ts";
import { ObjectComponent } from "./objectcomponent.js";
import { RigidBody } from "./rigidbody.js";
export class PlayerController extends ObjectComponent {
  constructor() {
    super();
    this.speed = 0.1;
    this.jumpMag = -1;

    this.onUpdate = () => {
      let hor = this.input.getAxisValue("hor") * this.speed;
      let jump = this.input.getAxisValue("jump") * this.jumpMag;
      this.rb.applyImpulse({
        x: hor,
        y: jump
      });
    };
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