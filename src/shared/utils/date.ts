import moment from 'moment-timezone';

interface IDateUtils {
  BRtoISO(date?: string, tz?: string): string | null;
}

export default class DateUtils implements IDateUtils {

  BRtoISO(date_br?: string, tz = 'America/Sao_Paulo'): string | null {
    if (!date_br || (new Date(date_br)).toString() === 'Invalid Date') {
      return null;
    }

    // Format the moment object as an ISO date string
    const date = moment(date_br, "YYYY-MM-DD HH:mm:ss");

    // Set the timezone
    date.tz(tz);
    
    // Convert to UTC+0
    const dtUtc = date.utc();
    
    // Format the moment object as an ISO date string
    return dtUtc.toISOString();
  }
}
