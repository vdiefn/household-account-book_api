import dayjs from "dayjs";
import "dayjs/locale/zh-tw.js";

dayjs.locale("zh-tw");
dayjs().format();

export const formatDate = (date) => {
  return dayjs(date).format("YYYY/MM/DD");
};

export const getStartOfMonth = () => {
  return dayjs().startOf("month").format("YYYY-MM-DD");
};

export const getEndOfMonth = () => {
  return dayjs().endOf("month").format("YYYY-MM-DD");
};
