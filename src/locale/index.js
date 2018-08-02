import en from './en-US.js';
import zh from './zh-CN.js';
import Cookies from 'js-cookie';
import _ from 'lodash';

const locales = {
  "en-US": en,
  "zh-CN": zh,
};

let currentData;
let currentLang;

function setLocales(lang, cb) {
  if (!lang) {
    lang = Cookies.get('nasa-ui-lang') || 'zh-CN';
  }
  if (!locales[lang]) {
    console.error(`nasa-ui locale error: ${lang} is invalid, please set 'en-US' | 'zh-CN'`);
    return;
  }

  Cookies.set('nasa-ui-lang', lang);
  currentLang = lang;
  currentData = locales[lang];
  cb && cb();
}

setLocales();

function getCurrentLocale() {
  return currentLang;
}

function get(key, data) {
  let msg = currentData[key] ? currentData[key] : key;
  // 替换花括号中的key值
  if (data && _.isObject(data)) {
    let keys = Object.keys(data);
    keys.forEach(k => {
      msg = msg.replace(`{${k}}`, data[k]);
    });
  }
  return msg;
}

export default {
  get,
  setLocales,
  getCurrentLocale,
}