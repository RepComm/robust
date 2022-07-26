import type { World as RapierWorld } from "@dimforge/rapier2d-compat";
import type { Camera } from "./components/camera";
import type { ObjectEntity } from "./objectentity";

export interface GlobalsDef {
  rapierWorld?: RapierWorld;
  scene?: ObjectEntity;
  mainCamera?: Camera;
}

export const Globals: GlobalsDef = {
  
};
