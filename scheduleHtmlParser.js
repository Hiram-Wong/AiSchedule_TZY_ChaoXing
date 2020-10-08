/**
 * @author  Hiram
 * @date    2020-10-05
 * @version 1.2
 * @file    scheduleHtmlParser.js
 * @title 台州职业技术学院-台州职业技术学院综合教学管理系统-超星系统-小爱课表导入
 *
 * Description①: 除函数名外都可编辑
 * Description②: 传入的参数为上一步函数获取到的html
 * Description③: 可使用正则匹配
 * Description④: 可使用解析dom匹配，工具内置了$，跟jquery使用方法一样，直接用就可以了，参考：https://juejin.im/post/5ea131f76fb9a03c8122d6b9
 * Description⑤: 以下为示例，您可以完全重写或在此基础上更改
 */


/**
 * 主程序[输入课程页面的HTML字符串，提取课程信息，按约定的格式输出JSON]
 *
 * @param html
 * @returns {[]}
 */
function scheduleHtmlParser(html) {
    // 加载cheerio
    const $ = cheerio.load(html, {
        decodeEntities: false
    })

    let course = []
    let courseInfos = []
    let time = []

    // 夏令时
    const summerTime = [
        {"section": 1, "startTime": "08:00", "endTime": "08:40"},
        {"section": 2, "startTime": "08:50", "endTime": "09:30"},
        {"section": 3, "startTime": "09:50", "endTime": "10:30"},
        {"section": 4, "startTime": "10:40", "endTime": "11:20"},
        {"section": 5, "startTime": "11:30", "endTime": "12:10"},
        {"section": 6, "startTime": "14:00", "endTime": "14:40"},
        {"section": 7, "startTime": "14:50", "endTime": "15:30"},
        {"section": 8, "startTime": "15:40", "endTime": "16:20"},
        {"section": 9, "startTime": "16:30", "endTime": "17:10"},
        {"section": 10, "startTime": "19:00", "endTime": "19:40"},
        {"section": 11, "startTime": "19:50", "endTime": "20:30"}
    ]

    // 冬令时
    const winterTime = [
        {"section": 1, "startTime": "08:00", "endTime": "08:40"},
        {"section": 2, "startTime": "08:50", "endTime": "09:30"},
        {"section": 3, "startTime": "09:50", "endTime": "10:30"},
        {"section": 4, "startTime": "10:40", "endTime": "11:20"},
        {"section": 5, "startTime": "11:30", "endTime": "12:10"},
        {"section": 6, "startTime": "13:30", "endTime": "14:10"},
        {"section": 7, "startTime": "14:20", "endTime": "15:00"},
        {"section": 8, "startTime": "15:10", "endTime": "15:50"},
        {"section": 9, "startTime": "16:00", "endTime": "16:40"},
        {"section": 10, "startTime": "18:30", "endTime": "19:10"},
        {"section": 11, "startTime": "19:20", "endTime": "20:00"}
    ]

    // 遍历所有有效课程单元格
    $('table[class="table-bordered"] > tbody').find('td[rowspan][class="cell"]').each(function () {
        // 判断是否多个课程存在一个单元格内[主要用来处理形势与政策]
        const page = $(this).find('a').length / 3
        for (let i = 0; i < page; i++) {
            // 课程
            const name = $(this).find(`a:nth-child(${2 + i * 8})`).text()
            // 教室
            const position = $(this).find(`a:nth-child(${7 + i * 8})`).text()
            // 老师
            const teacher = $(this).find(`a:nth-child(${4 + i * 8})`).text()
            // 第几周
            const weeks = $(this).children()[4 + i * 8].next.data
            const week = weeksParser(weeks)
            // 星期几
            const days = $(this).attr('id')
            const day = dayParser(days).startDay
            // 第几节
            const sections = parseInt($(this).attr('rowspan'))

            // 判断冬令时或夏令时作息时间
            dateIf ? time = summerTime : time = winterTime
            course = dataParser(courseInfos, time)
            course = {
                courseInfos: courseInfos,
                sectionTimes: time
            }

            const section = sectionsParser(dayParser(days).startSection, sections)
            // courseInfos
            const obj = {
                name: name,
                position: position,
                teacher: teacher,
                weeks: week,
                day: day,
                sections: section
            }
            courseInfos.push(obj)
        }
    })
    console.info(course)
    return course

    /**
     * 解析课时周数信息
     *
     * @param time
     * @returns {[]}
     */
    function weeksParser(time) {
        const week = []
        time = time.replace(/周/, "")
        const startTime = parseInt(time.split('-')[0])
        const endTime = parseInt(time.split('-')[1])
        for (let i = startTime; i <= endTime; i++) {
            week.push(i)
        }
        return week
    }

    /**
     * 解析课时节数信息
     *
     * @param startSection
     * @param middle
     * @returns {[]}
     */
    function sectionsParser(startSection, middle) {
        const sections = []
        for (let i = startSection; i <= startSection + middle - 1; i++) {
            sections.push(time[i - 1])
        }
        return sections
    }

    /**
     * 解析课时星期几和第几节上课信息
     *
     * @param data
     * @returns {{startDay: number, startSection: number}}
     */
    function dayParser(data) {
        const day = data.replace(/Cell/, "")
        const startDay = parseInt(day[0])
        const startSection = parseInt(day.substr(1))
        return {
            startDay: startDay,
            startSection: startSection
        }
    }

    /**
     * 解析课表信息
     *
     * @param courseInfos
     * @param sectionTimes
     * @returns {{sectionTimes: *, courseInfos: *}}
     */
    function dataParser(courseInfos, sectionTimes) {
        return {
            courseInfos: courseInfos,
            sectionTimes: sectionTimes
        }
    }

    /**
     * 判断作息表采用夏令时还是冬令时
     *
     * @returns {boolean}
     */
    function dateIf() {
        const date = new Date()
        const month = date.getMonth()
        const day = date.getDate()
        return month >= 9 && day >= 9
    }
}