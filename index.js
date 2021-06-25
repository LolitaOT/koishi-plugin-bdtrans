const { segment } = require('koishi')
const Translate = require('./src/translate')

module.exports.name = 'bdtrans'
module.exports.apply = async (ctx,{ appid,sk }) => {
  const logger = ctx.logger('bdtrans')

  if(!appid || !sk) {
    logger.error('请传入appid和sk！')
    return
  }
  const translate = new Translate({ appid,sk })
  // translate.text('how are you \n im fine thank')
  ctx.command('bdtrans/bdtrans-i','百度识图翻译')
    .action(async ( { session, options} ) => {
      let data = segment.from(session.content, {type: 'image'})
      if(!data) {
        const dispose = session.middleware( async ({ content }, next) => {
          dispose();
          const image = segment.from(content, {type: "image"});
          if (!image || !image.data.url) {
            return next();
          } else {
            const [f,reply,error] = await translate.image(image.data.url,options.to,options.from)
            session.send(reply) 
            if(!f) {
              logger.error(error)
            }
          }
          // return searchUrl(session, code2.data.url, callback);
        });
        return '请上传图片'
      } else {
        // console.log(data.data.url)
        const [f,reply,error] = await translate.image(data.data.url,options.to,options.from)
        if(!f) logger.error(error)
        return reply
      }
    })
    .usage('注意：\n1.发送图片时要与指令之间最少有一个空格，且发送本地图片时要使用自带的发送本地图片功能，不然会变成上传到群文件\n2.支持的语言：' + Array.from(translate.translateMap.values()).join(','))
    .option('to','-t <to:string> 目标语言,默认中文', { fallback: 'zh' })
    .option('from','-f <from:string> 源语言,默认日语', { fallback: 'jp' });
  ctx.command('bdtrans <text>', '百度翻译插件')
    .action(async ( { options },text ) => {
      
      const [f,reply,error] = await translate.text(text,options.to,options.from)
      if(f) logger.error(error)
      return reply
    })
    .usage('注意：\n1.中间有空格的句子请用引号\n2.支持的语言：' + Array.from(translate.translateMap.values()).join(','))
    .option('to','-t <to:string> 目标语言,默认中文', { fallback: 'zh' })
    .option('from','-f <from:string> 源语言,默认自动识别', { fallback: 'auto' })
    .example('bdtrans "im fine thank you"')
}

