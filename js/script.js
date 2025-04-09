import conditions from "./conditions.js"; //импортируем данные о кодах погоды

const apiKey = "cdbe5dda072545808d0125020250604";

// Элементы страницы
const header = document.querySelector(".header"); // для генерации карточки после шапки (см. f showCard)
const form = document.querySelector("#form"); // для слушания отправки формы
const input = document.querySelector("#input"); // для получения значений, введённых юзером

// Функции для структурирования кода
function removeCard(){ // функция удаления предыдущий карточек
    const prevCard = document.querySelector('.card'); // берём предыдущую карточку
    if (prevCard) prevCard.remove(); // если предыдущая есть - удаляем

    const prevCard2 = document.querySelector('.card1');//если есть начальная карточка
    if (prevCard2) prevCard2.remove();//удаляем
}

function showError(errorMessage) { // функция выведения ошибки
    //удаление предыдущего выведения ошибки. Избежание накладывания
    const prevErr = document.querySelector('.error-card');
    if (prevErr) prevErr.remove();

    //отобразить карточку с ошибкой
    const html = `<div class="error-card">${errorMessage}</div>`; // пишем структуру карточки
    header.insertAdjacentHTML('afterend', html); // выводим на страницу
}

function showCard(name, temp, humidity, wind_kph, imgPath) { // функция выведения карточки
        //Если была выведена ошибка - удалить
        const prevErr = document.querySelector('.error-card');
        if (prevErr) prevErr.remove();

        // Разметка карточки
        const html = `
        <div class="card" id = "card">
            <h2>${name}</h2>
            <div class="temp-img">
                <p class="temp">${temp}°C</p>
                <img draggable="false" class="weather-icon" src= ${imgPath} alt="weather"></img>
            </div>
            <div class="bottomEl">
                <div class="humidity">
                    <p class="humidity-value">${humidity}</p>
                    <img draggable="false" class="humidity-icon" src="./img/humidity.png" alt="humidity"></img>
                </div>
                <div class="speed">
                    <p class="speed-value">${wind_kph} kph</p>
                    <img draggable="false" class="speed-icon" src="./img/storm.png" alt="speed"></img>
                </div>
            </div>
        </div>`;

    //отображаем карточку на странице
    header.insertAdjacentHTML('afterend', html);
}








// Слушаем отправку формы
form.onsubmit = function (e) {
    // Отменяем отправку формы (обновление страницы)
    e.preventDefault();

    // Берём значение из инпута
    let city = input.value.trim(); //обрезаем пробелы .trim()

    // очищаем поле ввода
    document.querySelector('#input').value = "";    

    // формируем адрес запроса
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

    // Выполняем запрос
    fetch(url).then((response) => {
        return response.json()
    }).then((data) => {
        // Провека на ошибку
        if (data.error) { // если в данных есть объект error
            // Удаляем предыдущие карточки
            removeCard();
            //отображаем карточку с ошибкой
            showError(data.error.message);
        }else{
            // Удаляем предыдущие карточки
            removeCard();

            // для каждого объекта (obj) находим его код
            const info = conditions.find(function(obj){
                if (obj.code === data.current.condition.code) return true;
            })

            
            //формируем путь иконок погоды
            let filePath = "";
            if (data.current.is_day){//если день
                filePath = 'day' //в пути будет папка день
            } else {
                filePath = 'night' //иначе - ночь
            }
            
            let fileName = info.code; //записываем код в перменную
            
            
            //формируем ссылку на иконку 
            //example: ./img/day/1066.png
            let imgPath = ('./img/' + filePath + '/' + fileName + ".png");// получаем название картинки

            //показываем карточку, передавая ей полученные данные
            showCard(
                data.location.name, //название города
                data.current.temp_c, //темература
                data.current.humidity, //давление
                data.current.wind_kph, //скорость ветра
                imgPath); //ссылку на соответствующую иконку погоды

            // функция, в зависимости от кода ставит градиент
            function fon (arr, card_gr, back_gr){
                for (let i=0; i<=arr.length; i++){
                    if (fileName == arr[i]){
                        document.getElementById('card').style.background = card_gr;
                        document.body.style.background = back_gr;
                    }
                }
            }


            // сортируем коды по погоде, чтоб поставить соответствующий фон
            let fiol = ['1063', '1072', '1150', '1153', '1168', '1171', '1180', '1183', '1186', '1189', '1192', '1195', '1198', '1201', '1240', '1243', '1246'];
            let groz = ['1276', '1087', '1273', '1279', '1282'];
            let oblac = ['1009', '1030', '1135', '1147'];
            let sneg = ['1117', '1114', '1066', '1069', '1204', '1207', '1210', '1213', '1216', '1219', '1222', '1225', '1237', '1249', '1252', '1255', '1258', '1261', '1264'];
            let nach = ['1000', '1003', '1006'];
            //вызываем функцию, передавая список, градиент карточки и градиент фона
            fon(fiol, 'linear-gradient(315deg, rgba(31,34,169,1) 0%, rgba(140,169,231,1) 100%)', 
                'linear-gradient(90deg, rgba(29,31,168,1) 0%, rgba(147,178,235,1) 100%)');

            fon(groz, 'linear-gradient(135deg, rgba(25,138,177,1) 0%, rgba(59,69,94,1) 100%)', 
                'linear-gradient(90deg, rgba(59,69,94,1) 0%, rgba(24,140,179,1) 100%)');

            fon(oblac, 'linear-gradient(315deg, rgba(255,255,255,1) 0%, rgba(95,121,129,1) 100%)', 
               'linear-gradient(90deg, rgba(90,117,126,1) 0%, rgba(217,217,217,1) 100%)');

            fon(sneg, 'linear-gradient(135deg, rgba(25,153,157,1) 0%, rgba(248,254,254,1) 100%)', 
                'linear-gradient(270deg, rgba(25,153,157,1) 0%, rgba(248,254,254,1) 100%)');

            fon(nach, 'linear-gradient(135deg, rgba(183,236,255,1) 0%, rgba(70,114,220,1) 100%)', 
                'linear-gradient(90deg, rgba(70,114,219,1) 0%, rgba(184,237,255,1) 100%)');
            
    }
    })
}
