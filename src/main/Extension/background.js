// Только в background.js можно создавать новую вкладку.

chrome.runtime.onInstalled.addListener(function() {

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        // Ссылка, по которой расширение должно быть доступно пользователю
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {
                    hostEquals: 'http://localhost:63342/extension/src/main/resources/*'}
                    // schemes: ['file']}
            })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });

});

// Сообщение от content.js об создании новой вкладки
chrome.runtime.onMessage.addListener(function(request){

    if(request.message === "create_new_url") {
        // Нужно поставить нужную <OutLook_url>, ссылка на создание новой задачи может быть другой
        chrome.tabs.create({url: "https://<OutLook_Url>/owa/?ae=Item&a=New&t=IPM.Task"},
            function (newTab) {
            chrome.storage.sync.set({tabId: newTab.id});
        });
    }
});

// Проверка всех новых открытых вкладок
chrome.tabs.onUpdated.addListener(function (tabId , info) {
    chrome.storage.sync.get(["tabId"], function (object) {

        if (info.status === 'complete' && tabId === object.tabId) {
            chrome.storage.sync.get(["title", "date", "persons", "text"], function(data) {

                console.log("Start function");

                var day = data.date.split(".")[0];
                var month = data.date.split(".")[1];
                var year = data.date.split(".")[2];

                chrome.tabs.executeScript(tabId, {
                        //// Установка темы
                    code: ( "document.getElementById('txtSubj').value = " + ("'" + data.title + "'") + "\n" +
                        //// Устанеовка даты
                        // Берем даты из документа (резолюции)
                        // "var day_doc = " + day + ";\n" +
                        // "var month_doc = " + month + ";\n" +
                        // "var year_doc = " + year + ";\n" +
                        "var day_doc = 8;\n" +
                        "var month_doc = 6;\n" +
                        "var year_doc = 2019;\n" +
                        "console.log(\"day_doc \" + day_doc);\n" +
                        "console.log(\"month_doc \" + month_doc);\n" +
                        "console.log(\"year_doc \" + year_doc);\n" +

                        // Получаем контейнер с календарем Даты начала
                        "var divSDateDP = document.getElementById(\"divSDateDP\");\n" +
                        // Получаем контиейнер с сегодняшним месяцем
                        "var dpMonth = divSDateDP.getElementsByClassName(\"dpMonth\")[0];\n" +
                        // Узнаем какой сегодня год и месяц
                        "var year_now = dpMonth.getAttribute(\"y\");\n" +
                        "var month_now = dpMonth.getAttribute(\"m\");\n" +
                        "console.log(\"Today year \" + year_now);\n" +
                        "console.log(\"Today month \" + month_now);\n" +
                        // Узнаем разницу годов и месяцев
                        "var year_dif = (year_now - year_doc);\n" +
                        "var month_dif = (month_now - month_doc);\n" +
                        "console.log(\"year_dif \" + year_dif);\n" +
                        "console.log(\"month_dif \" + month_dif);\n" +

                        //// Функция для клика по нужной дате
                        "function dayClick(dpMonth){\n" +
                            // Берем список недель
                        "   dpWeek = dpMonth.getElementsByClassName(\"dpWeek\");\n" +
                            // В месяце на 0 неделе могут находится дни за прошлый месяц
                            // Если день < 9 он 100% находится на 0 или 1 неделе
                        "   if(day_doc < 9){\n" +
                        "       for(var i=0; i<2; i++){\n" +
                                    // Получаем числа дней на неделе
                        "           var dpDayNum = dpWeek[i].getElementsByClassName(\"dpDayNum\");\n" +
                        "           for(var j=0; j<dpDayNum.length; j++){\n" +
                                        // Если это нужный день. Кликаем по нему чтобы сработал скрипт на сайте
                        "               if(dpDayNum[j].innerHTML == day_doc){\n" +
                        "                   dpDayNum[j].click();\n" +
                        "               }\n" +
                        "           }\n" +
                        "       }\n" +
                             // Если день > 21 он 100% находится на 3 и далее неделях
                        "   } else if(day_doc>21){\n" +
                        "       for(var i=3; i<6; i++){\n" +
                                    // Получаем числа дней на неделе
                        "           var dpDayNum = dpWeek[i].getElementsByClassName(\"dpDayNum\");\n" +
                        "           for(var j=0; j<dpDayNum.length; j++){\n" +
                                        // Если это нужный день. Кликаем по нему чтобы сработал скрипт на сайте
                        "               if(dpDayNum[j].innerHTML == day_doc){\n" +
                        "                   dpDayNum[j].click();\n" +
                        "               }\n" +
                        "           }\n" +
                        "       }\n" +
                            // Во всех остальных случаях можем просто пройтись по неделям и найти наш день
                        "   } else {" +
                        "       for(var i=0; i<6; i++){\n" +
                                    // Получаем числа дней на неделе
                        "           var dpDayNum = dpWeek[i].getElementsByClassName(\"dpDayNum\");\n" +
                        "           for(var j=0; j<dpDayNum.length; j++){\n" +
                                        // Если это нужный день. Кликаем по нему чтобы сработал скрипт на сайте
                        "               if(dpDayNum[j].innerHTML == day_doc){\n" +
                        "                   dpDayNum[j].click();\n" +
                        "               }\n" +
                        "           }\n" +
                        "       }\n" +
                        "    }\n" +
                        "}\n" +

                        "if(year_dif==0){\n" +
                            // Если задача в OutLook заполняется в тот же год и месяц
                        "   if(month_dif==0){\n" +
                                // Вызываем нашу функцию клика
                        "       dayClick(dpMonth);\n" +
                        "   } else {\n" + // if(month_dif==0)
                            // Если Outlook задача заполняется на какое-то число месяцев позже то нужно активировать
                            // скрипт по созданию контейнера с нужным месяцем
                        "       if(month_dif>0){\n" +
                        "           for(var i=0; i<month_dif; i++){\n" +
                                        // Получаем котейнер с кнопками по смене месяка
                        "               dpHdr = dpMonth.getElementsByClassName(\"dpHdr\")[0];\n" +
                                        // Получаем кнопку на смену к позднему месяцу и кликаем по ней чтоб активировать скрипт
                        "               fltLeft = dpHdr.getElementsByClassName(\"fltLeft\")[0];\n" +
                        "               console.log(fltLeft);\n" +
                        "               fltLeft.click();\n" +
                        "               function check(){\n" +
                        "                   if(dpMonth.nextElementSibling==null){\n" +
                        "                       setTimeout(check, 1000);\n" +
                        "                       return;\n" +
                        "                   }\n" +
                        "               }\n" +
                        "           }\n" +
                        "           dpMonth = dpMonth.nextElementSibling;\n" +
                        "           dayClick(dpMonth);\n" +
                        "       }\n" +
                        // "   } else if(Math.abs(month_dif)<4){\n" + // if(month_dif==0)
                        //     // Получаем родительский контейнер календаря Даты начала
                        // "       var divDP = divSDateDP.parentNode;\n" +
                        //     // Получаем контейнер через который можно переключать месяцы(ближайшие 3) и годы(ближайшие 2)
                        // "       var divMnthLst = divDP.previousElementSibling;\n" +
                        //     // Получаем контейнер с нужным месяцем
                        // "       console.log(divMnthLst);\n" +
                        // "       var dpMnuItm = divMnthLst.querySelector('[y=\"2019\"][m=\"7\"]');\n" +
                        //     // Кликаем по контейнеру, чтобы скрипт сайта создал контейнер с нужным месяцем
                        // "       dpMnuItm.getElementsByClassName('nowrap')[0].click(function(){" +
                        //             // Получаем только что созданный контейнер
                        // "           dpMonth = dpMonth.nextElementSibling;\n" +
                        // "           dayClick(dpMonth)\n" +
                        // "       });\n" +
                        // "       console.log(dpMnuItm.getElementsByClassName('nowrap')[0]);\n" +
                        "   }\n" + // else Месяца
                        "}\n" + // if(year_dif==0)

                        // Установка текста
                        // Текст передается, но не сохраняется
                        "document.getElementById('txtBdy').value = " + ("'" + data.text + "'") + ";\n")
                });

                // var divSDateDP = document.getElementById("divSDateDP");
                // var month = divSDateDP.querySelector('[y="2019"][m="8"]');
                // console.log(month);
                //
                // var dpDayNum = month.getElementsByClassName("dpDayNum");
                // for(var i = 0; i<dpDayNum.length; i++) {
                //     if(dpDayNum[i].innerHTML.indexOf("19")){
                //         dpDayNum[i].click();
                //     }
                // }

                chrome.storage.sync.clear().executeCallback();

            });
        }
    });

});