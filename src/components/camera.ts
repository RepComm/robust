
import { Globals } from "../globals.js";
import { ObjectComponent } from "./objectcomponent.js";

export class Camera extends ObjectComponent {
  width: number;

  constructor() {
    super();
    this.width = 10;

    this.onUpdate = () => {

      if (Globals.mainCamera === this) {
      }
    };
  }
  setWidth (w: number): this {
    this.width = w;
    return this;
  }
  onAttach(): void {
    if (!Globals.mainCamera) this.setAsMainCamera();
  }
  setAsMainCamera() {
    Globals.mainCamera = this;
  }
}
