$(document).ready(() => {
    const APIKEY = $('meta[id="APIKEY"]').attr("content");
    const POEM_URL = "https://apis.tianapi.com/duishici/index";
    const ENG_QUOTE = "https://apis.tianapi.com/enmaxim/index";
    const ENG_EVERYDAY = "https://apis.tianapi.com/everyday/index";
    const PYQ_URL = "https://apis.tianapi.com/pyqwenan/index";
    const HISTPRY_URL = "https://apis.tianapi.com/lishi/index";

    let apiURl = "custom";
    $("body").html(`
    <div id="app">
        <select id="apiSelect" name="api">
            ${[
                ["custom", "自定义"],
                [POEM_URL, "诗词问答"],
                [ENG_QUOTE, "英语格言"],
                [ENG_EVERYDAY, "每日英语"],
                [PYQ_URL, "朋友圈文案"],
                [HISTPRY_URL, "那年今日"],
            ]
                .map((v) => `<option value="${v[0]}">${v[1]}</option>`)
                .join("")}
        </select>
        <button id="refreshBtn">刷新</button>
        <div class="poemQuest"> </div>
        <div id="colors"></div>
        <div id="fontColors"></div>
    </div>
    `);
    const colors = [
        "#fff",
        "#1685a9",
        "#177cb0",
        "#065279",
        "#003472",
        "#4b5cc4",
        "#a1afc9",
        "#2e4e7e",
        "#4a4266",
        "#426666",
    ];
    const fontColors = [
        "#fff",
        "#e9e7ef",
        "#f0f0f4",
        "#000",
        "#161823",
        "#312520",
    ];
    $("#colors").html(`
        ${colors
            .map((color) => `<div style="background-color:${color}"></div>`)
            .join("")}
    `);
    $("#fontColors").html(`
        ${fontColors
            .map(
                (color) =>
                    `<div style="background-color:${color};border-radius:50%;"></div>`,
            )
            .join("")}
    `);

    $("#apiSelect").on("change", (event) => {
        const target = $(event.target); // 获取点击的元素
        const api = target[0]["value"];
        apiURl = api;
        fetchData();
    });

    $("#colors>div").on("click", (event) => {
        const target = $(event.target); // 获取点击的元素
        const backgroundColor = target.css("background-color"); // 获取元素的背景色
        $(".poemQuest").css("background-color", backgroundColor);
    });
    $("#fontColors>div").on("click", (event) => {
        const target = $(event.target); // 获取点击的元素
        const color = target.css("background-color"); // 获取元素的背景色
        $(".poemQuest").css("color", color);
    });

    const savePng = (filename) => {
        $("#download").hide();
        const element = $(".poemQuest");
        const backgroundColor = element.css("background-color");
        const width = element.outerWidth(true);
        const height = element.outerHeight(true);
        console.log(height, width);
        html2canvas($(".poemQuest")[0], {
            backgroundColor,
            width,
            height,
        }).then(function (canvas) {
            canvas.toBlob((blob) => {
                saveAs(blob, filename);
            });
        });
    };
    const fetchPoem = () => {
        $.ajax(`${apiURl}?key=${APIKEY}`).done((data) => {
            if (data && data.code === 200) {
                const { quest, answer, source } = data.result;
                $(".poemQuest").html(`
                <h3>下一句是什么，你知道吗？<i id="download" text="下载">→</i></h3>
                <div class="poem">
                    <div class="quest">${quest}，</div>
                    <div class="answer">${answer}</div>
                    <div class="source">${source}</div>
                </div>
           `);

                $("#download").on("click", () => {
                    savePng("poemQuest.png");
                });
            } else {
                $(".poemQuest").html(`<h3>${data.msg}</h3>`);
            }
        });
    };
    const fetchPyq = () => {
        $.ajax(`${apiURl}?key=${APIKEY}`).done((data) => {
            if (data && data.code === 200) {
                const { content, source } = data.result;
                let showSource = !content.includes("——") && source !== "";
                $(".poemQuest").html(`
                <h3>今日分享<i id="download" text="下载">→</i></h3>
                <div class="poem">
                    <div>${content}</div>
                    <div class="source ${
                        showSource ? "show" : "hide"
                    }"> —— ${source}</div>
                </div>
           `);

                $("#download").on("click", () => {
                    savePng("pyqQuote.png");
                });
            } else {
                $(".poemQuest").html(`<h3>${data.msg}</h3>`);
            }
        });
    };

    const fetchEngQuote = () => {
        $.ajax(`${apiURl}?key=${APIKEY}`).done((data) => {
            if (data && data.code === 200) {
                const { en, zh } = data.result;
                $(".poemQuest").html(`
                <h3>英文格言<i id="download" text="下载">→</i></h3>
                <div class="poem">
                    <div class="en">${en}</div>
                    <div class="zh">${zh}</div>
                </div>
           `);

                $("#download").on("click", () => {
                    savePng("engQuote.png");
                });
            } else {
                $(".poemQuest").html(`<h3>${data.msg}</h3>`);
            }
        });
    };

    const fetchEngEveryDay = () => {
        $.ajax(`${apiURl}?key=${APIKEY}`).done((data) => {
            if (data && data.code === 200) {
                const { content, note } = data.result;
                $(".poemQuest").html(`
                <h3>每日英语  <i id="download" text="下载">→</i></h3>
                <div class="poem">
                    <div class="en">${content}</div>
                    <div class="zh">${note}</div>
                </div>
           `);

                $("#download").on("click", () => {
                    savePng("engEveryDay.png");
                });
            } else {
                $(".poemQuest").html(`<h3>${data.msg}</h3>`);
            }
        });
    };

    const fetchCustom = () => {
        $(".poemQuest").html(`
        <h3>每日分享 <i id="download" text="下载">→</i></h3>
        <div class="poem" contenteditable>
        </div>
   `);

        $("#download").on("click", () => {
            savePng("shareEveryDay.png");
        });
    };

    const fetchHistory = () => {
        $.ajax(`${apiURl}?key=${APIKEY}`).done((data) => {
            if (data && data.code === 200) {
                const { list } = data.result;
                let idx = 0;

                const setHtml = (idx) => {
                    const { title, lsdate } = list[idx];
                    $(".poemQuest").html(`
                <h3>那年今日 <label id="switch">${lsdate}</label> <i id="download" text="下载">→</i></h3>
                <div class="poem">
                    <div class="en">${title}</div>
                </div>
           `);

                    $("#switch").on("click", () => {
                        idx += 1;
                        setHtml(idx);
                    });
                    $("#download").on("click", () => {
                        savePng("historyEvents.png");
                    });
                };

                setHtml(idx);
            } else {
                $(".poemQuest").html(`<h3>${data.msg}</h3>`);
            }
        });
    };
    const fetchData = () => {
        if (apiURl === "custom") {
            return fetchCustom();
        }

        if (apiURl === HISTPRY_URL) {
            return fetchHistory();
        }

        if (apiURl === POEM_URL) {
            return fetchPoem();
        }

        if (apiURl === ENG_QUOTE) {
            return fetchEngQuote();
        }

        if (apiURl === ENG_EVERYDAY) {
            return fetchEngEveryDay();
        }

        if (apiURl === PYQ_URL) {
            return fetchPyq();
        }
    };
    fetchData();
    $("#refreshBtn").on("click", fetchData);
});
