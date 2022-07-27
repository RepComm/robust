
export class Timer {
  private _delay: number;
  private lastEffective: number;
  private lastCheck: number;

  constructor (delay: number = 100) {
    this.delay = delay;
    this.lastEffective = Date.now();
  }
  get delay (): number {
    return this._delay;
  }
  set delay (d: number) {
    if (d > 0 && d !== Infinity) this._delay = d;
  }
  get effective (): boolean {
    this.lastCheck = Date.now();
    if (this.lastCheck - this.lastEffective > this._delay) {
      this.lastEffective = this.lastCheck;
      return true;
    }
    return false;
  }
}
