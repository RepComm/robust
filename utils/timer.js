export class Timer {
  constructor(delay = 100) {
    this.delay = delay;
    this.lastEffective = Date.now();
  }

  get delay() {
    return this._delay;
  }

  set delay(d) {
    if (d > 0 && d !== Infinity) this._delay = d;
  }

  get effective() {
    this.lastCheck = Date.now();

    if (this.lastCheck - this.lastEffective > this._delay) {
      this.lastEffective = this.lastCheck;
      return true;
    }

    return false;
  }

}