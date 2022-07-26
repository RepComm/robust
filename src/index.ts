
import { Drawing, EXPONENT_CSS_BODY_STYLES, EXPONENT_CSS_STYLES, Panel } from "@repcomm/exponent-ts";
import { ObjectEntity } from "./objectentity.js";

import { init as initRapier, World as RapierWorld } from "@dimforge/rapier2d-compat";
import { Globals } from "./globals.js";

import { Renderable } from "./components/renderable.js";
import { RigidBody } from "./components/rigidbody.js";
import { Camera } from "./components/camera.js";
import { Chunk } from "./components/chunk.js";
import { BallCollider } from "./components/ballcollider.js";
import { Player } from "./components/player.js";

EXPONENT_CSS_STYLES.mount(document.head);
EXPONENT_CSS_BODY_STYLES.mount(document.head);

async function main () {
  await initRapier();

  Globals.rapierWorld = new RapierWorld({
    x: 0, 
    y: 9.8
  });

  const container = new Panel()
  .setId("container")
  .mount(document.body);

  Globals.scene = new ObjectEntity("Scene");

  const chunk = new ObjectEntity("Chunk");
  chunk.getOrCreateComponent(Chunk);
  Globals.scene.add(chunk);

  const player = new ObjectEntity("Player");
  player.position.set(2, -5);
  player.getOrCreateComponent(Player);
  Globals.scene.add(player);
  
  const drawing = new Drawing()
  .setId("drawing")
  .mount(container)
  .addRenderPass((ctx)=>{
    Globals.scene.scale = drawing.width/(Globals.mainCamera.orthographicSize||8);

    Globals.scene.object.render(ctx);
  })
  .setHandlesResize(true);
  Globals.canvas = drawing.element;
  
  setInterval(()=>{
    Globals.rapierWorld.step();
    Globals.scene.onUpdate();
    drawing.setNeedsRedraw(true);
  }, 1000/30);
}

main();
