# 基于百度的翻译插件

一个用于 **[Koishi v3](https://github.com/koishijs/koishi)** 的百度翻译插件。

~~这个插件我只在qq上用，其他平台不保证能用~~

## 安装

``` shell
  npm i koishi-plugin-bdtrans --save
```
之后根据 **[Koishi v3](https://github.com/koishijs/koishi)** 进行安装。

## 使用方式

### 翻译文字
```
  bdtrans <text> [-f en] [-t zh]
```
**text** 需要翻译的文本，如果中间有空格请用引号

**-f** 源语言，默认自动识别

**-t** 目标语言，默认中文

### 翻译图片

```
  bdtrans-i 图片 [-f jp] [-t zh]
```
**图片** 图片前后务必留空格，上传本地图片务必使用QQ自带的上传图片功能，否则会变成上传群文件

**-f** 源语言，默认日语 ~~为什么是日语，因为群友老是发Twitter图片我才弄的这个插件~~

**-t** 目标语言，默认中文

## 插件配置项
| 选项        |            说明                        |
| --------------- |   --------------------------- |
| `appid`  | 百度翻译开发者APP ID |
| `sk` |  百度翻译开发者 秘钥                 |

[申请开发者账号](https://fanyi-api.baidu.com/api/trans/product/desktop)

百度翻译API，识图翻译前1w次是免费的，高级版通用翻译也是前200w字符免费
