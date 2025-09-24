
<template>
<div>

  <!-- xx -->

</div>
</template>
<script setup name="TheVoice">
import { watch, reactive,computed } from "vue";
import { onShow, onHide, onUnload } from "@dcloudio/uni-app";
import { EventEmitter } from "@front/eventBus/index";
import { VOICE_SEND } from "@front/eventBus/actions";
import { isArray } from "@front/utils/is";
import { useSystemStore } from "@front/stores/modules/system.store";
import { useI18n } from "vue-i18n";
import { Howl } from 'howler';

defineExpose({
  voiceSend: voiceSend,
});

const systemStore = useSystemStore();
const { locale } = useI18n();
	locale.value = uni.getStorageSync('l') || 'zh';

// reactive lang
// const lang = reactive({ value: locale.value });
const lang = computed(() => locale.value);

// OSS base URLs
const ossBaseZh = "https://bx1buk.oss-accelerate.aliyuncs.com/h5pt/zh/voice/";
const ossBaseEn = "https://bx1buk.oss-accelerate.aliyuncs.com/h5pt/en/voice/";

function getBase() {
  return lang.value === "zh" ? ossBaseZh : ossBaseEn;
}

// mapping Chinese characters to file name parts
const _CONFIG_GAME_RESULT_NAME = {
  龙: "long-",
  虎: "hu-",
  闲: "xian-",
  庄: "zhuang-",
  和: "he-",
  对: "dui-",
  赢: "ying-",
  局: "ju-",
  零: "ling-",
  一: "yi-",
  二: "er-",
  三: "san-",
  四: "si-",
  五: "wu-",
  六: "liu-",
  七: "qi-",
  八: "ba-",
  九: "jiu-",
  十: "shi-",
  点: "dian-",
};

const _innerAudioContext = uni.createInnerAudioContext();

const _genVoice = (url) => {
  return {
    play: () => {
      return new Promise((resolve) => {
        const _volume = systemStore.playVoice ? 1 : 0;
        _innerAudioContext.volume = _volume;
        _innerAudioContext.src = url;
        _innerAudioContext.sessionCategory = "ambient";
        _volume === 1 && _innerAudioContext.play();
        _innerAudioContext.onEnded(() => resolve());
      });
    },
  };
};

// reactive voice config
let _voiceConfig = reactive({});

// build or rebuild voice config
function initVoiceConfig() {
  _voiceConfig = {
    welcome: _genVoice(getBase() + "welcome.mp3"),
    "into-game-bjl": _genVoice(getBase() + "into-game-bjl.mp3"),
    "into-game-lh": _genVoice(getBase() + "into-game-lh.mp3"),
    "game-is-start": _genVoice(getBase() + "game-is-start.mp3"),
    "game-last-ten-seconds": _genVoice(getBase() + "game-last-ten-seconds.mp3"),
    "game-stop-betting": _genVoice(getBase() + "game-stop-betting.mp3"),
    "game-bet-success": _genVoice(getBase() + "game-bet-success.mp3"),
    "game-repeal": _genVoice(getBase() + "game-repeal.mp3"),
    "game-win": _genVoice(getBase() + "game-win.mp3"),
    "game-chip-switch": _genVoice(getBase() + "game-chip-switch.mp3"),
    "game-betting-down": _genVoice(getBase() + "game-betting-down.mp3"),
    a_room: _genVoice(getBase() + "a_room.mp3"),
  };
}

// init first time
initVoiceConfig();

watch(lang, () => {
  // destroy old Howl instances to free memory
  initVoiceConfig(); // recreate Howl objects with new URLs
});

// watch mute/unmute toggle
watch(
  () => systemStore.playVoice,
  (value) => {
    const _volume = value ? 1 : 0;
    _innerAudioContext.volume = _volume;
    _volume === 0 && _innerAudioContext.stop();
  }
);

let _resultList = [];

function voiceSend(type, data) {
  _bindVoiceSend(type, data);
}

async function _bindVoiceSend(type, data) {
  if (!type) return;

  if (type === "game-win" && _resultList.length > 0) {
    const _waitId = setInterval(() => {
      if (_resultList.length < 1) {
        clearInterval(_waitId);
        _voiceConfig[type].play();
      }
    }, 300);
    return;
  }

  if (type === "game-result-list") {
    if (!isArray(data)) return;
    _resultList.splice(0, _resultList.length);

    for (let i = 0; i < data.length; i++) {
      const fileName = _replaceConfigStr(data[i].split(".")[0]);
      const url = getBase() + "game-result/" + fileName + ".mp3";
      const _ins = _genVoice(url);
      await _ins.play();
    }

    _resultList.splice(0, _resultList.length);
  } else {
    type in _voiceConfig && _voiceConfig[type].play();
  }
}

function _replaceConfigStr(str) {
  return str
    .split("")
    .map((char) => _CONFIG_GAME_RESULT_NAME[char] || char)
    .join("");
}

onShow(() => {
  EventEmitter.add(VOICE_SEND, _bindVoiceSend);
});

onHide(() => {
  EventEmitter.remove(VOICE_SEND, _bindVoiceSend);
});
onUnload(() => {
  EventEmitter.remove(VOICE_SEND, _bindVoiceSend);
});
</script>
