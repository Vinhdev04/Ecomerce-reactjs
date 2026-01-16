 const saveDataToLocalStorage = (type,data)=> {
    localStorage.setItem(`${type}`, JSON.stringify(data));
    // console.log('📤 Lưu thông tin người dùng vào localStorage:', data);
}
  export default saveDataToLocalStorage;