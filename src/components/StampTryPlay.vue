<template>
<div class='stp_model'>

  <div class='stp_view'>
    {{t("road.demo") }}
  </div>

</div>
</template>
<script setup name='StampTryPlay'>
import { useI18n } from "vue-i18n";
const { t } = useI18n();

</script>
<style lang='less' src='@front/zstyles/components/StampTryPlay.less' scoped></style>
