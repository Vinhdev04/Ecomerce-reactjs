import Cookies from 'js-cookie';
const setCookies = (name, value) => {
  const expires = new Date(Date.now() + 5 * 60 * 1000);

  Cookies.set(name, value, {
    expires,
    secure: true,
    sameSite: 'strict'
  });
};

export default setCookies;