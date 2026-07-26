function calculateFine(borrowDate, returnDate) {
  const allowedDays = 14;
  const finePerDay = 5; // ₹5 per day late, adjust as you like

  const msInOneDay = 1000 * 60 * 60 * 24; // 86,400,000

  const diffInMs = returnDate - borrowDate;          // difference in milliseconds
  const daysElapsed = Math.floor(diffInMs / msInOneDay); // convert to whole days

  const daysLate = daysElapsed - allowedDays;

  if (daysLate <= 0) {
    return 0; // returned on time or early, no fine
  }

  return daysLate * finePerDay;
}

module.exports = calculateFine;