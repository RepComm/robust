import { Globals } from "../globals.js";
import { ObjectComponent } from "./objectcomponent.js";
export class Camera extends ObjectComponent {
  constructor() {
    super();
    this.orthographicSize = 10;

    this.onUpdate = () => {
<<<<<<< HEAD
      if (Globals.mainCamera === this) {}
=======
      if (Globals.mainCamera === this) {
        Globals.scene.position.copy(this.entity.position).mulScalar(-Globals.scene.scale);
        let aspect = Globals.canvas.width / Globals.canvas.height;
        let x = this.orthographicSize / 2 * Globals.scene.scale;
        let y = this.orthographicSize / 2 * Globals.scene.scale / aspect;
        Globals.scene.position.x += x;
        Globals.scene.position.y += y; // Globals.scene.rotation = this.entity.rotation * -1;
      }
>>>>>>> b4b27666f590a93e49843abb5c777373f74215e1
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