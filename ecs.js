/**
 * Base class for all components attached to entities
 * 
 */
export class Component {
  get active() {
    return this._active;
  }

  setActive(active) {
    let previousValue = this._active;
    this._active = active === true;

    if (this._active !== previousValue) {
      if (this._active) this.onReactivate();else this.onDeactivate();
    }

    return this;
  }
  /**
   * Get the entity this component is attached to
   */


  get entity() {
    return this._entity;
  }
  /**
   * Detect if component is attached to an entity
   * Realistically, your code should not be running when this is false
   */


  get isAttached() {
    return this._entity !== undefined && this._entity !== null;
  }
  /**
   * make sure to call super() in your subclass
   */


  constructor() {
    this._active = true;
  }
  /**
   * Get notified when the component is attached to an entity
   * This happens right after attachment, so this.entity is valid
   */


  onAttach() {}
  /**
   * Get notified when the component is detached from an entity
   * This happens right before detachment, so this.entity is still valid
   */


  onDetach() {}
  /**
   * Components start out active, this method is only called after
   * deactivating and then reactivating it
   */


  onReactivate() {}

  onDeactivate() {}

  /**Send a message that can be heard from other components on the same entity
   * Returns false if no entity attached, and true otherwise
  */
  sendMessage(msg) {
    if (!this._entity) return false;
    this.entity.onMessage(this, msg);
    return true;
  }

  getComponent(constructor) {
    if (!this.isAttached) return null;
    return this.entity.getComponent(constructor);
  }

  getOrCreateComponent(c) {
    if (!this.isAttached) return null;
    return this.entity.getOrCreateComponent(c);
  }

}
export class Entity {
  get components() {
    if (!this._components) this._components = new Array();
    return this._components;
  }

  constructor(label = "unlabelled") {
    this.label = label;
  }

  addComponent(c) {
    if (this.onComponentBeforeAdd(c) === false) return this;
    this.components.push(c);
    c["_entity"] = this;
    this.onComponentAdd(c);
    c.onAttach();
    return this;
  }

  hasComponent(c) {
    return this._components.includes(c);
  }

  removeComponent(c) {
    if (!this._components) return this;
    if (this.onComponentBeforeRemove(c) === false) return this;

    let idx = this._components.indexOf(c);

    if (idx < 0) return this;
    c.onDetach();

    this._components.splice(idx, 1);

    c["_entity"] = undefined;
    this.onComponentRemove(c);
    return this;
  }

  getComponents(constructor) {
    let result = [];

    if (this._components) {
      if (typeof constructor === "string") {
        for (let c of this.components) {
          if (c.constructor.name === constructor) result.push(c);
        }
      } else {
        for (let c of this.components) {
          if (c.constructor === constructor) result.push(c);
        }
      }
    }

    return result || null;
  }
  /**
   * Get a sibling component given the constructor of the component or its name
   * 
   * Ex:
   * ```ts
   * import {Transform} from "./components/transform.js";
   * //...
   * this.getComponent(Transform.name);
   * 
   * //or
   * this.getComponent("Transform");
   * 
   * //or
   * this.getComponent(Transform);
   * 
   * //or given an instance of the object
   * this.getComponent(someInstance.constructor);
   * ```
   */


  getComponent(constructor) {
    if (!this._components) return null;

    if (typeof constructor === "string") {
      for (let c of this.components) {
        //@ts-expect-error
        if (c.constructor.name === constructor) return c;
      }
    } else {
      for (let c of this.components) {
        //@ts-expect-error
        if (c.constructor === constructor) return c;
      }
    }

    return null;
  }

  onComponentAdd(c) {}

  onComponentRemove(c) {}
  /**
   * Meant to be implemented on subclasses
   * 
   * Use this to deny adding of components if desired
   * 
   * Return true or undefined to do nothing (let component be added), false to reject
   */


  onComponentBeforeAdd(c) {
    return true;
  }
  /**
   * Meant to be implemented on subclasses
   * 
   * Use this to deny removal of components if desired
   * 
   * Return true or undefined to do nothing (let component be removed), false to reject
   */


  onComponentBeforeRemove(c) {
    return true;
  }

  onUpdate() {
    if (!this._components) return;

    for (let c of this.components) {
      if (c.active && c.onUpdate) c.onUpdate();
    }
  }

  getOrCreateComponent(c) {
    let result = this.getComponent(c);

    if (!result) {
      result = new c.prototype.constructor(); //@ts-expect-error

      this.addComponent(result);
    }

    return result;
  }

  onMessage(c, msg) {
    if (!this._components) return;

    for (let _c of this.components) {
      if (_c.active && _c.onMessage) _c.onMessage(_c, msg);
    }
  }

}