const username = document.querySelector('#username')
const saveUsernameBtn = document.querySelector('#saveUsernameBtn');

username.addEventListener('keyup', () => {
if (username.value != ""){
    console.log('field filled');
    saveUsernameBtn.disabled = false;
} else {
    console.log('field empty');
    saveUsernameBtn.disabled = true;
}
})