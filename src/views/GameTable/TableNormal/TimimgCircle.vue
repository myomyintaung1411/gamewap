<template>
  <view
    class="timer"
    :style="{ width: `${size}rpx`, height: `${size}rpx` }"
    aria-label="timer"
  >
    <!-- SVG progress ring -->
    <svg :width="size" :height="size" viewBox="0 0 100 100" class="ring">
      <!-- background dark disk -->
      <circle cx="50" cy="50" r="50" :fill="innerBg" />
      <!-- track (thin grey circle) -->
      <g transform="rotate(-90 50 50)">
        <circle
          class="track"
          cx="50" cy="50" :r="r"
          :stroke="track" :stroke-width="sw"
          fill="none"
          :stroke-dasharray="dashArray"
          :stroke-dashoffset="gap" />
        <!-- progress (yellow arc) -->
        <circle
          class="progress"
          cx="50" cy="50" :r="r"
          :stroke="color" :stroke-width="sw"
          fill="none"
          :stroke-linecap="rounded ? 'round' : 'butt'"
          :stroke-dasharray="dashArray"
          :stroke-dashoffset="dashOffset" />
      </g>
      <!-- number -->
      <text x="50" y="56" text-anchor="middle" class="digits" :fill="textColor">
        {{ displayValue }}
      </text>
    </svg>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  /** seconds elapsed/remaining depending on mode */
  value: { type: Number, required: true },
  /** total seconds of the phase */
  total: { type: Number, default: 60 },
  /** ring size in px */
  size:  { type: Number, default: 66 },
  /** stroke width in SVG units (relative to viewBox) */
  stroke: { type: Number, default: 8 },
  /** make ends rounded like the screenshot */
  rounded: { type: Boolean, default: true },
  /** colors */
  color: { type: String, default: '#f6c028' },      // yellow arc
  track: { type: String, default: 'rgba(255,255,255,.25)' },
  innerBg: { type: String, default: 'rgba(0,0,0,.55)' },
  textColor: { type: String, default: '#f6c028' },
  /** 'down' -> arc shrinks; 'up' -> arc grows  */
  mode: { type: String, default: 'down' },
  /** small visual gap in the ring (degrees worth of stroke) */
  gapDeg: { type: Number, default: 6 }
})

const r  = computed(() => 46 - props.stroke / 2) // radius inside 100x100 viewBox
const sw = computed(() => props.stroke)
const C  = computed(() => 2 * Math.PI * r.value)

// convert tiny angular gap to dash values for a single-break circle
const gap = computed(() => (props.gapDeg / 360) * C.value)
const dashArray = computed(() => `${C.value - gap.value} ${gap.value}`)

// clamp value and compute progress ratio
const ratio = computed(() => {
  const v = Math.max(0, Math.min(props.value, props.total))
  return props.mode === 'down' ? (v / props.total) : (1 - (props.total - v) / props.total)
})

// stroke offset so the arc length matches the ratio
const dashOffset = computed(() => (C.value - gap.value) * (1 - ratio.value) + gap.value)

const displayValue = computed(() => Math.max(0, Math.floor(props.value)))
</script>

<style scoped>
.timer { position: relative; }
.ring  { display: block; }
.track { transition: stroke 0.2s; }
.progress {
  transition: stroke-dashoffset 0.2s linear; /* smooth tick */
}
.digits {
  font-size: 34px;
  font-weight: 700;
  dominant-baseline: middle;
}
</style>
