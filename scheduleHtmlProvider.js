/**
 * @author  王宇海
 * @date    2020-10-05
 * @version 1.1
 * @file    scheduleHtmlProvider.js
 * @title 台州职业技术学院-台州职业技术学院综合教学管理系统-超星系统-小爱课表导入  
 * 
 * Description①: 除函数名外都可编辑
 * Description②: 输入课程页面的document对象，从页面中提取课程信息的HTML片段，输出HTML字符串
 * Description③: 以下为示例，您可以完全重写或在此基础上更改
 */

function scheduleHtmlProvider(iframeContent = "", frameContent = "", dom = document) {
    return dom.querySelector('iframe[name=iframe7]').contentWindow.document.body.innerHTML
}