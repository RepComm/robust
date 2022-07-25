import { Object2D } from "@repcomm/scenario2d";
import { ObjectComponent } from "./objectcomponent.js";
export class Renderable extends ObjectComponent {
  constructor() {
    super();
    this._renderableObject = new Object2D();

    this._renderableObject.onRenderSelf = ctx => this.onRenderSelf(ctx);
  }

  init() {
    this.entity.object.add(this._renderableObject);
  }

  deinit() {
    this.entity.object.remove(this._renderableObject);
  }

  onAttach() {
    this.init();
  }

  onDetach() {
    this.deinit();
  }

  onReactivate() {
    this.init();
  }

  onDeactivate() {
    this.deinit();
  }

  onRenderSelf(ctx) {}

}