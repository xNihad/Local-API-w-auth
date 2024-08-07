const registerForm = document.querySelector("#register")
const usernameInp = document.querySelector("#username")
const emailInp = document.querySelector("#email")
const passwordInp= document.querySelector("#password")

registerForm.addEventListener('submit', async function(e){

    e.preventDefault()
    let newUser = {
        username: usernameInp.value,
        email: emailInp.value,
        password: passwordInp.value 
    }

    let response = await axios.post("http://localhost:7777/users/register", newUser)
    // console.log(response.headers["auth-tokensss"]);
    let token = response.headers["auth-tokensss"]

    if(token){
        localStorage.setItem("tokenzzz", token)
        window.location.href="login.html"
    }  
})