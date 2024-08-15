import moment from "moment";
import { ValuePiece } from "../meeting";

// YYYY-MM-DD -> YYYY년 MM월 DD일
export function formatDate(input) {
    let dateString;

    if (input instanceof Date) {
        const year = input.getFullYear();
        const month = String(input.getMonth() + 1).padStart(2, '0');
        const day = String(input.getDate()).padStart(2, '0');
        dateString = `${year}-${month}-${day}`;
    } else if (typeof input === 'string') {
        dateString = input;
    } else {
        throw new Error('Input must be a Date object or a string');
    }

    const [year, month, day] = dateString.split('-');

    const formattedMonth = parseInt(month, 10);
    const formattedDay = parseInt(day, 10);

    return `${year}년 ${formattedMonth}월 ${formattedDay}일`;
}



// YYYY-MM-DD 
export function formatSendDate (date: ValuePiece | [ValuePiece, ValuePiece]): string {
    if (date instanceof Date) {
      return moment(date).format("YYYY-MM-DD");
    } else if (Array.isArray(date) && date[0] instanceof Date) {
      return moment(date[0]).format("YYYY-MM-DD");
    }
    return '';
  };
