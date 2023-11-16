module.exports = (number) => {
    return number.toLocaleString('en-US', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}