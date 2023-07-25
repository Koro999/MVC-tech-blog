module.exports = {
  format_date: (date) => {
    // Format date as MM/DD/YYYY
    return date.toLocaleDateString();
  },

  // // Custom helper 'format_date' that takes in a timestamp,
  // format_date: (date) => {
  //   // adds five years to the date, and formats it as M/D/YYYY
  //   const month = new Date(date).getMonth()+1;
  //   const day = new Date(date).getDate();
  //   const year = new Date(date).getFullYear();

  //   return `${month}/${day}/${year}`;
  // },
  format_time: (date) => {
    // format large numbers with commas
    return date.toLocaleTimeString();
  },

  // format_plural: (word, amount) => {
  //   if(amount !== 1) {
  //     return `${word}s`;
  //   }
  //   return word;
  // },

};