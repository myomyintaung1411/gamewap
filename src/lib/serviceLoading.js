const startLoading = (title)=> {
  uni.showLoading({
    mask: true,
    title: title || '',
  })
}

const endLoading = ()=> {
  uni.hideLoading();
}

let _needLoadingRequestCount = 0
export const showFullScreenLoading = (title) => {
  if (_needLoadingRequestCount === 0) {
    startLoading(title);
  }

  _needLoadingRequestCount += 1;
}

export const tryHideFullScreenLoading = ()=> {
  if (_needLoadingRequestCount <= 0) return;

  _needLoadingRequestCount -= 1;
  if (_needLoadingRequestCount === 0) {
    endLoading();
  }
}
