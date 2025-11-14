<template>
  <view :class="['pi_model', _show ? '_show' : '_hidden']">

    <!-- keep your original ribbon halves -->
    <div
      :class="[
        'pi_bg _left',
        `_type_${gameStore.gameType}`,
        (gameStore.winBetList.includes('bet-xian') || gameStore.winBetList.includes('bet-long')) && '_bright'
      ]"
    />
    <div
      :class="[
        'pi_bg _right',
        `_type_${gameStore.gameType}`,
        (gameStore.winBetList.includes('bet-zhuang') || gameStore.winBetList.includes('bet-hu')) && '_bright'
      ]"
    />

    <template v-if="_show">
      <!-- RESULT (badge + label) — shimmer ONLY here -->
      <div class="pi_title">
        <!-- LEFT: Player (bjl) / Dragon (lh) -->
        <div
          :class="[
            'pi_ti_view _left',
            `_type_${gameStore.gameType}`,
            (gameStore.winBetList.includes('bet-xian') || gameStore.winBetList.includes('bet-long')) && '_bright'
          ]"
        >
          <div class="pi_badge" :style="{ background: badgeBgLeft }">
            {{ ({ bjl: gameStore.pokerInfo.bjlXianTotal, lh: gameStore.pokerInfo.lhLongTotal })[gameStore.gameType] || 0 }}
          </div>
          <div class="pi_label">
            {{ ({ bjl: t('bjl.xian'), lh: t('lh.long') })[gameStore.gameType] || '--' }}
          </div>
        </div>

        <!-- RIGHT: Banker (bjl) / Tiger (lh) -->
        <div
          :class="[
            'pi_ti_view _right',
            `_type_${gameStore.gameType}`,
            (gameStore.winBetList.includes('bet-zhuang') || gameStore.winBetList.includes('bet-hu')) && '_bright'
          ]"
        >
          <div class="pi_badge" :style="{ background: badgeBgRight }">
            {{ ({ bjl: gameStore.pokerInfo.bjlZhuangTotal, lh: gameStore.pokerInfo.lhHuTotal })[gameStore.gameType] || 0 }}
          </div>
          <div class="pi_label">
            {{ ({ bjl: t('bjl.zhuang'), lh: t('lh.hu') })[gameStore.gameType] || '--' }}
          </div>
        </div>
      </div>

      <!-- CARDS (unchanged layout you already had) -->
      <template v-if="gameStore.gameType === 'bjl'">
        <div class="pi_first">
          <div class="pi_fi_view _left">
            <div class="pi_flexrow">
              <div class="pi_fi_vi_poker">
                <image class="img-normal" :src="_getImageUrl(gameStore.pokerInfo.bjlXian01?.cardName)" />
              </div>
              <div class="pi_fi_vi_poker">
                <image class="img-normal" :src="_getImageUrl(gameStore.pokerInfo.bjlXian02?.cardName)" />
              </div>
            </div>
            <template v-if="gameStore.pokerInfo.bjlXian03">
              <div class="pi_fi_vi_poker _isBuPai">
                <image class="img-normal" :src="_getImageUrl(gameStore.pokerInfo.bjlXian03.cardName)" />
              </div>
            </template>
          </div>

          <div class="pi_fi_view _right">
            <div class="pi_flexrow">
              <div class="pi_fi_vi_poker">
                <image class="img-normal" :src="_getImageUrl(gameStore.pokerInfo.bjlZhuang01?.cardName)" />
              </div>
              <div class="pi_fi_vi_poker">
                <image class="img-normal" :src="_getImageUrl(gameStore.pokerInfo.bjlZhuang02?.cardName)" />
              </div>
            </div>
            <template v-if="gameStore.pokerInfo.bjlZhuang03">
              <div class="pi_fi_vi_poker _isBuPai">
                <image class="img-normal" :src="_getImageUrl(gameStore.pokerInfo.bjlZhuang03.cardName)" />
              </div>
            </template>
          </div>
        </div>
      </template>

      <template v-else-if="gameStore.gameType === 'lh'">
        <div class="pi_first">
          <div class="pi_fi_view _left">
            <div class="pi_flexrow">
              <div class="pi_fi_vi_poker">
                <image class="img-normal" :src="_getImageUrl(gameStore.pokerInfo.lhLong01?.cardName)" />
              </div>
            </div>
          </div>
          <div class="pi_fi_view _right">
            <div class="pi_flexrow">
              <div class="pi_fi_vi_poker">
                <image class="img-normal" :src="_getImageUrl(gameStore.pokerInfo.lhHu01?.cardName)" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </template>
  </view>
</template>

<script setup name="PokerInfo">
import { computed } from 'vue'
import { useGameStore } from '@front/stores/modules/game.store'
import { useUserStore } from '@front/stores/modules/user.store'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const gameStore = useGameStore()
const userStore = useUserStore()

const _show = computed(() =>
  !gameStore.isLive && ['comeStart', 'opening', 'settlement'].includes(gameStore.gameStatus)
)

/* ✅ badge colors fixed:
   - BJL: left Player=BLUE, right Banker=RED
   - LH : left Dragon=RED,  right Tiger=BLUE
*/
const badgeBgLeft = computed(() =>
  gameStore.gameType === 'bjl'
    ? 'rgba(72, 148, 253)'
    : gameStore.gameType === 'lh'
    //? 'rgba(205, 43, 22, .7)'   // 龙 (left) = red
    ? 'rgba(255, 90, 76)'
    : 'rgba(0,0,0,.38)'
)
const badgeBgRight = computed(() =>
  gameStore.gameType === 'bjl'
    ? 'rgba(255, 90, 76)'
    : gameStore.gameType === 'lh'
    ? 'rgba(72, 148, 253)'  // 虎 (right) = blue
    : 'rgba(0,0,0,.38)'
)

const _TRANS_POKER_NAME = { '方片': 'fangpian', '梅花': 'meihua', '黑桃': 'heitao', '红桃': 'hongtao' }
function _getImageUrl (name) {
  const base = userStore.getImageBase
  if (!name) return `${base}pokers/poker-bg.png`
  const zh = name.substring(0, 2)
  const mapped = zh in _TRANS_POKER_NAME ? _TRANS_POKER_NAME[zh] + name.substring(2) : name
  return `${base}pokers/poker-${mapped}.png`
}
</script>


<style lang="less" scoped>
/* === animations === */
@keyframes fadeLeftIn  { from{ opacity:0; transform:translateX(-40px);} to{ opacity:1; transform:none;} }
@keyframes fadeLeftOut { from{ opacity:1; transform:none;} to{ opacity:0; transform:translateX(40px);} }

/* local sweep just for result section */
@keyframes ti_sweep_left  { from { transform: translateX(200%); } to { transform: translateX(-200%); } }
@keyframes ti_sweep_right { from { transform: translateX(-200%);} to { transform: translateX(200%);  } }

/* card constants */
@cardW: 86rpx;
@cardH: 120rpx;
@thirdW: 120rpx;
@thirdH: 86rpx;
@gap: 12rpx;

/* === container === */
.pi_model { .bg-mask(.6); width:100%; height:100%; position:absolute; inset:0; .box-sizing(); padding:0 0 10px 0; overflow:hidden; }
.pi_model._show   { opacity:1; pointer-events:all; animation:fadeLeftIn .5s ease forwards; }
.pi_model._hidden { opacity:0; pointer-events:none; animation:fadeLeftOut .4s ease forwards; }

/* === ribbon halves (top only) === */
.pi_bg { width:50%; height:180rpx; position:absolute; top:0; z-index:1; overflow:hidden; }
.pi_bg._left  { left:0; }
.pi_bg._right { right:0; left:auto; }

/* colors */
.pi_bg._left._type_bjl  { background:linear-gradient(to right, rgba(17,103,231,.10), rgba(69, 113, 238)); }
.pi_bg._right._type_bjl { background:linear-gradient(to left,  rgba(205,43,22,.10),  rgba(240, 84, 82)); }
.pi_bg._left._type_lh   { background:linear-gradient(to right,  rgba(205,43,22,.10) ,rgba(240, 84, 82),); }
.pi_bg._right._type_lh  { background:linear-gradient(to left, rgba(17,103,231,.10), rgba(69, 113, 238), ); }
.pi_bg._bright { filter: saturate(1.05) brightness(1.04); }

/* === RESULT section (shimmer lives here) === */
.pi_title {
  width:100%;
  height:180rpx;        /* match ribbon height exactly */
  display:flex;
  align-items:center;
  position:relative; z-index:2;
}

.pi_ti_view{
  width:50%;
  height:100%;          /* <-- make the cell as tall as the bar */
  position:relative;
  overflow:hidden;
  display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8rpx;
  padding:0 40rpx;
}

/* shimmer ONLY here; fill FULL height */
.pi_ti_view._bright::after{
  content:"";
  position:absolute; left:-150%; top:0; bottom:0;   /* <-- bottom:0 ensures full height */
  width:150%;
  background:linear-gradient(90deg, transparent, rgba(255,255,255,.22), transparent);
  pointer-events:none;
}
.pi_ti_view._left._bright::after  { animation: ti_sweep_left  .6s linear infinite; }
.pi_ti_view._right._bright::after { animation: ti_sweep_right .6s linear infinite; }

/* badge + label (with colored box-shadows) */
.pi_badge{
  width:74rpx; height:74rpx; border-radius:999px;
  display:grid; place-items:center;
  font-weight:700; font-size:60rpx; color:#fff;
  background:rgba(0,0,0,.38);
}
.pi_badge._blue  {
  background: rgba(17, 103, 231, .7);
  box-shadow:
    0 0 0 6rpx rgba(17,103,231,.25),
    0 8rpx 18rpx rgba(17,103,231,.35);
}
.pi_badge._red   {
  background: rgba(205, 43, 22, .7);
  box-shadow:
    0 0 0 6rpx rgba(205,43,22,.25),
    0 8rpx 18rpx rgba(205,43,22,.35);
}
.pi_label{
  font-size:@font-24; color:#fff;
  text-shadow: 0 -1px 0 #000, 1px 0 0 #000, 0 1px 0 #000, -1px 0 0 #000;
}

/* === CARDS section === */
.pi_first { width:100%; display:flex; position:relative; z-index:2; padding-top:18rpx; }

.pi_fi_view{
  width:50%; position:relative; padding:0 40rpx;
  height: calc(@cardH + @gap + @thirdH);
  display:flex; flex-direction:column; align-items:center; justify-content:flex-start;
}
.pi_flexrow{ display:flex; gap:@gap; justify-content:center; align-items:flex-start; height:@cardH; }
.pi_fi_vi_poker{ width:@cardW; height:@cardH; border-radius:4rpx; overflow:hidden; }
.pi_fi_vi_poker._isBuPai{
  width:@thirdW; height:@thirdH; position:absolute; left:50%; bottom:0; transform:translateX(-50%);
  border-radius:4rpx; overflow:hidden;
}
.pi_fi_vi_poker._isBuPai .img-normal{
  width:@cardW; height:@cardH; position:absolute; top:-10px; left:((@thirdW - @cardW)/2);
  transform:rotate(90deg); transform-origin:center;
}
</style>


<!-- <style lang="less" scoped>
/* === animations === */
@keyframes fadeLeftIn  { from{ opacity:0; transform:translateX(-40px);} to{ opacity:1; transform:none;} }
@keyframes fadeLeftOut { from{ opacity:1; transform:none;} to{ opacity:0; transform:translateX(40px);} }

/* local sweep just for result section */
@keyframes ti_sweep_left  { from { transform: translateX(200%); } to { transform: translateX(-200%); } }
@keyframes ti_sweep_right { from { transform: translateX(-200%);} to { transform: translateX(200%);  } }

/* card constants */
@cardW: 86rpx;
@cardH: 120rpx;
@thirdW: 120rpx;
@thirdH: 86rpx;
@gap: 12rpx;

/* === container === */
.pi_model {
  .bg-mask(.6);
  width:100%; height:100%;
  position:absolute; inset:0;
  .box-sizing(); padding:0 0 10px 0;
  overflow:hidden;
}
.pi_model._show   { opacity:1;  pointer-events:all;   animation:fadeLeftIn .5s ease forwards; }
.pi_model._hidden { opacity:0;  pointer-events:none;  animation:fadeLeftOut .4s ease forwards; }

/* === ribbon halves (top only) === */
.pi_bg {
  width:50%; height:180rpx; /* ribbon height only */
  position:absolute; top:0; z-index:1; overflow:hidden;
}
.pi_bg._left  { left:0; }
.pi_bg._right { right:0; left:auto; }



/* colors */
.pi_bg._left._type_bjl  { background:linear-gradient(to right, rgba(17,103,231,.10), rgba(17,103,231,.85)); }
.pi_bg._right._type_bjl { background:linear-gradient(to left,  rgba(205,43,22,.10),  rgba(205,43,22,.85)); }
.pi_bg._left._type_lh   { background:linear-gradient(to right, rgba(205,43,22,.85), rgba(205,43,22,.10)); }
.pi_bg._right._type_lh  { background:linear-gradient(to left,  rgba(17,103,231,.85), rgba(17,103,231,.10)); }

/* keep _bright on ribbon as a mild highlight (no sweep here) */
.pi_bg._bright { filter: saturate(1.05) brightness(1.04); }

/* === RESULT section (shimmer lives here) === */
/* RESULT bar now MATCHES ribbon height so sweep covers full area */
.pi_title {
  width:100%;
  height:180rpx;                /* ⬅️ same as ribbon */
  display:flex;
  align-items:center;           /* vertically center badge+label inside the bar */
  justify-content:space-between;
  position:relative;
  z-index:2;
  padding:0;                    /* no padding; let children handle spacing */
}

.pi_ti_view{
  width:50%;
  position:relative;            /* for local shimmer */
  overflow:hidden;              /* confine sweep */
  display:flex; flex-direction:column; align-items:center; gap:8rpx;
  padding:0 40rpx;
}

/* shimmer ONLY here */
.pi_ti_view._bright::after{
  content:"";
  position:absolute; top:0; left:-150%;
  width:150%; height:100%;               /* ⬅️ covers full .pi_ti_view (now 180rpx) */
  background:linear-gradient(90deg, transparent, rgba(255,255,255,.22), transparent);
  pointer-events:none;
}
.pi_ti_view._left._bright::after  {  animation: ti_sweep_left  .6s linear infinite; }
.pi_ti_view._right._bright::after {  animation: ti_sweep_right .6s linear infinite; }

/* badge + label */
.pi_badge{
  width:74rpx; height:74rpx; border-radius:999px;
  display:grid; place-items:center;
  font-weight:700; font-size:60rpx; color:#fff;
  background:rgba(0,0,0,.38);
  // border:1rpx solid #fff;
  
}
.pi_label{
  font-size:@font-24; color:#fff;
  text-shadow: 0 -1px 0 #000, 1px 0 0 #000, 0 1px 0 #000, -1px 0 0 #000;
}
.pi_badge._blue  { background: rgba(17, 103, 231, .7); }
.pi_badge._red   { background: rgba(205, 43, 22, .7); }

/* === CARDS section === */
.pi_first {
  width:100%;
  display:flex;
  position:relative; z-index:2;
  padding-top:18rpx;   /* gap under results */
}

/* fixed height to avoid jumping when 3rd appears */
.pi_fi_view{
  width:50%;
  position:relative;
  padding:0 40rpx;
  height: calc(@cardH + @gap + @thirdH);
  display:flex; flex-direction:column; align-items:center;
  justify-content:flex-start;
}

/* top row centered */
.pi_flexrow{
  display:flex; gap:@gap; justify-content:center; align-items:flex-start;
  height:@cardH;
}

/* cards */
.pi_fi_vi_poker{ width:@cardW; height:@cardH; border-radius:4rpx; overflow:hidden; }

/* 3rd card bottom-center (doesn't push layout) */
.pi_fi_vi_poker._isBuPai{
  width:@thirdW; height:@thirdH;
  position:absolute; left:50%; bottom:0; transform:translateX(-50%);
  border-radius:4rpx; overflow:hidden;
}
.pi_fi_vi_poker._isBuPai .img-normal{
  width:@cardW; height:@cardH;
  position:absolute; top:-10px; left:((@thirdW - @cardW)/2);
  transform:rotate(90deg); transform-origin:center;
}
</style> -->
