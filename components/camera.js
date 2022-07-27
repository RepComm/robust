import { Globals } from "../globals.js";
import { ObjectComponent } from "./objectcomponent.js";
export class Camera extends ObjectComponent {
  constructor() {
    super();
    this.width = 10;

    this.onUpdate = () => {
      if (Globals.mainCamera === this) {}
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