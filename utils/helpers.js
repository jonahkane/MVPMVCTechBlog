function formatDate(date) {
  return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(
      date
    ).getFullYear()}`;
}


module.exports = {
  formatDate
}
//provides time date stamp for when entries/comments are created