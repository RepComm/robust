
import { BallCollider } from "./ballcollider.js";
import { Camera } from "./camera.js";
import { ObjectComponent } from "./objectcomponent.js";
import { PlayerController } from "./playercontroller.js";
import { Renderable } from "./renderable.js";
import { RigidBody } from "./rigidbody.js";

export class Player extends Renderable {
  constructor () {
    super();
  }
  onAttach(): void {
    super.onAttach();
    this.getOrCreateComponent(RigidBody);
    this.getOrCreateComponent(BallCollider);
    this.getOrCreateComponent(Camera);
    this.getOrCreateComponent(PlayerController);
  }
  onRenderSelf(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "black";
    ctx.fillRect(-0.5, -0.5, 1, 1);
  }
}
