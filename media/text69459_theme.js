
const themeBtnContainer = document.querySelector('#themeBtnContainer')
const lightBtn = document.querySelector('#lightMode')
const darkBtn = document.querySelector('#darkMode')
const root =document.querySelector(':root')
const chatBox = document.querySelector('#chatBox')
                                                             /* light mode */
function changeToLight(){
    root.style.setProperty('--bodyBg','rgb(255,255,255)')
    root.style.setProperty('--bodyFOnt', 'rgb(0, 0, 0)')
    root.style.setProperty('--bodyFOntLight','rgba(124, 121, 140, 0.773)')
    root.style.setProperty('--ContainerBg','rgba(229, 228, 240, 0.775)')
    root.style.setProperty('--boxBg','rgba(245, 245, 245,.8)')
    root.style.setProperty('--boxBorder','rgba(74, 73, 80, 0)')/* no border in lightMode */
    root.style.setProperty('--boxShadow','rgba(128, 128, 128, 0.399)')    
}

function changeToDark(){
    root.style.setProperty('--bodyBg','rgb(6, 2, 28)')
    root.style.setProperty('--bodyFOnt', 'rgb(252, 252, 252)')
    root.style.setProperty('--bodyFOntLight','rgba(177, 173, 195, 0.229)')
    root.style.setProperty('--ContainerBg','rgba(10, 9, 26, 0.943)')
    root.style.setProperty('--boxBg','rgba(68, 56, 115, 0.252)')
    root.style.setProperty('--boxBorder','rgba(74, 73, 80, 0.252)')
    root.style.setProperty('--boxShadow','rgba(58, 29, 106, 0)')/* no shadow in darkMOd */
}


lightBtn.addEventListener('click',()=>{
    themeBtnContainer.classList.add('active')
    changeToLight()
})
// dark mode
darkBtn.addEventListener('click',()=>{
    themeBtnContainer.classList.remove('active')
    changeToDark()
})

document.addEventListener("keydown", function(event) {
  if (event.altKey && event.key === "t") {
    themeBtnContainer.classList.toggle('active')
    if(themeBtnContainer.classList.contains('active')){
        changeToLight()
    }else{
        changeToDark()
    }
  }

  if (event.altKey && event.key === "o") {
    chatBox.classList.toggle('active')
  }

});



// start toastSecion
let isPopUpexits = false

const toastNotification = document.querySelector('.toastNotification')
const toastData = {
    success:{icon:"fa-check",toastColor:"rgb(100,255,100)"},
    error:{icon:"fa-circle-xmark",toastColor:"rgb(220,20,60)"},
    warning:{icon:"fa-warning",toastColor:"rgb(255,100,0)"},
    info:{icon:"fa-info",toastColor:"rgb(0,0,255)"},
    clipboard:{icon:"fa-clipboard",toastColor:"rgb(255,255,255)"},    
}

const removeToast =(toast)=>{
    toast.style.display = 'none'
    isPopUpexits = false
}

function createToast (type,message) {

    const toast = document.createElement('div')
    toast.classList.add('toast',type,'border_min','shadow_max')
    let icon = toastData[`${type}`].icon
    let toast_color = toastData[`${type}`].toastColor
    toast.innerHTML = ` <i class="fa-solid ${icon}" id="toastLogo"></i>
                        <span class="toastMessage">${message}</span>
                        <button class="round_btn" id="closeToast"><i class="fa-solid fa-xmark"></i></button>`
toast.querySelector('#toastLogo').style.color = `${toast_color}`                        
toast.style.setProperty('--beforeColor',`${toast_color}`)
if(!isPopUpexits){
toastNotification.appendChild(toast)    
isPopUpexits = true;
}

document.querySelectorAll("#closeToast").forEach(toastCloseBtn=>{
          toastCloseBtn.addEventListener('click',()=>{
                toastCloseBtn.parentNode.style.display = 'none';
          })
// currently created toast
   setTimeout(()=>removeToast(toast),3500)          

})

}
// toast example
// anyBtn.addEventListener('click',()=>{
//     createToast('success',"form fill up successfully")
//     createToast('type',"message")
// })
// end toastExpale

// loading animtaion 
document.querySelector('.loader').innerHTML =
   `<div class="load one"></div>
    <div class="load two"></div>
    <div class="load three"></div>`
// how to use it
// any element with class .loader
// control width,height,display 
// 1.display:none to remove
// 2. .loader is the parent and .load is the child so .loader size is :width:8rem;height: 3rem and .load size is width:1.7rem;height:1.7rem;;

// html example     <div class='loader mid' id="gifLoad"></div>
//css example:#gifLoad{margin-top: .5rem;width: 0;opacity:0;overflow: hidden;}
// #gifLoad.active{width:2rem;opacity:1;overflow:visible;}
//cant use display none becasue we use display flex and loader 
 
