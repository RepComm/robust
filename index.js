import { init as initRapier, World as RapierWorld } from "@dimforge/rapier2d-compat";
import { Drawing, EXPONENT_CSS_BODY_STYLES, EXPONENT_CSS_STYLES, Panel } from "@repcomm/exponent-ts";
import { Chunk } from "./components/chunk.js";
import { Player } from "./components/player.js";
import { Globals } from "./globals.js";
import { ObjectEntity } from "./objectentity.js";
EXPONENT_CSS_STYLES.mount(document.head);
EXPONENT_CSS_BODY_STYLES.mount(document.head);

async function main() {
  await initRapier();
  Globals.rapierWorld = new RapierWorld({
    x: 0,
    y: 9.8
  });
  const container = new Panel().setId("container").mount(document.body);
  Globals.scene = new ObjectEntity("Scene");
  const chunk = new ObjectEntity("Chunk");
  chunk.getOrCreateComponent(Chunk);
  Globals.scene.add(chunk);
  const player = new ObjectEntity("Player");
  player.position.set(2, -5);
  player.getOrCreateComponent(Player);
  Globals.scene.add(player);
  const drawing = new Drawing().setId("drawing").mount(container).addRenderPass(ctx => {
    ctx.save();
    let s = drawing.width / (Globals.mainCamera.width || 8);
    ctx.scale(s, s);
    let {
      x,
      y
    } = Globals.mainCamera.entity.globalTransform.position;
    let aspect = drawing.width / drawing.height;
    x -= Globals.mainCamera.width / 2;
    y -= Globals.mainCamera.width / 2 / aspect;
    ctx.translate(-x, -y);
    Globals.scene.object.render(ctx);
    ctx.restore();
  }).setHandlesResize(true);
  setInterval(() => {
    Globals.rapierWorld.step();
    Globals.scene.onUpdate();
    drawing.setNeedsRedraw(true);
  }, 1000 / 30);
}

main();