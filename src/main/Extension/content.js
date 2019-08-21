
// Только при помощи content.js можно читать информацию со страницы (придирка chrome)
// Сообщение от  popup.js
chrome.runtime.onMessage.addListener(function(request, sender){

    console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");

    var url = window.location.href;//url текущей страницы
    //если текущая страница содержит следующий путь
    // Проверка на то, нужный ли это сайт (на самом деле в background.js прописано ограничение)
    if (url.indexOf("http://localhost:63342/Extension/src/main/resources/") != -1) {
        // Документ с резалюуией
        // Получение блока с именем текущего пользователя
        var usr = document.getElementsByClassName("user")[0].innerText;
        var arr = usr.split(', '); // Разбиение строки с ФИО формата "Добрый день, Фамилия И.О."
        usr = arr[1]; // Получение Фамилия И.О. пользователя
        console.log(usr);

        var title = document.getElementsByClassName("b2")[0].innerText; // получение номера документа
        var date = document.getElementsByClassName("b2")[1]
            .getElementsByTagName("span")[0].innerText; // Получение даты документа

        console.log("Title: " + title);
        console.log("Date: " + date);

        //Обработка блока резолюций
        var res = document.getElementById("resolution-tree");
        var u = res.getElementsByTagName('u');
        var t='';
        var num = 0;//порядковый номер <u> подрезолюции пользователя

        //Перебор всех <u>, которые обозначают инициаторов подрезолюций
        for (var i=0; i < u.length; i++) {
            var r = u[i].innerText;//Текст текущей перебираемой строки с инициатором
            //Если инициатор подрезолюции совпадает с пользователем
            if (r.indexOf(usr) != -1) {
                t=u[i].innerText;
                num=i;
            }
        }

        //Извлечение текста подрезолюции
        var d1 = u[num].parentNode;//переход к родительскому div-title
        var d2 = d1.parentNode;//переход к родительскому div-head
        var d3 = d2.nextElementSibling;//переход к соседнему div
        var d4 = d3.firstElementChild;

        var desc = d4.innerHTML.split('</span> - ');//Получение текста подрезолюции (Удаление лишних символов)
        var txt_r= desc[1];//Получение текста подрезолюции

        var spans = d4.getElementsByTagName("span"); // Получение хранилищ с именами людей, кому отправлена резолюция
        var persons = [];

        // Сохраненире имен людей в списко
        for(var i = 0; i<spans.length; i++){
            console.log("innerHTML: " + spans[i].innerHTML);
            persons.push(spans[i].innerHTML);
        }

        // Передача всей информации в ханилище chrome, чтоб достать ее в background.js
        chrome.storage.sync.set({title: title, date: date, text: txt_r, persons: persons});

        console.log(persons);
        console.log(txt_r);

        //chrome.tabs.create( {url:"https://kss.tatneft.ru/company/personal/user/12863/tasks/task/edit/0/"} );
        //Отправка сообщения обратно в расширение
        // chrome.runtime.sendMessage({txt: txt_r}, function(response) {
        //     //console.log(response.farewell);
        // });

        chrome.runtime.sendMessage({message: "create_new_url"});
    }
});


