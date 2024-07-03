import dayjs from 'dayjs';
import 'dayjs/locale/sv';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

export const datetime = dayjs;
datetime.extend(relativeTime);
datetime.extend(duration);
datetime.extend(localizedFormat);
datetime.extend(utc);
datetime.extend(timezone);
