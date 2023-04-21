const logout = document.querySelector('#logout');

logout.addEventListener('click', async (e) => {
e.preventDefault();
try {
  const response = await fetch('/api/users/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });

  if (response.ok) {
    document.location.replace('/');
  } else {
    alert('Failed to log out. Route broken!');
  }
}catch (err) {
  console.log(err);
}
});