module.exports = (number, decimals = 0) => {
    if (decimals > 0) {
        return number.toLocaleString('en-US', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: decimals
        });
    } else {
        return number.toLocaleString('en-US', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }
}