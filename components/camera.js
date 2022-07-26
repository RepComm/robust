import { Globals } from "../globals.js";
import { ObjectComponent } from "./objectcomponent.js";
export class Camera extends ObjectComponent {
  constructor() {
    super();
    this.width = 10;

    this.onUpdate = () => {
      if (Globals.mainCamera === this) {
        Globals.scene.position.copy(this.entity.position).mulScalar(-Globals.scene.scale);
        Globals.scene.position.x += this.width / 2 * Globals.scene.scale;
        Globals.scene.position.y += this.width / 2 * Globals.scene.scale; // Globals.scene.rotation = this.entity.rotation * -1;
      }
    };
  }

  setWidth(w) {
    this.width = w;
    return this;
  }

  onAttach() {
    if (!Globals.mainCamera) this.setAsMainCamera();
  }

  setAsMainCamera() {
    Globals.mainCamera = this;
  }

}