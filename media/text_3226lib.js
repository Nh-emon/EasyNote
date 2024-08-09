
function print(val){
    console.log(val)
}

function get(element,child){
    if(child){return element.querySelector(child)}
    else{return document.querySelector(element)}}

function getAll(element,child){
    if(child){return element.querySelectorAll(child)}
    else{return document.querySelectorAll(element)}}

function trigger(El,callback){
    let el = typeof El === 'string' ? get(El) : El
    el.addEventListener('click',(e)=>callback(e))        
}

function Trigger(El,event,callback){
    let el = typeof El === 'string' ? get(El) : El
    el.addEventListener(`${event}`,(e)=>callback(e))        
}

function text(El,text,join){
    let el = typeof El === 'string' ? get(El) : El
    if(text || text === ''){
     if(join && join === true){
     el.innerText += text        
     }else{
        el.innerText = text
     }
    }else {
        return el.innerText
    }
}
function html(El,html,join){
    let el = typeof El === 'string' ? get(El) : El
    if(html || html === ''){
        if(join && join === true){
         el.innerHTML += html            
        }else{
         el.innerHTML = html            
        }
    }else{
        return el.innerHTML
    }
}
function attr(El,attr,value){
    let el = typeof El === 'string' ? get(El) : El
    if(value){
        el.setAttribute(attr,value)
    }else{
        return el.getAttribute(attr)
    }
}

function elClass(El,method,class_name,replace_class){
    let el = typeof El === 'string' ?  get(El) : El
    if(method === 'add'){
        if(!el.classList.contains(class_name)){
            el.classList.add(class_name)
        }
    }else if(method === 'remove'){
        if(el.classList.contains(class_name)){
            el.classList.remove(class_name)
        }
    }else if(method === 'toggle'){
        el.classList.toggle(class_name)
    }else if(method === 'has' || method === 'check'){
        return el.classList.contains(class_name)
    }else if(method === 'replace'){
       el.classList.remove(class_name)
       el.classList.add(replace_class)       
    }

}



function remove(El){
    let el = typeof El === 'string' ?  get(El) : El    
    el.parentNode.removeChild(el)
}

function create(el_type,el_obj,parent){
    let newEl = document.createElement(el_type)
    if(!el_obj || !parent) return newEl;

    if(el_obj){
    if(el_obj.class){
        let class_arr = stdText(el_obj.class).split(' ')
        class_arr.forEach(each_class=>elClass(newEl,'add',each_class) )
    }
    if(el_obj.attr){
        let attr_arr = stdText(el_obj.attr).split(' ')
        attr_arr.forEach(each_attr=>attr(newEl,each_attr.split('=')[0],each_attr.split('=')[1]))
    }
    if(el_obj.html){ html(newEl,el_obj.html)    }
    if(el_obj.text){ text(newEl,el_obj.text)    }        
    if(el_obj.id)  { attr(newEl,'id',el_obj.id) }                
    if(el_obj.src)  { attr(newEl,'src',el_obj.src) }                

    }
    if(parent){
     let parentEl = typeof parent === 'string' ?  get(parent) : parent            
     parentEl.appendChild(newEl)
    }
    return newEl
}


function stdText(text){
    return text.replace(/\s+/g, ' ').trim();
}

function redirectTo(El){
    let el = typeof El === 'string' ?  get(El) : El        
    let link = create('a')
    link.href = `#${el.id}`
    click(link)
}

function hide(El){
    let el = typeof El === 'string' ?  get(El) : El        
    elClass(el,'add','d-none')
}

function show(El){
    let el = typeof El === 'string' ?  get(El) : El        
    elClass(el,'remove','d-none')
}

function toggleView(El){
    let el = typeof El === 'string' ?  get(El) : El
    elClass(el,'toggle','d-none')    
}

function click(El){
    let el = typeof El === 'string' ?  get(El) : El        
    el.click()
}

function addSpinner(El,join){
    let el = typeof El === 'string' ? get(El) : El    
    attr(el,'disabled','true')
    if(join){
        html(el,`<span class="mx-1 spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>`,true)
    }else{
        html(el,`<button class='btn w-100' disabled><span class="mx-1 spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span></button>`)        
    }
}
function removeSpinner(El){
        let el = typeof El === 'string' ? get(El) : El    
        el.removeAttribute('disabled')
        remove(get(el,'.spinner-grow'))
}

function addBottomLoading(El,loading_type){
    let el = typeof El === 'string' ? get(El) : El        
    let loading_class = loading_type === 'once' ? 'load-once' : 'load-infinite' 
    el.classList.add('loading',loading_class)
}

function removeBottomLoading(El){
    let el = typeof El === 'string' ? get(El) : El        
    el.classList.remove('loading','load-once','load-infinite')
}


function getTimeGap(dateFrom){
let d1 = new Date(dateFrom)
if(isNaN(d1.getTime())) return ; 
let d2 = new Date()
let df_ms = Math.abs(d2-d1)//gap in mili second
let df_s = Math.floor(df_ms/1000)//gap in second
let df_mn = Math.floor(df_s/60) //gap in minute
let df_hr = Math.floor(df_mn/60) //gap in hour
let df_d = Math.floor(df_hr/24) //gap in day
let df_yr = d2.getFullYear() - d1.getFullYear()
let df_mo = (df_yr*12)+(d2.getMonth()-d1.getMonth())
if(d2.getDate() < d1.getDate()){
    df_mo--
}
df_mo = df_mo < 0 ? 0 : df_mo
let df_gap = 
df_yr >= 1 ? `${df_yr}yr` :
df_mo >= 1 ? `${df_mo}mon`:
df_d  >= 1 ? `${df_d}d`   :
df_hr >= 1 ? `${df_hr}hr` :
df_mn >= 1 ? `${df_mn}min`: 'just now'
return df_gap
}
// end function

function debugMsg(msg){
    if(attr(document.body) !== 'true') return ;
    console.log(debugMsg)
}
//function name must be same as module name



function updateUrl(urlText){
    if(urlText){
       let defaultUrl = window.location.origin
       let newUrl = defaultUrl + urlText
       window.history.pushState({path:newUrl},'',newUrl)
   }
}




//initialize tooltip 
const tooltipTriggerList = getAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

// initialize popup
const popoverTriggerList = getAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))


// initialize toast
const toastElList = getAll('.toast')
const toastList = [...toastElList].map(toastEl => new bootstrap.Toast(toastEl,{autohide:true}))

// open toast on button trigger
const toastTrigger = document.getElementById('liveToastBtn')
const toastLiveExample = document.getElementById('liveToast')

let allBtnHasToast = getAll('.btn-has-toast')
allBtnHasToast.forEach(eachBtn=>{
    if(!attr(eachBtn,'data-target-toast')) return ;
    let toastBootstrap = bootstrap.Toast.getOrCreateInstance(get(`#${attr(eachBtn,'data-target-toast')}`))
    trigger(eachBtn,()=>toastBootstrap.show())
})



//ripple
function addRippleEffect(eachBtn,e){
  let clickX =e.clientX 
  let clickY =e.clientY
  let elementFromLeft =e.target.offsetLeft 
  let elementFromTop = e.target.offsetTop
  let rippleX = clickX-elementFromLeft
  let rippleY = clickY-elementFromTop
  let ripple = document.createElement('span')
  ripple.classList.add('ripple')
  ripple.style.top = `${rippleY}px`
  ripple.style.left= `${rippleX}px`          
  eachBtn.appendChild(ripple)
  setTimeout(()=>{ripple.remove()},500)
}

 // ripple Effect
const ripple_buttons = getAll('.has_ripple')
if(ripple_buttons.length > 0){
ripple_buttons.forEach(eachBtn=>{
    trigger(eachBtn,(e)=>addRippleEffect(eachBtn,e))
})
}

function initTabAutoId(tab){
    if(!tab) return ;
    attr(tab,'data-has-auto-id','true')
    let randomNum = Math.round(Math.random()*10000)
    attr(tab,'id',`tab${randomNum}`)
    getAll(tab,'.tab-btn-container .tab-btn').forEach((eachTabBtn,btnIndex)=>{
        attr(eachTabBtn,'id',`tab${randomNum}-btn${btnIndex+1}`)
        attr(eachTabBtn,'data-bs-target',`#tab${randomNum}-pane${btnIndex+1}`)
    })
    getAll(tab,'.tab-content-container .tab-pane').forEach((eachPane,paneIndex)=>{
        attr(eachPane,'id',`tab${randomNum}-pane${paneIndex+1}`)
        attr(eachPane,'aria-labelledby',`#tab${randomNum}-btn${paneIndex+1}`)
    })    
}
    // dynamic id for tab btn and tab pane
    const allTabContainer = getAll('.tab-container');
    if(allTabContainer){
        allTabContainer.forEach((eachContainer,tabIndex)=>{
            if(attr(eachContainer,'data-has-auto-id') === 'true') return ;
            attr(eachContainer,'data-has-auto-id','true')
            getAll(eachContainer,'.tab-btn-container .tab-btn').forEach((eachTabBtn,btnIndex)=>{
                attr(eachTabBtn,'id',`tab${tabIndex+1}-btn${btnIndex+1}`)
                attr(eachTabBtn,'data-bs-target',`#tab${tabIndex+1}-pane${btnIndex+1}`)
            })
            getAll(eachContainer,'.tab-content-container .tab-pane').forEach((eachPane,paneIndex)=>{
                attr(eachPane,'id',`tab${tabIndex+1}-pane${paneIndex+1}`)
                attr(eachPane,'aria-labelledby',`#tab${tabIndex+1}-btn${paneIndex+1}`)
            })
        })
    }

// initialize hightlight js
if(get('code')){hljs.highlightAll();}



// start slider
// const allSliderContainer = getAll('.slider-container') 
// if(allSliderContainer.length > 0){
//     allSliderContainer.forEach(eachSliderContainer=>{
//         let slider = get(eachSliderContainer,'.slider')
//         let slides = getAll(slider,'.slide')
//         console.log(slides[0])
//         if(slider && slides){
//             let currentIndex = 0;
//             const slideWidth = slides[0].offsetWidth;
//             function goToSlide(index){
//                 if(index < 0 || index >= slides.length) return ;
//                 currentIndex = index
//                 const offSet = - currentIndex * slideWidth;
//                 slider.style.transform = `translateX(${offSet}px)`
//                 console.log(`translateX(${offSet}px)`)
//             }
//             function nextSlide(){
//                 console.log('next slide init')
//                 if(currentIndex === slides.length -1){
//                     console.log(currentIndex)
//                     goToSlide(0)
//                 }else{
//                     goToSlide(currentIndex+1)
//                 }
//             }
//             function prevSlide(){
//                 if(currentIndex === 0){
//                     goToSlide(slides.length -1)
//                 }else{
//                     goToSlide(currentIndex-1)
//                 }
//             }
//             function autoSlide(autoslideDuration){
//                 let duration = autoslideDuration ? autoslideDuration : 5000;
//                  setInterval(()=>{
//                     nextSlide()
//                  },duration)
//             }

//             if(attr(eachSliderContainer,'data-autoslide') === 'true'){
//                 let slideDuration = parseInt(atrr(eachSliderContainer,'data-autoslide-duration')) ?
//                                     parseInt(atrr(eachSliderContainer,'data-autoslide-duration')) : 500  
//                 autoSlide(slideDuration)                                                                
//             }

//             if(attr(eachSliderContainer,'data-slide-type')){
//             if(attr(eachSliderContainer,'data-slide-type') === 'inner-btn'){
//                 addBtnToSlider()
//             }else{
//                 addPointToSlider()
//             }                                

//             function addBtnToSlider(){
//             let sliderPrevBtn = document.createElement('i')
//             sliderPrevBtn.classList.add('sliderPrevBtn','fa-solid','fa-chevron-left','i-btn','rounded-circle','light-bg','fs-5')
//             let sliderNextBtn = document.createElement('i')
//             sliderNextBtn.classList.add('sliderNextBtn','fa-solid','fa-chevron-right','i-btn','rounded-circle','light-bg','fs-5')
//             eachSliderContainer.appendChild(sliderPrevBtn)
//             eachSliderContainer.appendChild(sliderNextBtn)
//             trigger(sliderPrevBtn,'click',()=>prevSlide())
//             trigger(sliderNextBtn,'click',()=>nextSlide())            
//             }
//             // end add btn to slider

//             function addPointToSlider(){
//                 let sliderBottomPoint = document.createElement('div')
//                 sliderBottomPoint.classList.add('slider-points')
//                 slides.forEach((eachSlide,i)=>{
//                     let defaultelClassForPointSlide = i == 0 ? 'active' : ''
//                     html(sliderBottomPoint,`<span elClass= "${defaultelClassForPointSlide} slider-point-btn " ></span>`,true)
//                 })
//                eachSliderContainer.appendChild(sliderBottomPoint) 
//                 getAll(sliderBottomPoint,'.slider-point-btn').forEach((eachPoint,i)=>{
//                     trigger(eachPoint,'click',()=>{
//                         // remove active elClass from span
//                         sliderBottomPoint.querySelectorAll('.slider-point-btn').forEach(eachSpan=>{
//                             if(eachSpan.classList.contains('active')){
//                                 eachSpan.classList.remove('active')
//                             }                        
//                     })
//                     eachPoint.classList.add('active')
//                     goToSlide(i)
//                      })
//                 })

//             }
//             //  add point to slider

//         }
//         // end data-slider-type consition
//         else{
//             addStdBtnToSlider()
//             function addStdBtnToSlider(){
//             let div = document.createElement('div')
//             div.classList.add('w-100','d-flex','py-2','justify-content-between','gap-2','align-items-center')
//             let sliderPrevBtn = document.createElement('button')
//             sliderPrevBtn.classList.add('btn','btn-secondary','flex-grow-1')
//             text(sliderPrevBtn,'prev')
//             let sliderNextBtn = document.createElement('button')
//             sliderNextBtn.classList.add('btn','btn-primary','flex-grow-1')
//             text(sliderNextBtn,'next')
//             div.appendChild(sliderPrevBtn)
//             div.appendChild(sliderNextBtn)
//             eachSliderContainer.appendChild(div)
//             trigger(sliderPrevBtn,'click',()=>prevSlide())
//             trigger(sliderNextBtn,'click',()=>nextSlide()) 
//             }
//             // end add stdbtn to slider
//         }//end else

//         }
//        // end slider,slides exist condition

//     })
//     // end each-container loop
// } 
// // end container exist conditon
// // end slider









// change website theme
const themeBtn = get('#themeChangerBtn');
if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        const currentTheme = attr(document.body,'data-theme') || 'dark';
        themeBtn.className = '';
        themeBtn.classList.add('fa-solid', currentTheme === 'dark' ? 'fa-moon' : 'fa-sun', 'i-btn', 'rounded-circle');
        attr(document.body,'data-theme',currentTheme === 'dark' ? 'light' : 'dark')
        localStorage.BSpageTheme = attr(document.body,'data-theme')
    });
}
function loadPageTheme() {
    const currentTheme = localStorage.BSpageTheme || 'dark';
    themeBtn.className = '';
    themeBtn.classList.add('fa-solid', currentTheme === 'dark' ? 'fa-sun' : 'fa-moon', 'i-btn', 'rounded-circle');
    attr(document.body,'data-theme',currentTheme)
}

loadPageTheme();


//dropdown as select menu 

function initAllSelectMenu(){
 const allDropdownSelectMenu = getAll('.dropdown-menu.dropdown-select-menu')
 if(allDropdownSelectMenu.length === 0) return ;
 allDropdownSelectMenu.forEach(eachMenu=>{
     initSelectMenu(eachMenu.id)    
 })
}


function initSelectMenu(id){
    let targetMenu = get(`#${id}`)
    if(!targetMenu) return ;
    attr(targetMenu,'data-has-auto-id','true')    
    let allMenuItem = getAll(targetMenu,'*[data-value]')
    attr(targetMenu,'data-value',attr(allMenuItem[0],'data-value'))
    allMenuItem.forEach(eachMenuItem=>{
        trigger(eachMenuItem,()=>{
            attr(targetMenu,'data-value',attr(eachMenuItem,'data-value'))
            text(`#${attr(targetMenu,'data-field')}`,eachMenuItem.innerText)
        })
    })
}

function getSelectMenuValue(id){
    return attr(`#${id}`,'data-value')
}

initAllSelectMenu()
// let menuValue = getSelectMenuValue('exampleMenu')
// end select menu


//initialize one accordion auto id
function setAccordionItemAutoId(Accordion){
    let accordion = typeof Accordion === 'string' ? get(Accordion) : Accordion 
    if (!accordion) return;    
    let randomNumber = Math.round(Math.random()*1000)
    accordion.id = `acr-${randomNumber}`
    let accordionItems = getAll(accordion,'.accordion-item');
    if (!accordionItems || accordionItems.length === 0) return;
    accordionItems.forEach((acr_item, index) => {
        let accordionButton   = get(acr_item,'.accordion-button')
        let accordionCollapse = get(acr_item,'.accordion-collapse')
        if (accordionButton && accordionCollapse) {
            acr_item.id = `${accordion.id}-item${index+1}`
            let acr_item_collapse_id = `${acr_item.id}-collapse`;
            elClass(accordionCollapse,'remove','show')
            accordionCollapse.id = acr_item_collapse_id;
            attr(accordionCollapse,'data-bs-parent',`#acr-${randomNumber}`)
            elClass(accordionButton,'add','collapsed')
            attr(accordionButton,'data-bs-target',`#${acr_item_collapse_id}`)
            attr(accordionButton,'aria-controls',acr_item_collapse_id)
            attr(accordionButton,'aria-expanded','false')
        }
    });
}

//initialize all accordion of a contaner else in document
function initAccordionAutoId(container){
   let allAccordions = container ? getAll(container,'.accordion') : getAll('.accordion')
   if(!allAccordions || allAccordions.length === 0) return ;
   allAccordions.forEach(eachAccordion=>{
    setAccordionItemAutoId(eachAccordion)
   })//end loop
}


initAccordionAutoId()
// end accordion


// start read-more,read-once btn
let allReadOnceBtn = getAll('.btn-read-once')
if(allReadOnceBtn.length > 0){
allReadOnceBtn.forEach(eachReadOnceBtn=>{
    trigger(eachReadOnceBtn,()=>elClass(eachReadOnceBtn,'add','d-none') )
})    
}
// end function

let allReadTwiceBtn = getAll('.btn-read-twice')
if(allReadTwiceBtn.length > 0){
allReadTwiceBtn.forEach(eachBtn=>{
    text(eachBtn,'...read more')
    trigger(eachBtn,()=>{
        text(eachBtn,`${eachBtn.innerText === '...read more' ? '...read less' : '...read more'}`)
     })
})
}
// end fucntion





function BtnActiveEffect(btnContainer){
    if(!btnContainer) return ;
    let elType = attr(btnContainer,'data-eltype') ? attr(btnContainer,'data-eltype') : 'button'
    let btnArr = getAll(btnContainer,elType) 
    if(btnArr.length === 0) return ;
    elClass(btnArr[0],'add','active-btn')
    btnArr.forEach(eachBtn=>{
        trigger(eachBtn,()=>{
            btnArr.forEach(btn=>elClass(btn,'remove','active-btn'))
            elClass(eachBtn,'add','active-btn')
        })
    })
}

let allBtnList = getAll('.btn-list')
if(allBtnList.length > 0){
allBtnList.forEach(eachBtnList=>BtnActiveEffect(eachBtnList))    
}



function initCopyContainer(El){
  let el = typeof El === 'string' ? get(El) : El    
  let allCopyContainer = El ? getAll(el,'.copy-container') :
                              getAll('.copy-container')                                                          
  if(!allCopyContainer || allCopyContainer.length === 0) return ;
  allCopyContainer.forEach(container=>{
    let copy_btn = get(container,'.copy-btn')
    let copy_text = get(container,'.copy-text')
    trigger(copy_btn,()=>{
        copyText(text(copy_text),()=>{   
        elClass(copy_btn,'replace','fa-clipboard','fa-circle-check')
        setTimeout(()=>elClass(copy_btn,'replace','fa-circle-check','fa-clipboard'),2500)            
        })//end callback
    })//end trigger
  })//end loop
}




initCopyContainer()


function copyText(text,callback) {
if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(function() {
        callback()
    }).catch(function(err) {
        console.error('Could not copy text: ', err);
    });
}
}


function utf8ToBase64(str) {
    // Encode the string as UTF-8
    let utf8Bytes = new TextEncoder().encode(str);
    // Convert bytes to Base64
    return btoa(String.fromCharCode(...utf8Bytes));
}

function base64ToUtf8(str) {
    // Decode Base64 to a string
    let binaryString = atob(str);
    // Convert binary string to a Uint8Array
    let bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    // Decode bytes to a UTF-8 string
    return new TextDecoder().decode(bytes);
}


async function translateLanguage(word,soruce,target,callback){
 let res    = await fetch(`https://api.mymemory.translated.net/get?q=${word}!&langpair=${soruce}|${target}`)
 let result = await res.json()
 if(!res.ok){
    callback()
    return ;
 }
 return res.ok ? result.matches[0].translation : false 
}


function initMediaDownloader(){
let allMediaDownloadLink = getAll('.media-container .media-download-link')
if(allMediaDownloadLink.length === 0) return ;
    allMediaDownloadLink.forEach(eachLink=>{
        trigger(eachLink,async(e)=>{
            e.preventDefault()
            let downloadUrl = attr(eachLink,'data-download-url')
            let file_name = attr(eachLink,'data-file-name')      
            if(!(downloadUrl&&file_name)) return ;
            try{
               let response  = await fetch(downloadUrl)
               if(response.ok){
               let blob = await response.blob()
               let link = document.createElement('a')
               let downloadUrl = window.URL.createObjectURL(blob)
               link.setAttribute('href',downloadUrl)
               link.setAttribute('download',file_name)
               document.body.appendChild(link)
               link.click()
               link.remove()
               window.URL.revokeObjectURL(downloadUrl)
            }
            }catch(err){
              console.log(err)
             }
        })//end trigger
    })//end forEach loop 
}// end function


