export default {
  replace: (url)=> {
    ['views/Login/Index', '/'].includes(url)
      ? uni.reLaunch({ url:'/views/Login/Index', })
      : uni.redirectTo({ url:url, })
  },
  push: (url)=> {
    const _pages = getCurrentPages();
    // if (_pages[_pages.length - 1].route === 'views/GameTable/Index') uni.redirectTo({ url:url })
    if (_pages[_pages.length - 1].route === 'views/GameTable/TableNormal/Index') uni.redirectTo({ url:url })
    else uni.navigateTo({ url:url, })
  },
  back: ()=> {
    // #ifdef APP-PLUS
      // window.history.go(-1);
      uni.navigateBack();
    // #endif
    // #ifndef APP-PLUS
      history.back();
    // #endif
  },
}
