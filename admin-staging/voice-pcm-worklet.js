/* global AudioWorkletProcessor, registerProcessor */

class PCMWorkletProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this._buffer = new Float32Array(0);
    this._batchSize = 320;
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || input.length === 0) {
      return true;
    }
    const channel = input[0];
    if (!channel || channel.length === 0) {
      return true;
    }

    const combined = new Float32Array(this._buffer.length + channel.length);
    combined.set(this._buffer, 0);
    combined.set(channel, this._buffer.length);
    this._buffer = combined;

    while (this._buffer.length >= this._batchSize) {
      const chunk = this._buffer.subarray(0, this._batchSize);
      const pcm = new Int16Array(this._batchSize);
      for (let i = 0; i < this._batchSize; i += 1) {
        const sample = Math.max(-1, Math.min(1, chunk[i]));
        pcm[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      }
      this.port.postMessage(pcm.buffer, [pcm.buffer]);
      this._buffer = this._buffer.subarray(this._batchSize);
    }

    return true;
  }
}

registerProcessor('pcm-worklet', PCMWorkletProcessor);
