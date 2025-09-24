import MWK from './index.worker.js?worker';

let wk = false;

// #ifdef APP-PLUS
  import { appPostMessage, appOnMessage } from './index.worker.js';

  wk = {
    onmessage:()=> {
    },
    postMessage:(args)=> {
      appPostMessage(args);
    },
  }

  appOnMessage((args)=> {
    wk.onmessage({ data:args });
  })
// #endif
// #ifndef APP-PLUS
  wk = new MWK();
// #endif

export default wk;
