
import { Block } from "../voxel/block.js";
import { _1dTo2dX, _1dTo2dY, _2dTo1d } from "../math/general.js";
import { Renderable } from "./renderable.js";
import { Box, BoxList } from "../math/boxlist.js";
import { RigidBody } from "./rigidbody.js";
import { MeshCollider } from "./meshcollider.js";
import { RigidBodyType } from "@dimforge/rapier2d-compat";

function randomColor(): string {
  let str = Math.floor(Math.random() * 0xffffffff).toString(16);

  let zeroes = (8 - str.length);
  for (let i = 0; i < zeroes; i++) {
    str = "0" + str;
  }

  return "#" + str;
}

export function getBlockColor(type: number): string {
  switch (type) {
    case 1: //stone
      return "#222223";
    case 2: //dirt
      return "#553322";
    case 3: //grass
      return "#44dd55";
    default:
      return "#ff7744";
  }
}

export class Chunk extends Renderable {
  static WIDTH: number;
  static HEIGHT: number;
  static BYTES_PER_BLOCK: number;

  private data: Uint8Array;
  private renderBlock: Block;
  private collisionBlock: Block;
  private indexX: number;
  private indexY: number;
  private boxlist: BoxList;

  private rb: RigidBody;
  private meshCollider: MeshCollider;

  constructor() {
    super();

    this.data = new Uint8Array(
      Chunk.WIDTH *
      Chunk.HEIGHT *
      Chunk.BYTES_PER_BLOCK
    );

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
  static getBlockIndex(x: number, y: number): number {
    return _2dTo1d(x, y, Chunk.WIDTH);
  }
  static getBlockX(blockIndex: number): number {
    return _1dTo2dX(blockIndex, Chunk.WIDTH);
  }
  static getBlockY(blockIndex: number): number {
    return _1dTo2dY(blockIndex, Chunk.WIDTH);
  }
  static isBlockIndexValid(index: number): boolean {
    return index > -1 && index < Chunk.WIDTH * Chunk.HEIGHT;
  }
  static isBlockXYValid(x: number, y: number): boolean {
    return (
      x > -1 &&
      x < Chunk.WIDTH &&
      y > -1 &&
      y < Chunk.HEIGHT
    );
  }
  static blockXToChunkIndexX(x: number): number {
    return Math.floor(x / Chunk.WIDTH);
  }
  static blockYToChunkIndexY(y: number): number {
    return Math.floor(y / Chunk.HEIGHT);
  }
  static blockWorldXToBlockChunkX(x: number): number {
    return x % Chunk.WIDTH;
  }
  static blockWorldYToBlockChunkY(y: number): number {
    return y % Chunk.HEIGHT;
  }
  setIndex(x: number, y: number): this {
    this.indexX = x;
    this.indexY = y;
    this.entity.position.set(
      x * Chunk.WIDTH,
      y * Chunk.HEIGHT
    );
    //TODO - update physics position
    return this;
  }
  getIndexX(): number {
    return this.indexX;
  }
  getIndexY(): number {
    return this.indexY;
  }
  getBlock(localX: number, localY: number, out: Block) {
    this.getBlockFromIndex(
      Chunk.getBlockIndex(localX, localY),
      out
    );
    out.chunkX = localX;
    out.chunkY = localY;
  }
  /**Writes only type, and index to `out`
   * @param index 
   * @param out 
   */
  getBlockFromIndex(index: number, out: Block) {
    out.type = this.data[index * Chunk.BYTES_PER_BLOCK];
    //TODO - add other material data here
    out.index = index;
  }
  breakBlock(localX: number, localY: number) {
    this.renderBlock.type = 0;
    this.setBlock(localX, localY, this.renderBlock);
  }
  setBlock(localX: number, localY: number, block: Block) {
    this.setBlockFromIndex(Chunk.getBlockIndex(localX, localY), block);
  }
  setBlockFromIndex(index: number, block: Block) {
    this.data[index * Chunk.BYTES_PER_BLOCK] = block.type;
  }
  onRenderSelf(ctx: CanvasRenderingContext2D): void {
    let idx = 0;

    for (let x = 0; x < Chunk.WIDTH; x++) {
      for (let y = 0; y < Chunk.HEIGHT; y++) {
        //get the current block
        idx = Chunk.getBlockIndex(x, y);
        this.getBlockFromIndex(idx, this.renderBlock);

        //dont render air
        if (this.renderBlock.type === 0) continue;

        ctx.fillStyle = getBlockColor(this.renderBlock.type);
        ctx.fillRect(x, y, 1, 1);
      }
    }

    // for (let box of this.boxlist.boxes) {
    //   ctx.lineWidth = 0.05;
    //   ctx.strokeStyle = "red";
    //   ctx.strokeRect(
    //     box.position.x,
    //     box.position.y,
    //     box.size.x,
    //     box.size.y
    //   );
    // }
  }
  init() {
    super.init();
    this.rb = new RigidBody();
    this.rb.setType(RigidBodyType.Fixed);
    this.entity.addComponent(this.rb);

    this.meshCollider = this.getOrCreateComponent(MeshCollider);
    this.rb.setTranslation(this.entity.position.x, this.entity.position.y);
    this.calculateCollision();
    //TODO reactivate collider and rb
  }
  deinit() {
    super.deinit();
    //TODO deactivate collider and rb
  }
  onAttach(): void {
    this.init();
  }
  onReactivate(): void {
    this.init();
  }
  onDeactivate(): void {
    this.deinit();
  }
  onDetach(): void {
    this.deinit();
  }
  calculateCollision() {
    //reset collision
    // this.boxlist.clear();

    // let box: Box;

    // for (let x = 0; x < Chunk.WIDTH; x++) {
    //   for (let y = 0; y < Chunk.HEIGHT; y++) {
    //     //calculate current block
    //     this.getBlock(x, y, this.collisionBlock);

    //     //If this block has collision
    //     if (this.collisionBlock.type !== 0) {
    //       //If we need a separate collision box
    //       if (!box) {
    //         box = this.boxlist.boxAt(x, y, 1, 1);
    //       } else {
    //         //otherwise extend the last one (it gets reset for blocks with no collision)
    //         // box.halfExtents.y += 0.5;
    //         Box.extend(box, 0, 0, 0, 1);
    //       }
    //       //If the block has no collision
    //     } else {
    //       //reset box so we'll need a new one in future in this column
    //       box = undefined;
    //     }
    //   }
    //   //reset block at end
    //   box = undefined;
    // }

    let vs = new Array<number>();
    // let inds = new Array<number>();
    let minx: number;
    let maxx: number;
    let miny: number;
    let maxy: number;
    let idx = 0;

    for (let x = 0; x < Chunk.WIDTH; x++) {
      for (let y = 0; y < Chunk.HEIGHT; y++) {

        //get the current block
        idx = Chunk.getBlockIndex(x, y);
        this.getBlockFromIndex(idx, this.renderBlock);

        //dont render air
        if (this.renderBlock.type === 0) continue;

        minx = x;
        maxx = minx + 1;
        miny = y;
        maxy = miny + 1;

        vs.push(
          minx, miny,
          maxx, miny,
          maxx, maxy,
          minx, maxy,
          minx, miny
        );
        // inds.push(
        //   idx++, idx++, idx++,
        //   idx++, idx++, idx++
        // );
      }
    }

    // for (let box of this.boxlist.boxes) {
    //   minx = box.position.x;
    //   maxx = minx + box.size.x;
    //   miny = box.position.y;
    //   maxy = miny + box.size.y;

    //   vs.push(
    //     minx, miny,
    //     maxx, miny,
    //     minx, maxy,

    //     minx, maxy,
    //     maxx, miny,
    //     maxx, maxy
    //   );
    //   inds.push(
    //     idx++, idx++, idx++,
    //     idx++, idx++, idx++
    //   );
    // }
    this.meshCollider.setTrimesh(
      new Float32Array(vs),
      // new Uint32Array(inds)
    );
  }
}

Chunk.WIDTH = 16;
Chunk.HEIGHT = 16;
Chunk.BYTES_PER_BLOCK = 1;
