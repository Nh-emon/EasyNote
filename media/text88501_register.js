function showAlert(msg,icon,type){
	const alertContainer = get('#reg-alert-container')
	alertContainer.innerHTML = `
		<div class="alert alert-${type} text-start" id="#reg-alert">
			<i class="fa-solid fa-${icon} me-1"></i>
			<span>${msg}</span>
		</div>`
}



const reg = get('#reg')
const regSubmitBtn = get('#reg-submit-btn')


Trigger(reg,'submit',async(e)=>{
    e.preventDefault()

    let reg_github_username = get('#reg-github-username').value
    let reg_github_token = get('#reg-github-token').value
    let reg_password = get('#reg-password').value

    if(!(reg_github_username && reg_github_token && reg_password)){
     showAlert('please fill all input','triangle-exclamation','warning')
     return ;
    }

    if(reg_password.length < 6){
     showAlert('password must contain at least 6 charcters','triangle-exclamation','warning')
     return ;      
    }

    try{
      regSubmitBtn.disabled = true
      regSubmitBtn.value = 'checking github...'
        let user_details_response = await fetch(`https://api.github.com/users/${reg_github_username}`)
        let user_details_result = await user_details_response.json()
        if(!(user_details_result.login === reg_github_username)){
               showAlert(`no github user found with username ${reg_github_username}`,'circle-xmark','danger')
                  regSubmitBtn.disabled = false
                  regSubmitBtn.value = 'submit'
                  return ;               
        }
        let users_token_response = await fetch(`https://api.github.com/users/${reg_github_username}`,{
         headers:{'Authorization':`token ${reg_github_token}`}
        })
        let users_token_result = await users_token_response.json()
        if(!(users_token_result.login === reg_github_username)){
               showAlert(`invalid token`,'circle-xmark','danger')
                  regSubmitBtn.disabled = false
                  regSubmitBtn.value = 'submit'
                  return ;               
        }
      regSubmitBtn.value = 'submitting...'
        
    }catch(err){
      console.log(err)
     showAlert('connection failed','wifi-slash','warning')
     return ;            
    }

    let formData = new FormData(reg)
    let options = {
        method:'POST',
        body:formData
    }
    try{
       let reg_submit_response = await fetch('registerAuthHandler.php',options)
       let reg_submit_result = await reg_submit_response.json()
       if(reg_submit_result.status === 'ok'){
         showAlert('account created','circle-check','success')
         regSubmitBtn.value = 'redirecting to login'
         setTimeout(()=>{
            window.location.href = 'login.php'
         },2000)
         return ;                              
       }else{
            showAlert(reg_submit_result.message,'circle-xmark','danger')
            regSubmitBtn.disabled = false
            regSubmitBtn.value = 'submit'
            return ;                     
       }
    }catch(error){
                  showAlert('submit failed','circle-xmark','danger')
                  regSubmitBtn.disabled = false
                  regSubmitBtn.value = 'submit'
                  console.log(error)                  
                  return ;                     
    }

})
