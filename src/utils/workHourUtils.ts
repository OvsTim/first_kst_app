import dayjs from 'dayjs';
import 'dayjs/plugin/customParseFormat';
import 'dayjs/plugin/isBetween';

dayjs.extend(require('dayjs/plugin/customParseFormat'));
dayjs.extend(require('dayjs/plugin/isBetween'));
export function getWorkHoursStringByMap(map: Record<string, string>) {
  let res = '';
  //обратная мапа режим работы - день недели
  let typedHours: Record<string, string> = {};
  //идем по мапе день недели - режим работы
  for (let key in map) {
    //если в типизированной мапе нет такого, то кладем
    if (!typedHours[map[key]]) {
      typedHours[map[key]] = key;
    } else {
      //если есть, приделываем день недели
      typedHours[map[key]] = typedHours[map[key]] + ', ' + key;
    }
  }

  //если одинаковое время, то значит ежедневно
  if (Object.keys(typedHours).length === 1) {
    return Object.keys(typedHours)[0] + ' - ' + 'ежедневно';
  }

  //иначе собираем строку
  for (let key in typedHours) {
    res = res + key + ' - ' + typedHours[key] + '\n';
  }

  return res;
}

export function getWorkingNow(map: Record<string, string>) {
  //берем сегодняшнее время день и часы работы
  let todayDay = dayjs().day(new Date().getDay()).format('dd');
  let todayTime = dayjs(
    new Date().getHours() + '.' + new Date().getMinutes(),
    'HH.mm',
  );
  let todayHours = map[todayDay[0].toUpperCase() + todayDay[1]];

  if (todayHours.toLowerCase() === 'выходной') {
    return 'Закрыто';
  } else {
    //вытаскиваем начальный и конечный час
    let startHour = dayjs(todayHours.substr(0, 5), 'HH.mm');
    let endHour = dayjs(todayHours.substr(6, todayHours.length - 1), 'HH.mm');

    // let formattedCurrent = todayTime.format('HH:mm');
    // let formattedStart = startHour.format('HH:mm');
    let formattedEnd = endHour.format('HH:mm');
    if (
      dayjs(todayTime).isAfter(startHour) &&
      dayjs(todayTime).isBefore(endHour)
    ) {
      return 'Открыто до ' + formattedEnd;
    } else {
      return 'Закрыто';
    }
  }
}

export function getTodayWorkingHour(map: Record<string, string>) {
  let todayDay = dayjs().day(new Date().getDay()).format('dd');

  return map[todayDay[0].toUpperCase() + todayDay[1]];
}
