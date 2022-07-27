import { Globals } from "../globals.js";
import { ObjectComponent } from "./objectcomponent.js";
export class Camera extends ObjectComponent {
  constructor() {
    super();
    this.orthographicSize = 10;

    this.onUpdate = () => {
      if (Globals.mainCamera === this) {}
    };
  }

  setOrthographicSize(w) {
    this.orthographicSize = w;
    return this;
  }

  onAttach() {
    if (!Globals.mainCamera) this.setAsMainCamera();
  }

  setAsMainCamera() {
    Globals.mainCamera = this;
  }

}