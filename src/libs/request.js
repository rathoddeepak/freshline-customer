import lang from 'assets/lang';
const ApiUrl = 'http://192.168.225.235/FoodBazzar/app_api.php?type=';
//const ApiUrl = 'http://jioproxy.clufter.com/app_api.php?type=';
const request = {
 isBlank(str) {return (!str || /^\s*$/.test(str))},
 countWords(str) {return str.split(' ').filter((n) => { return n != '' }).length},
 removeSpaces(str) {    
    str = str.replace(/\s+/g, " ");
    str = str.replace(/^[ ]+|[ ]+$/g,'');
    return str;
 },
 vegName(type, i){
    if(type == 1)return lang.z[i].vg;
    else if(type == 2)return lang.z[i].nnvg;
    else return lang.z[i].bth;
 },
 isValidName(userInput) {   
    var regex = /^[\p{L}\p{M}]+([\p{L}\p{Pd}\p{Zs}'.]*[\p{L}\p{M}])+$|^[\p{L}\p{M}]+$/u;
    return regex.test(userInput);  
 },
 api_url(){
    return ApiUrl;
 },
 site_url(){
    return 'https://clufter.com/';
 },
 async perform(code, details){  
    var formBody = [];
    for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    return fetch(ApiUrl+code, {
    method: 'POST',
    timeout: 4000,    
    headers: {
    'Accept': 'application/json',    
    'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formBody})
    //.then((response) => response.json())
    .then((response) => response.text())
    .then((res) => {      
      //alert(res)
      console.log(res)
      return JSON.parse(res);
      //return res;
    })
    .catch((error)=>{
      return 'fetch_error';
    });
  },
  photoCats(){
    return [
        'ext',
        'int',
        'kit',
        'dsk',
        'tbl',
        'stf'       
    ];    
  }
}

export default request;