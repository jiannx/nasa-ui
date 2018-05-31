function loadScript(url, cb) {
  let script = document.createElement('script');
  script.type = 'text/javascript';
  if (script.readyState) {
    script.onreadystatechange = function() {
      if (script.readyState === 'loaded' || script.readyState === 'complete') {
        script.onreadystatechange = null;
        cb && cb();
      }
    };
  } else {
    script.onload = function() {
      cb && cb();
    };
  }
  script.src = url;
  document.body.appendChild(script);
}

// 异步加载 echart
// let echarts = await loadEcharts(echart库地址);
export function loadEcharts(url) {
  return new Promise((resolve, reject) => {
    if (window.echarts) {
      resolve(window.echarts);
    } else {
      loadScript(url, function() {
        if (window.echarts) {
          resolve(window.echarts);
        } else {
          reject('please check echarts url');
        }
      });
    }
  }).catch(e => {
    console.error('LoadEcharts: ', e);
  });
}