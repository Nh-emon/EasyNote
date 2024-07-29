let isOnline = true
let isPopUpexits = false
let countDownTimer = 10;
let countDownInterval;

function showOnlinePopUp(networkPopUp){
            networkPopUp.innerHTML = `
            <div id="popUpHeader" class="flex">
            <i class="fa-solid fa-wifi title round_btn_any success" id="wifiIcon"></i>
            <p class="title">Connection Restore</p>
            </div>
            <div id="popUpMessage">You are currently <span class="green">online</span></div>`
setTimeout(()=>{
    document.body.removeChild(networkPopUp)
    isPopUpexits = false
        },4000)
}


function startCountDown(networkPopUp){
countDownInterval = setInterval(()=>{
        countDownTimer --
    if(!isOnline){
        // if network became true it will not execute
    const countDownEl = networkPopUp.querySelector('#coundDownEL')
    countDownEl.innerText = countDownTimer;        
    }
    if(countDownTimer ==0 && !isOnline){
        // if countDown is 0 and still offline
        // countDownTimer =10;
        checkConnection()
    }
    if(isOnline){
        // on offline clear this interval
        clearInterval(countDownInterval)
    }
},1000)
}


function addingCss(networkPopUp){
networkPopUp.style.cssText = 'width: 100%;max-width:600px;background-color:var(--boxBg);padding:2rem 1rem;position:absolute;top: 0;left:50%;transform: translate(-50%,0)'
networkPopUp.querySelector('#popUpMessage').style.cssText = 'margin: 1rem;font-size:1.2rem'
networkPopUp.querySelector('#coundDownEL').style.cssText = 'color:var(--secondaryColor);font-size:1.5rem;font-weight: 500'    
}



function showOfflinePopUp(){
const networkPopUp = document.createElement('div')
networkPopUp.classList.add('border_min','radius_mid','shadow_mid')
networkPopUp.setAttribute('id','networkPopUp')
networkPopUp.innerHTML = `
    <div id="popUpHeader" class="flex">
    <i class="fa-solid fa-wifi title round_btn_any" id="wifiIcon"></i>
    <p class="title">Lost Connection</p>
    </div>
    <div id="popUpMessage">You are currently <span class="red">offline</span> .We will attempt to reconnect you in <span id="coundDownEL">10</span> seconds</div>
    <button class="btn" id="reconnectBtn">Reconnect</button>`
document.body.appendChild(networkPopUp)            
addingCss(networkPopUp)
isPopUpexits = true 
startCountDown(networkPopUp)
networkPopUp.querySelector('#reconnectBtn').addEventListener('click',()=>{
    // clearInterval(countDownInterval)
    checkConnection()
})

}



const handlePopUp = (status)=>{
    // on online
    if(status){
        // if any popupexist that we want to chagne its innerhtml
        if(isPopUpexits){
         const networkPopUp = document.querySelector('#networkPopUp')
         showOnlinePopUp(networkPopUp)
        }
    }
    // on offline
    else{
        if(!isPopUpexits){
        // if any popUp does not exist
            showOfflinePopUp()
        }
    }
}

const checkConnection  = async()=>{
    try{
   const response = await fetch("https://jsonplaceholder.typicode.com/posts")
   isOnline = response.status>=200 && response.status<=300;
   // if response status is grater than 200 and less that 300 then status becase true
    }catch(error){
        isOnline=false
    }    
    countDownTimer = 10;
    handlePopUp(isOnline)
}

setInterval(()=> isOnline && checkConnection(),5000)

