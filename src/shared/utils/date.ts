import moment from "moment-timezone";

interface IDateUtils {
  BRtoISO(date?: string, tz?: string): string | undefined;
  getCurrentUTC(): string;
}

export default class DateUtils implements IDateUtils {
  BRtoISO(date_br?: string, tz = "America/Sao_Paulo"): string | undefined {
    if (!date_br || new Date(date_br).toString() === "Invalid Date") return;

    // Format the moment object as an ISO date string
    const date = moment(date_br, "YYYY-MM-DD HH:mm:ss");

    // Set the timezone
    date.tz(tz);

    // Convert to UTC+0
    const dtUtc = date.utc();

    // Format the moment object as an ISO date string
    return dtUtc.toISOString();
  }

  getCurrentUTC(): string {
    return moment().utc().toISOString();
  }
}

export const months = {
  jan: "01",
  fev: "02",
  mar: "03",
  abr: "04",
  mai: "05",
  jun: "06",
  jul: "07",
  ago: "08",
  set: "09",
  out: "10",
  nov: "11",
  dez: "12",
};

export const getMonthByBrStr = (monthBrStr: string) => months[monthBrStr.toLowerCase() as keyof typeof months];
