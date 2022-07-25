
import { Object2D } from "@repcomm/scenario2d";
import { ObjectComponent } from "./objectcomponent.js";

export class Renderable extends ObjectComponent {
  private _renderableObject: Object2D;

  constructor () {
    super();
    this._renderableObject = new Object2D();
    this._renderableObject.onRenderSelf = (ctx)=>this.onRenderSelf(ctx) as any;
  }
  init () {
    this.entity.object.add(this._renderableObject);
  }
  deinit () {
    this.entity.object.remove(this._renderableObject);
  }
  onAttach(): void {
    this.init();
  }
  onDetach(): void {
    this.deinit();
  }
  onReactivate(): void {
    this.init();
  }
  onDeactivate(): void {
    this.deinit();
  }
  onRenderSelf (ctx: CanvasRenderingContext2D) {

  }
}
