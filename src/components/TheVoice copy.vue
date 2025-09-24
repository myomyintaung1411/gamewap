<template>
<div>

  <!-- xx -->

</div>
</template>
<script setup name='TheVoice'>
import { watch, } from 'vue';
import { onShow, onHide, onUnload } from '@dcloudio/uni-app';
import Mp3Welcome from '@front/public/voice/welcome.mp3';
import Mp3IntoGameBjl from '@front/public/voice/into-game-bjl.mp3';
import Mp3IntoGameLh from '@front/public/voice/into-game-lh.mp3';
import Mp3GameIsStart from '@front/public/voice/game-is-start.mp3';
import Mp3GameLastTenSeconds from '@front/public/voice/game-last-ten-seconds.mp3';
import Mp3GameStopBetting from '@front/public/voice/game-stop-betting.mp3';
import Mp3GameBetSuccess from '@front/public/voice/game-bet-success.mp3';
import Mp3GameRepeal from '@front/public/voice/game-repeal.mp3';
import Mp3GameWin from '@front/public/voice/game-win.mp3';
import Mp3GameChipSwitch from '@front/public/voice/game-chip-switch.mp3';
import Mp3GameBettingDown from '@front/public/voice/game-betting-down.mp3';
import Mp3ARoom from '@front/public/voice/a_room.mp3';
import { Howl } from 'howler';
import { EventEmitter, } from '@front/eventBus/index';
import { VOICE_SEND, } from '@front/eventBus/actions';
import { isArray } from '@front/utils/is';
import { useSystemStore } from '@front/stores/modules/system.store';

defineExpose({
  voiceSend: voiceSend,
})

const _CONFIG_GAME_RESULT_NAME = {
  '龙': 'long-',
  '虎': 'hu-',
  '闲': 'xian-',
  '庄': 'zhuang-',
  '和': 'he-',
  '对': 'dui-',
  '赢': 'ying-',
  '局': 'ju-',
  '零': 'ling-',
  '一': 'yi-',
  '二': 'er-',
  '三': 'san-',
  '四': 'si-',
  '五': 'wu-',
  '六': 'liu-',
  '七': 'qi-',
  '八': 'ba-',
  '九': 'jiu-',
  '十': 'shi-',
  '点': 'dian-',
}

const modules = import.meta.glob('@front/public/voice/game-result/*.mp3', { eager:true });

const systemStore = new useSystemStore();

const _innerAudioContext = uni.createInnerAudioContext()

const _genVoice = (url)=> {
  // const _volume = systemStore.playVoice ? 1 : 0;

  // const innerAudioContext = uni.createInnerAudioContext();
  // innerAudioContext.volume = _volume;
  // innerAudioContext.src = url;
  // innerAudioContext.sessionCategory = 'ambient';
  // return innerAudioContext;
  return {
    play:()=> {
      return new Promise(resolve=> {
        const _volume = systemStore.playVoice ? 1 : 0;

        _innerAudioContext.volume = _volume;
        _innerAudioContext.src = url;
        _innerAudioContext.sessionCategory = 'ambient';
        _volume === 1 && _innerAudioContext.play();
        _innerAudioContext.onEnded(()=> resolve());
      })
    },
  }
}

watch(()=> systemStore.playVoice, (value)=> {
  // Object.keys(_voiceConfig).forEach(f=> _voiceConfig[f].mute(!value));
  // _resultList.forEach(f=> f.mute(!value));
  const _volume = value ? 1 : 0;
  _innerAudioContext.volume = _volume;

  _volume === 0 && _innerAudioContext.stop();

  // Object.keys(_voiceConfig).forEach(f=> _voiceConfig[f].volume = _volume);
  // _resultList.forEach(f=> f.volume = _volume);
})

const _voiceConfig = {
  // 'welcome': new Howl({ src:[Mp3Welcome], mute:!systemStore.playVoice, }),
  'welcome': _genVoice(Mp3Welcome),
  // 'into-game-bjl': new Howl({ src:[Mp3IntoGameBjl], mute:!systemStore.playVoice, }),
  'into-game-bjl': _genVoice(Mp3IntoGameBjl),
  // 'into-game-lh': new Howl({ src:[Mp3IntoGameLh], mute:!systemStore.playVoice, }),
  'into-game-lh': _genVoice(Mp3IntoGameLh),
  // 'game-is-start': new Howl({ src:[Mp3GameIsStart], mute:!systemStore.playVoice, }),
  'game-is-start': _genVoice(Mp3GameIsStart),
  // 'game-last-ten-seconds': new Howl({ src:[Mp3GameLastTenSeconds], mute:!systemStore.playVoice, }),
  'game-last-ten-seconds': _genVoice(Mp3GameLastTenSeconds),
  // 'game-stop-betting': new Howl({ src:[Mp3GameStopBetting], mute:!systemStore.playVoice, }),
  'game-stop-betting': _genVoice(Mp3GameStopBetting),
  // 'game-bet-success': new Howl({ src:[Mp3GameBetSuccess], mute:!systemStore.playVoice, }),
  'game-bet-success': _genVoice(Mp3GameBetSuccess),
  // 'game-repeal': new Howl({ src:[Mp3GameRepeal], mute:!systemStore.playVoice, }),
  'game-repeal': _genVoice(Mp3GameRepeal),
  // 'game-win': new Howl({ src:[Mp3GameWin], mute:!systemStore.playVoice, }),
  'game-win': _genVoice(Mp3GameWin),
  'game-chip-switch': _genVoice(Mp3GameChipSwitch),
  'game-betting-down': _genVoice(Mp3GameBettingDown),
  'a_room': _genVoice(Mp3ARoom),
}
let _resultList = [];

function voiceSend(type, data) {
  _bindVoiceSend(type, data);
}

async function _bindVoiceSend(type, data) {
  if (!type) return;

  if (type === 'game-win' && _resultList.length > 0) {
    const _waitId = setInterval(()=> {
      if (_resultList.length < 1) {
        clearInterval(_waitId);
        _voiceConfig[type].play();
      }
    }, 300);
    return;
  }
  if (type === 'game-result-list') {
    if (!isArray(data)) return;
    _resultList.splice(0, _resultList.length);
    _resultList.push(...data.map(f=> ''));

    /*_resultList = data.map((f,i)=> {
      // new Howl({
      //   src: [ modules[`/src/public/voice/game-result/${f.split('.')[0]}.mp3`].default ],
      //   mute: !systemStore.playVoice,
      //   onend: ()=> {
      //     i < _resultList.length - 1
      //       ? _resultList[i + 1].play()
      //       : _resultList.splice(0, _resultList.length)
      //   }
      // })
      const _ins = _genVoice(modules[`/src/public/voice/game-result/${f.split('.')[0]}.mp3`].default)
      _ins.onEnded(()=> {
        // _ins.destroy();
        i < _resultList.length - 1
          ? _resultList[i + 1].play()
          : _resultList.splice(0, _resultList.length)
      })
      return _ins;
    })
    _resultList[0].play();*/
    for (let i = 0; i < data.length; i+=1) {
      // new Howl({
      //   src: [ modules[`/src/public/voice/game-result/${f.split('.')[0]}.mp3`].default ],
      //   mute: !systemStore.playVoice,
      //   onend: ()=> {
      //     i < _resultList.length - 1
      //       ? _resultList[i + 1].play()
      //       : _resultList.splice(0, _resultList.length)
      //   }
      // })
      const _ins = _genVoice(modules[`/src/public/voice/game-result/${_replaceConfigStr(data[i].split('.')[0])}.mp3`].default)
      await _ins.play();
    }
    _resultList.splice(0, _resultList.length);
  } else {
    type in _voiceConfig && _voiceConfig[type].play();
  }
}

function _replaceConfigStr(str) {
  return str.split('').map(char => _CONFIG_GAME_RESULT_NAME[char] || char).join('');
}

onShow(()=> {
  EventEmitter.add(VOICE_SEND, _bindVoiceSend);
})

onHide(()=> {
  EventEmitter.remove(VOICE_SEND, _bindVoiceSend);
})
onUnload(()=> {
  EventEmitter.remove(VOICE_SEND, _bindVoiceSend);
})

</script>
<style lang='less' src='@front/zstyles/components/TheVoice.less' scoped></style>
