/**
 * @author  Hiram
 * @date    2020-10-05
 * @version 1.2
 * @file    scheduleHtmlProvider.js
 * @title 台州职业技术学院-台州职业技术学院综合教学管理系统-超星系统-小爱课表导入
 *
 * Description①: 除函数名外都可编辑
 * Description②: 输入课程页面的document对象，从页面中提取课程信息的HTML片段，输出HTML字符串
 * Description③: 以下为示例，您可以完全重写或在此基础上更改
 */


/**
 * 解析页面获取课程表，并提供给scheduleHtmlParser.js文件处理
 *
 * @param iframeContent
 * @param frameContent
 * @param dom
 * @returns {string}
 */
function scheduleHtmlProvider(iframeContent = "", frameContent = "", dom = document) {
    // 定义document获取课程节点
    const documentResult = dom.querySelector('iframe[name=iframe7]')
    return documentResult.contentWindow.document.body.innerHTML
}