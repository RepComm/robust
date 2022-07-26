import { Block } from "../voxel/block.js";
import { _1dTo2dX, _1dTo2dY, _2dTo1d } from "../math/general.js";
import { Renderable } from "./renderable.js";
import { BoxList } from "../math/boxlist.js";
import { RigidBody } from "./rigidbody.js";
import { MeshCollider } from "./meshcollider.js";
import { RigidBodyType } from "@dimforge/rapier2d-compat";
import { Globals } from "../globals.js";

function randomColor() {
  let str = Math.floor(Math.random() * 0xffffffff).toString(16);
  let zeroes = 8 - str.length;

  for (let i = 0; i < zeroes; i++) {
    str = "0" + str;
  }

  return "#" + str;
}

export function getBlockColor(type) {
  switch (type) {
    case 1:
      //stone
      return "#222223";

    case 2:
      //dirt
      return "#553322";

    case 3:
      //grass
      return "#44dd55";

    default:
      return "#ff7744";
  }
}
export class Chunk extends Renderable {
  constructor() {
    super();
    this.data = new Uint8Array(Chunk.WIDTH * Chunk.HEIGHT * Chunk.BYTES_PER_BLOCK);
    this.boxlist = new BoxList();
    this.renderBlock = new Block();
    this.collisionBlock = new Block();

    for (let x = 0; x < Chunk.WIDTH; x++) {
      for (let y = 0; y < Chunk.HEIGHT; y++) {
        this.renderBlock.type = Math.floor(Math.random() * 4);
        this.setBlock(x, y, this.renderBlock);
      }
    }
  }

  static getBlockIndex(x, y) {
    return _2dTo1d(x, y, Chunk.WIDTH);
  }

  static getBlockX(blockIndex) {
    return _1dTo2dX(blockIndex, Chunk.WIDTH);
  }

  static getBlockY(blockIndex) {
    return _1dTo2dY(blockIndex, Chunk.WIDTH);
  }

  static isBlockIndexValid(index) {
    return index > -1 && index < Chunk.WIDTH * Chunk.HEIGHT;
  }

  static isBlockXYValid(x, y) {
    return x > -1 && x < Chunk.WIDTH && y > -1 && y < Chunk.HEIGHT;
  }

  static blockXToChunkIndexX(x) {
    return Math.floor(x / Chunk.WIDTH);
  }

  static blockYToChunkIndexY(y) {
    return Math.floor(y / Chunk.HEIGHT);
  }

  static blockWorldXToBlockChunkX(x) {
    return x % Chunk.WIDTH;
  }

  static blockWorldYToBlockChunkY(y) {
    return y % Chunk.HEIGHT;
  }

  setIndex(x, y) {
    this.indexX = x;
    this.indexY = y;
    this.entity.position.set(x * Chunk.WIDTH, y * Chunk.HEIGHT); //TODO - update physics position

    return this;
  }

  getIndexX() {
    return this.indexX;
  }

  getIndexY() {
    return this.indexY;
  }

  getBlock(localX, localY, out) {
    this.getBlockFromIndex(Chunk.getBlockIndex(localX, localY), out);
    out.chunkX = localX;
    out.chunkY = localY;
  }

  isBlockEmpty(localX, localY) {
    this.getBlock(localX, localY, this.collisionBlock);
    return this.collisionBlock.type === 0;
  }
  /**Writes only type, and index to `out`
   * @param index 
   * @param out 
   */


  getBlockFromIndex(index, out) {
    out.type = this.data[index * Chunk.BYTES_PER_BLOCK]; //TODO - add other material data here

    out.index = index;
  }

  breakBlock(localX, localY) {
    this.renderBlock.type = 0;
    this.setBlock(localX, localY, this.renderBlock);
  }

  setBlock(localX, localY, block) {
    this.setBlockFromIndex(Chunk.getBlockIndex(localX, localY), block);
  }

  setBlockFromIndex(index, block) {
    this.data[index * Chunk.BYTES_PER_BLOCK] = block.type;
  }

  onRenderSelf(ctx) {
    let idx = 0;

    for (let x = 0; x < Chunk.WIDTH; x++) {
      for (let y = 0; y < Chunk.HEIGHT; y++) {
        //get the current block
        idx = Chunk.getBlockIndex(x, y);
        this.getBlockFromIndex(idx, this.renderBlock); //dont render air

        if (this.renderBlock.type === 0) continue;
        ctx.fillStyle = getBlockColor(this.renderBlock.type);
        ctx.fillRect(x, y, 1, 1);
      }
    }

    this.renderCollisions(ctx);
  }

  renderCollisions(ctx) {
    let vs = this.meshCollider.vertices;
    let inds = this.meshCollider.indices;
    if (!vs) return;
    let x = 0;
    let y = 0;
    ctx.beginPath();
    let ia = 0;
    let ib = 0;

    for (let i = 0; i < inds.length;) {
      ia = inds[i];
      i++;
      ib = inds[i];
      i++;
      x = vs[ia];
      y = vs[ia + 1];
      ctx.moveTo(x, y);
      x = vs[ib];
      y = vs[ib + 1];
      ctx.lineTo(x, y);
    }

    ctx.strokeStyle = "red";
    ctx.lineWidth = 2 / Globals.scene.scale; // ctx.closePath();

    ctx.stroke();
  }

  init() {
    super.init();
    this.rb = new RigidBody();
    this.rb.setType(RigidBodyType.Fixed);
    this.entity.addComponent(this.rb);
    this.meshCollider = this.getOrCreateComponent(MeshCollider);
    this.rb.setTranslation(this.entity.position.x, this.entity.position.y);
    this.calculateCollision(); //TODO reactivate collider and rb
  }

  deinit() {
    super.deinit(); //TODO deactivate collider and rb
  }

  onAttach() {
    this.init();
  }

  onReactivate() {
    this.init();
  }

  onDeactivate() {
    this.deinit();
  }

  onDetach() {
    this.deinit();
  }

  calculateCollision() {
    let vs = new Array();
    let inds = new Array();
    let minx;
    let maxx;
    let miny;
    let maxy;
    let idx = 0;
    let ind = 0;
    let topEmpty = false;
    let leftEmpty = false;

    for (let x = 0; x < Chunk.WIDTH; x++) {
      for (let y = 0; y < Chunk.HEIGHT; y++) {
        //get the current block
        idx = Chunk.getBlockIndex(x, y);
        this.getBlockFromIndex(idx, this.renderBlock); //dont render air

        if (this.renderBlock.type === 0) continue;
        topEmpty = y === 0 || this.isBlockEmpty(x, y - 1);
        leftEmpty = x === 0 || this.isBlockEmpty(x - 1, y);
        minx = x;
        maxx = minx + 1;
        miny = y;
        maxy = miny + 1;

        if (topEmpty) {
          vs.push(minx, miny, maxx, miny);
          inds.push(ind++, ind++);
        }

        if (leftEmpty) {
          vs.push(minx, miny, minx, maxy);
          inds.push(ind++, ind++);
        }

        vs.push(maxx, miny, //0
        maxx, maxy, //1
        minx, maxy //2
        );
        inds.push(ind + 0, ind + 1, ind + 1, ind + 2);
        ind += 3;
      }
    }

    this.meshCollider.setTrimesh(new Float32Array(vs), new Uint32Array(inds));
  }

}
Chunk.WIDTH = 16;
Chunk.HEIGHT = 16;
Chunk.BYTES_PER_BLOCK = 1;