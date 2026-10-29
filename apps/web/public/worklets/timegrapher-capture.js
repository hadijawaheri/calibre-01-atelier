// Runs on the audio thread: copies the microphone's samples out in blocks of 4096 (about 85 ms at 48 kHz)
class TimegrapherCapture extends AudioWorkletProcessor {
  constructor() {
    super();
    this.block = new Float32Array(4096);
    this.filled = 0;
  }

  process(inputs) {
    const channel = inputs[0] && inputs[0][0];
    if (!channel) return true;
    let read = 0;
    while (read < channel.length) {
      const count = Math.min(channel.length - read, this.block.length - this.filled);
      this.block.set(channel.subarray(read, read + count), this.filled);
      this.filled += count;
      read += count;
      if (this.filled === this.block.length) {
        this.port.postMessage(this.block, [this.block.buffer]);
        this.block = new Float32Array(4096);
        this.filled = 0;
      }
    }
    return true;
  }
}

registerProcessor("timegrapher-capture", TimegrapherCapture);
