
import { Drawing, EXPONENT_CSS_BODY_STYLES, EXPONENT_CSS_STYLES, Panel } from "@repcomm/exponent-ts";
import { ObjectEntity } from "./objectentity.js";

import { init as initRapier, World as RapierWorld } from "@dimforge/rapier2d-compat";
import { Globals } from "./globals.js";

import { Renderable } from "./components/renderable.js";
import { RigidBody } from "./components/rigidbody.js";
import { Camera } from "./components/camera.js";

EXPONENT_CSS_STYLES.mount(document.head);
EXPONENT_CSS_BODY_STYLES.mount(document.head);

async function main () {
  await initRapier();

  Globals.widthInMeters = 8;
  Globals.rapierWorld = new RapierWorld({
    x: 0, 
    y: 9.8
  });

  const container = new Panel()
  .setId("container")
  .mount(document.body);

  Globals.scene = new ObjectEntity("Scene");

  const boxes = new Array<ObjectEntity>();
  for (let i=0; i<100; i++) {
    let b = new ObjectEntity("box");
    b.position.set(
      Math.random() * Globals.widthInMeters,
      Math.random() * Globals.widthInMeters
    );
    let boxesRenderer = new Renderable();
    boxesRenderer.onRenderSelf = (ctx)=>{
      ctx.fillRect(-0.1, -0.1, 0.2, 0.2);
    };
    b.addComponent(boxesRenderer);

    boxes.push(b);
    Globals.scene.add(b);
  }

  const player = new ObjectEntity("Player");
  Globals.scene.add(player);
  
  let playerRenderer = new Renderable();
  playerRenderer.onRenderSelf = (ctx)=>{
    ctx.fillRect(-0.5, -0.5, 1, 1);
  };
  player.addComponent(playerRenderer);
  player.getOrCreateComponent(RigidBody);
  player.getOrCreateComponent(Camera);

  const drawing = new Drawing()
  .setId("drawing")
  .mount(container)
  .addRenderPass((ctx)=>{
    Globals.scene.scale = drawing.width/Globals.widthInMeters;

    Globals.scene.object.render(ctx);
  })
  .setHandlesResize(true);
  
  setInterval(()=>{
    Globals.rapierWorld.step();
    Globals.scene.onUpdate();
    drawing.setNeedsRedraw(true);
  }, 1000/30);
}

main();
