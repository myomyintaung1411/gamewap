<template>
	<view class="password-style">

		<!-- <view title="修改登录密码" class="top-style" color="#ffffff" >
            <view class='back-icon' @tap='_navigateBack'>
              <SvgIcon name='back-lobby' size='22' />
            </view>
			<view class="title-password">修改登录密码</view>
		</view> -->
        <TheNavbar :title='t("sideList.passchange")' />

		<view class="original-password">
			<view class="password-title">{{t("bet_rec.old_p")}}</view>
            <input class='password-text'  :placeholder='t("bet_rec.old_p")' v-model='_form.originPass'  />
			<view class="password-title">{{t("bet_rec.new_p")}}</view>
            <input class='password-text'  :placeholder='t("bet_rec.pass_place")' v-model='_form.newPass'  />
			<view class="password-title">{{t("bet_rec.confirm_p")}}</view>
            <input class='password-text'  :placeholder='t("bet_rec.pass_place")' v-model='_form.confirmPass'  />
			<view class="prompt-style">
				{{t("bet_rec.forget_tip")}}<text class="prompt-customer" @click="_clickCustomerService">{{t("bet_rec.service")}}</text>
			</view>
			<view class="">
				<button class="confirm-style" :disabled='_loading' @click="_confirmModify">
					{{t("bet_rec.confirm_")}}
				</button>
			</view>
		</view>
	</view>

    <TheMsg />

</template>
<script setup name="ChangePassword">
import { ref, computed } from 'vue';
import TheNavbar from '@front/components/TheNavbar/Index.vue';
import TheMsg from '@front/components/TheMsg.vue';
import { req_userUpdatePassword } from '@front/services/login.service';
import { encryptStr } from '@front/utils/jsEncrypt';
import { useUserStore } from '@front/stores/modules/user.store';
import { md5Encrypt } from '@front/utils/tools';
// import router from '@front/routers';
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const userStore = useUserStore();

const _form = ref({originPass: '',newPass: '',confirmPass: ''}),
      _loading = ref(false),
      _canSubmit  = computed(()=> (
        _form.value.originPass &&
        _form.value.newPass &&
        _form.value.confirmPass &&
        ( _form.value.newPass === _form.value.confirmPass )
      ));

function _clickCustomerService(){
    uni.navigateTo({
        url: '/views/SideContent/OnlineService'
    })
}
// function _navigateBack(){
//     // uni.navigateTo({
//     //     url: '/views/Lobby/Index'
//     // })
//     router.back();
// }
async function  _confirmModify(){
    if(!_form.value.originPass){
        return window.$msg('请输入验证原登录密码', 2000);
    }
    if(!_form.value.newPass){
        return window.$msg('请输入新登录密码', 2000);
    }
    if(!_form.value.confirmPass){
        return window.$msg('请确认新登录密码', 2000);
    }
    const regex = /^[A-Za-z0-9]{6,16}$/;
    if(!regex.test(_form.value.newPass) || !regex.test(_form.value.confirmPass)){
        return window.$msg('请输入6-20位登录密码(大小写字母、数字或组合)', 2000);
    }
    if(!_canSubmit.value){
        return window.$msg('密码输入有误，请检查', 2000);
    }
    if(_loading.value) return
    _loading.value = true;
    uni.showLoading({ mask:true, title:'请求中' });
    const _nonce = 'nonce' + Math.floor(Math.random() * 99999 + 1),
          _timeStamp = Date.now();
    const _result = await req_userUpdatePassword(
    encryptStr(_form.value.originPass),
    encryptStr(_form.value.newPass),
    encryptStr(_nonce),
    _timeStamp,
    md5Encrypt(`${_form.value.originPass}${_form.value.newPass}${_nonce}${_timeStamp}`),
  );
  _loading.value = false;
  uni.hideLoading();
  if (!_result.success) return window.$msg(_result.msg, 3000);

  window.$msg(_result.msg, 3000);
  userStore.userLoginOut();
}
</script>
<style lang='less' src='@front/zstyles/views/Lobby/SideContent/ChangePassword.less' scoped></style>