import moment from "moment";
import ru from 'moment/locale/ru'

/**
 * Форматирование строки стоимости
 * Добавляет пробелы через каждые 3 символа
 * пример 18354444 => 18 354 444
 * @param cost
 * @returns {string}
 */
export function formatCost(cost) {
    return cost.toString().replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ');
}

/**
 * Склонение
 * @param number
 * @param one
 * @param two
 * @param five
 * @returns {*}
 */
export function plural(number, one, two, five) {
    let n = Math.abs(number);
    n %= 100;
    if (n >= 5 && n <= 20) {
        return five;
    }
    n %= 10;
    if (n === 1) {
        return one;
    }
    if (n >= 2 && n <= 4) {
        return two;
    }
    return five;
}

/**
 * Форматирование даты
 * @param date
 * @param format
 * @returns {string}
 */
export function formatDate(date, format='D MMM') {
    moment.locale('ru');
    let m = moment(date);
    return m.format(format);
}

/**
 * Выдает случайный цвет в hex
 * @returns {string}
 */
export function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export function trunc(string, n){
    return string.substr(0,n-1)+(string.length>n?"...":'');
}