import moment from "moment";

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const formatDateToLocal = (
    dateStr: string,
    locale: string = 'en-US',
) => {
    const date = moment(dateStr, moment.defaultFormat).toDate();
    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    };
    const formatter = new Intl.DateTimeFormat(locale, options);
    return formatter.format(date);
};

export const formatNumber = (value: number, fractionDigits: number = 0) => {
    return Intl.NumberFormat("de-DE", {maximumFractionDigits: fractionDigits}).format(value);
}

export const humanFileSize = (bytes, decimals: number = 2) => {
    if (bytes == 0) return '0 Bytes';
    var k = 1024,
        dm = decimals || 2,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
