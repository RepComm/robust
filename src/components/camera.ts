
import { Globals } from "../globals.js";
import { ObjectComponent } from "./objectcomponent.js";

export class Camera extends ObjectComponent {
  orthographicSize: number;

  constructor() {
    super();
    this.orthographicSize = 10;

    this.onUpdate = () => {
      if (Globals.mainCamera === this) {
      }
    };
  }
  setOrthographicSize (w: number): this {
    this.orthographicSize = w;
    return this;
  }
  onAttach(): void {
    if (!Globals.mainCamera) this.setAsMainCamera();
  }
  setAsMainCamera() {
    Globals.mainCamera = this;
  }
}
