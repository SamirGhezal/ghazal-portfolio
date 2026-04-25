export class WasmLoader {
  constructor() {
    this.load();
  }
  async load() {
    try {
      const r = await fetch('cpp/main.wasm');
      const { instance } = await WebAssembly.instantiate(await r.arrayBuffer(), {
        env: { memory: new WebAssembly.Memory({initial:256,maximum:256}) }
      });
      if(instance.exports.init) instance.exports.init();
      console.log('✅ WebAssembly جاهز');
    } catch(e) {
      console.warn('⚠️ يعمل الموقع بدون WebAssembly');
    }
  }
}