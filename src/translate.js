const FormData = require('form-data');
const md5 = require('md5');
const axios = require('axios').default
const download = require('download');
const ERROR_MSG = '翻译时出现错误'
class Translate {
  cuid = 'APICUID'
  mac = 'mac'
  translateMap = new Map([
    ['zh', '中文'],
    ['en', '英语'],
    ['jp', '日语'],
    ['kor', '韩语'],
    ['fra', '法语'],
    ['spa', '西班牙语'],
    ['ru','俄语'],
    ['pt', '葡萄牙语'],
    ['de', '德语'],
    ['it', '意大利语'],
  ])
  constructor({ appid, sk }) {
    this.appid = appid 
    this.sk = sk
  }
  findTranslateKey(k) {
    if(!k) {
      return false
    }
    for (const [v, l] of this.translateMap) {
      if(v.indexOf(k) !== -1 || l.indexOf(k) !== -1) {
        return v
      }
    }
    return false
  }
  async text(text,to = 'zh',from = 'auto') {
    try {
      if(!text) {
        return [false,'请传入要翻译的文本']
      }
      from = from === 'auto' ? from : this.findTranslateKey(from)
      to = this.findTranslateKey(to)
      if(!to || !from) {
        return [false, '请输入正确的目标或源语言']
      }
      const salt = getRandomInt(1000001, 10000000).toString();
      const sign = md5(this.appid + text + salt + this.sk)
      const payload = {
        q: text,
        appid: this.appid,
        salt: salt,
        from,
        to,
        sign: sign
      }
      const { data } = await axios.request({
        url: 'http://api.fanyi.baidu.com/api/trans/vip/translate',
        method: 'get',
        params: payload,
      })
      if(data.error_code) {
        return [false, ERROR_MSG, data]
      }else {
        const text = data.trans_result.map(v => v.src).join('\n')
        const reply = data.trans_result.map(v => v.dst).join('\n')
        return [true, `${text}\n--------原文译文分隔线--------\n${reply}`]
      }
    }catch(e) {
      return [false, ERROR_MSG,e]
    }
  }
  async image(imageUri,to,from = 'jp') {
    try {
      to = this.findTranslateKey(to)
      from = this.findTranslateKey(from)
      if(!to || !from) {
        return [false,'请输入正确的目标或源语言']
      }
      const file = await download(imageUri)
      const salt = getRandomInt(1000001, 10000000).toString();
      const sign = md5(`${this.appid}${md5(file)}${salt}${this.cuid}${this.mac}${this.sk}`);
      const payload = new FormData()
      payload.append('from',from)
      payload.append('to',to)
      payload.append('appid',this.appid)
      payload.append('salt',salt)
      payload.append('cuid',this.cuid)
      payload.append('mac',this.mac)
      payload.append('sign',sign)
      payload.append('image',file,'imageName')
      const { data } = await axios.request({
        url: 'https://fanyi-api.baidu.com/api/trans/sdk/picture',
        method: 'POST',
        data: payload,
        headers: {
          ...payload.getHeaders()
        },
      })
      if(data.error_code !== '0') {
        return [false, ERROR_MSG , data]
      } else {
        const content = data.data.content
        const text = content.map(v => v.src).join('\n')
        // const reply = content.map(v => v.dst).join('\n')
        return this.text(text,to)
      }
    }catch(e) {
      return [false,ERROR_MSG,e]
    }
  }
}
// console.log(new Translate().findTranslateKey('or1'))
// new Translate().image(null,'英','中')
// new Translate().text('how are you \n im fine thank')
// new Translate().image('https://gchat.qpic.cn/gchatpic_new/476894213/3949266588-2233316736-769EC88ECA5D77ADAFB0F2CA76DB23BC/0?term=3','中','英')
// 得到一个两数之间的随机整数
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
}

module.exports = Translate