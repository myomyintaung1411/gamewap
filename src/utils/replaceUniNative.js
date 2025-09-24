/*
 * use

import { nativeImport } from '@front/utils/replaceUniNative';
import { nativeDefineAsyncComponent } from '@front/utils/replaceUniNative';
 */

import { defineAsyncComponent } from 'vue';

export function nativeDefineAsyncComponent(func) {
  // #ifdef APP-PLUS
    return func;
  // #endif
  // #ifndef APP-PLUS
    return defineAsyncComponent(func);
    // return func;
  // #endif
}
