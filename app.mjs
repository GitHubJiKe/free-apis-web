$(document).ready(() => {
    const APIKEY = $('meta[id="APIKEY"]').attr('content')
    const POEM_URL = 'https://apis.tianapi.com/duishici/index'
    const ENG_QUOTE = 'https://apis.tianapi.com/enmaxim/index'
    const ENG_EVERYDAY = 'https://apis.tianapi.com/everyday/index'
    const PYQ_URL = 'https://apis.tianapi.com/pyqwenan/index'

    let apiURl = POEM_URL;
    $('body').html(`
    <div id="app">
        <select id="apiSelect" name="api">
            ${[[POEM_URL, '诗词问答'], [ENG_QUOTE, '英语格言'], [ENG_EVERYDAY, '每日英语'], [PYQ_URL, '朋友圈文案']].map(v => `<option value="${v[0]}">${v[1]}</option>`).join('')}
        </select>
        <button id="refreshBtn">刷新</button>
        <div class="poemQuest"> </div>
        <div id="colors"></div>
    </div>
    `)
    const colors = ['#1685a9', '#177cb0', '#065279', '#003472', '#4b5cc4', '#a1afc9', '#2e4e7e', '#4a4266', '#426666']
    $('#colors').html(`
        ${colors.map(color => `<div style="background-color:${color}"></div>`).join('')}
    `)

    $("#apiSelect").on('change', (event) => {
        const target = $(event.target); // 获取点击的元素
        const api = target[0]['value'];
        apiURl = api;
        fetchData()
    })

    $('#colors>div').on('click', (event) => {
        const target = $(event.target); // 获取点击的元素
        const backgroundColor = target.css("background-color"); // 获取元素的背景色
        $('.poemQuest').css('background-color', backgroundColor)
    })

    const savePng = (filename) => {
        $('#download').hide()
        const backgroundColor = $('.poemQuest').css("background-color");
        console.log(backgroundColor);
        html2canvas($('.poemQuest')[0], { backgroundColor }).then(function (canvas) {
            canvas.toBlob((blob) => {
                saveAs(blob, filename)
            })
        });
    }
    const fetchPoem = () => {
        $.ajax(`${apiURl}?key=${APIKEY}`).done((data) => {
            if (data && data.code === 200) {
                const { quest, answer, source } = data.result
                $('.poemQuest').html(`
                <h3>下一句是什么，你知道吗？<i id="download" text="下载">→</i></h3>
                <div class="poem">
                    <div class="quest">${quest}，</div>
                    <div class="answer">${answer}</div>
                    <div class="source">${source}</div>
                </div>
           `)

                $('#download').on('click', () => {
                    savePng("poemQuest.png")
                })
            } else {
                $('.poemQuest').html(`<h3>${data.msg}</h3>`)
            }
        })
    }
    const fetchPyq = () => {
        $.ajax(`${apiURl}?key=${APIKEY}`).done((data) => {
            if (data && data.code === 200) {
                const { content, source } = data.result
                let showSource = !content.includes('——') && source !== ''
                $('.poemQuest').html(`
                <h3>今日分享<i id="download" text="下载">→</i></h3>
                <div class="poem">
                    <div>${content}</div>
                    <div class="source ${showSource ? 'show' : 'hide'}"> —— ${source}</div>
                </div>
           `)

                $('#download').on('click', () => {
                    savePng("pyqQuote.png")
                })
            } else {
                $('.poemQuest').html(`<h3>${data.msg}</h3>`)
            }
        })
    }

    const fetchEngQuote = () => {
        $.ajax(`${apiURl}?key=${APIKEY}`).done((data) => {
            if (data && data.code === 200) {
                const { en, zh } = data.result
                $('.poemQuest').html(`
                <h3>英文格言<i id="download" text="下载">→</i></h3>
                <div class="poem">
                    <div class="en">${en}</div>
                    <div class="zh">${zh}</div>
                </div>
           `)

                $('#download').on('click', () => {
                    savePng("engQuote.png")
                })
            } else {
                $('.poemQuest').html(`<h3>${data.msg}</h3>`)
            }
        })
    }

    fetchPoem()

    const fetchEngEveryDay = () => {
        $.ajax(`${apiURl}?key=${APIKEY}`).done((data) => {
            if (data && data.code === 200) {
                const { content, note, date } = data.result
                $('.poemQuest').html(`
                <h3>每日英语 - ${date} <i id="download" text="下载">→</i></h3>
                <div class="poem">
                    <div class="en">${content}</div>
                    <div class="zh">${note}</div>
                </div>
           `)

                $('#download').on('click', () => {
                    savePng("engEveryDay.png")
                })
            } else {
                $('.poemQuest').html(`<h3>${data.msg}</h3>`)
            }
        })
    }
    const fetchData = () => {
        if (apiURl === POEM_URL) {
            fetchPoem()
        }

        if (apiURl === ENG_QUOTE) {
            fetchEngQuote()
        }

        if (apiURl === ENG_EVERYDAY) {
            fetchEngEveryDay()
        }

        if (apiURl === PYQ_URL) {
            fetchPyq()
        }
    }

    $("#refreshBtn").on('click', fetchData)

})