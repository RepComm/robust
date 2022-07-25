import { Globals } from "../globals.js";
import { ObjectComponent } from "./objectcomponent.js";
export class Camera extends ObjectComponent {
  constructor() {
    super();

    this.onUpdate = () => {
      if (Globals.mainCamera === this) {
        Globals.scene.position.copy(this.entity.position).mulScalar(-Globals.scene.scale); // Globals.scene.rotation = this.entity.rotation * -1;
      }
    };
  }

  onAttach() {
    if (!Globals.mainCamera) this.setAsMainCamera();
  }

  setAsMainCamera() {
    Globals.mainCamera = this;
  }

}