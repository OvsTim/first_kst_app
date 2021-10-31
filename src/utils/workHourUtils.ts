import dayjs, {Dayjs} from 'dayjs';
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

  return res.slice(0, -1);
}

export function getWorkingNow(map: Record<string, string>) {
  //берем сегодняшнее время день и часы работы
  let todayDay;
  let todayTime = dayjs(
    new Date().getHours() + '.' + new Date().getMinutes(),
    'HH.mm',
  );
  let todayHours;
  let isNight: boolean = false;
  //если сейчас ночь то берем вчерашний режим работы
  if (todayTime.isBefore(dayjs(new Date()).startOf('day').add(5, 'hours'))) {
    isNight = true;
    todayDay = dayjs().day(new Date().getDay()).add(-1, 'day').format('dd');
    todayHours = map[todayDay[0].toUpperCase() + todayDay[1]];
  } else {
    //иначе сегодняшний
    todayDay = dayjs().day(new Date().getDay()).format('dd');
    todayHours = map[todayDay[0].toUpperCase() + todayDay[1]];
  }

  if (todayHours.toLowerCase() === 'выходной') {
    return 'Закрыто';
  } else {
    //вытаскиваем начальный и конечный час
    let startHour;
    let endHour;
    //если ночь, для коррекции вычислений добавляем минус один день
    if (isNight) {
      startHour = dayjs(todayHours.substr(0, 5), 'HH.mm').add(-1, 'day');
      endHour = dayjs(todayHours.substr(6, todayHours.length - 1), 'HH.mm').add(
        -1,
        'day',
      );
    } else {
      startHour = dayjs(todayHours.substr(0, 5), 'HH.mm');
      endHour = dayjs(todayHours.substr(6, todayHours.length - 1), 'HH.mm');
    }

    //если конечный меньше, прибавляем день
    if (endHour < startHour) {
      endHour = endHour.add(1, 'day');
    }

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
  let todayDay;
  let todayTime = dayjs(
    new Date().getHours() + '.' + new Date().getMinutes(),
    'HH.mm',
  );
  //если сейчас ночь то берем вчерашний режим работы
  if (todayTime.isBefore(dayjs(new Date()).startOf('day').add(5, 'hours'))) {
    todayDay = dayjs().day(new Date().getDay()).add(-1, 'day').format('dd');

    return map[todayDay[0].toUpperCase() + todayDay[1]];
  } else {
    //иначе сегодняшний
    todayDay = dayjs().day(new Date().getDay()).format('dd');

    return map[todayDay[0].toUpperCase() + todayDay[1]];
  }
}
