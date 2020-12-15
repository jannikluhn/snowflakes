if ('function' === typeof importScripts) {
  importScripts('wasm_exec.js')
    
  const go = new Go()

  WebAssembly.instantiateStreaming(fetch("main.wasm"), go.importObject).then(function(result) {
    go.run(result.instance)
    postMessage("ready")
  })
  
  addEventListener('message', onMessage)

  function onMessage(e) {
    if (e.data["method"] == "addSnowflake") {
      let seed = e.data["seed"]
      let size = parseInt(e.data["size"])
      addSnowflake(seed, size)
    } else {
      console.log("unknown method", e.data)
    }
  }
}