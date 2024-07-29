
class Note{

    constructor(username,token){
      this.username = username
      this.token = token
      import('./allModule/userRepo.js').then(mod=>{
      let {UserRepo} = mod
       this.userRepo = new UserRepo(this.username,this.token)
       this.init()       
      })                  
      this.currentSubject;
      this.currentChapter;
      this.currentTopic;
    }


    async test(){
      // click('#testBtn')
      // click('#openBtn')
      // get('#prompt-offcanvas-hide-btn').click()
    }
    // end function
   init(){
         // this.test()
         // this.showUserDetails()      
         // this.userRepo.checkEasyNoteRepo()         
         // this.showSubjectList()               
         // this.newSubjectHandler()               
         // this.newChpaterHandler()         
         // this.modalContentHandler()
         // this.initContentCreating()                  
         // this.handleAllDeleteTrigger()
         // this.renameHandler()         
         // this.saveContentHandler()
         // this.handleOthers()
         // this.handleContentShare()
         // this.handleReload()
         this.handleMediaManager(this.userRepo)
      }

      handleMediaManager(noteObj){
         import('./allModule/mediaHandler.js').then(mod=>{
         mod.initMediaManager(noteObj)
      })              
      }

      handleReload(){
         trigger('#page-relaod-btn',()=>{
            get('#nav').classList.add('reload')
            html('.chapter-accordions','')
            this.showSubjectList()
            setTimeout(()=>{elClass('#nav','remove','reload')},5000)            
         })
      }

   handleContentShare(){
      trigger('#contentShareBtn',async()=>{
         let currentContent = html('#element-content-container').trim()
         if(currentContent === '') return ;
         this.showStatus('creating link...',false)
         let result = await this.userRepo.createShareLink(this.username,this.currentTopic,currentContent)
         if(result.status === 'success'){
            let protocol = window.location.protocol
            let host  = window.location.host
            let contentURL = `/page/content.php?content-id=${result.id}`
            let link = `${protocol}//${host}${contentURL}`
            get('#content-share-link').href = link
            get('#content-share-link').classList.remove('d-none')            
            navigator.clipboard.writeText(link).then(()=>{
            this.showToast('link copied to clipboard','circle-check')                     
            })
         this.showStatus('',true)         
         }else{
         this.showStatus('failed',false)
         this.showToast(result.message,'circle-error')            
         }
      })

   }//end function 

      handleOthers(){
         trigger('#subjectReloadBtn',async()=>{
            await this.showSubjectList()
            html('.chapter-accordions','')
         })
      }

      // start renameHandler
       renameHandler(){
         const topicRenameBtn = get('#topicRenameBtn')
         const topicTitleEl = get('#modal-topic-title')
         trigger(topicRenameBtn,()=>{
         let oldTitleName = text(topicTitleEl)
            this.autoEdit(topicTitleEl,async(renamedValue)=>{
               if((renamedValue.trim() === '') || (ranamedValue === oldTitleName)){
                  text(topicTitleEl,oldTitleName)
                  return ;
               }
               this.currentSubject.chapters.forEach(eachChapter=>{
                  eachChapter.topics.forEach( eachTopic=>{
                     if(eachTopic.topic_name == oldTitleName){
                        eachTopic.topic_name = renamedValue
                     }
                  })
                  // end 2nd loop
               })
               // end 1st loop
            this.showStatus(`updating ⏳`,false)                                                
            let result = await this.userRepo.updateSubject(this.currentSubject.subject_name,this.currentSubject)
            if(result === true){
               this.showToast('updated','circle-check')
               this.showChapter(this.currentSubject.subject_name)
                   }else{
                  this.showToast('failed to rename topic')
                  text(topicTitleEl,oldTitleName)
                  this.showStatus(`remove if contains emoji`,true)                                                   
               }
            })
            // end callback func
         })


// start chapterRenaming

const chapterRenameBtn = get('#chapterRenameBtn')
trigger(chapterRenameBtn,()=>{
   if(!this.currentChapter) return ;
   let  oldTitle = this.currentChapter
   let allChpaterTitle = getAll('#chapter-container .chapter-accordions .chapter-title')
   let targetTitle;
   allChpaterTitle.forEach(eachTitle=>{
      if(eachTitle.innerText.trim() === oldTitle.trim()){
         targetTitle = eachTitle
      }
   })
   if(!targetTitle) return ;
   this.autoEdit(targetTitle,async(newTitle)=>{
      if((newTitle.trim() === '') || (newTitle === oldTitle)){
         text(targetTitle,oldTitle)
         return ;         
      }
      this.currentSubject.chapters.forEach(eachChapter=>{
         if(eachChapter.chapter_name === oldTitle){
            eachChapter.chapter_name = newTitle
         }
      })
      // end chapters loop
            this.showStatus(`⏳ updating`,false)                                                
            let result = await this.userRepo.updateSubject(this.currentSubject.subject_name,this.currentSubject)
            if(result === true){
               this.showToast('updated','circle-check')
               this.showChapter(this.currentSubject.subject_name)
                   }else{
                  this.showStatus(`failed ❌`,false)                                                                     
                  this.showToast('failed to renamed chapter')
                  text(targetTitle,oldTitle)
                  this.currentSubject.chapters.forEach(eachChapter=>{
                    if(eachChapter.chapter_name === newTitle){
                       eachChapter.chapter_name = oldTitle
                       }
                  })                  
               }
   })
   // end callback func
})// end trigger
// end chapterRenaming


// strat subjectRenaming
trigger('#subjectRenameBtn',async()=>{
   let targetSubject = get('#leftsideBar-subject-list .sidebar-subjectBtn.active')
   if(!targetSubject) return ;
   let newTitle = prompt('new subject title')
   if((!newTitle) || (newTitle === targetSubject.innerText)) return ;
   newTitle = newTitle.replace(/[\,.!#$%^'`\/&\*\[\]|()+]/g,'-')
   this.showStatus('...updating',false)
   let processResult = await this.userRepo.renameSubject(newTitle,targetSubject.innerText)
   if(!processResult){
   this.showStatus('failed ❌',false)      
    this.showToast('something went wrong','circle-xmark')
   }
    this.showToast(`${targetSubject.innerText} renamed to ${newTitle}`,'circle-check')   
    this.showSubjectList()
    html('.chapter-accordions','')
    this.currentSubject = undefined;
})
// end subjectRenaming


}
// end function renameHandler

async handleAllDeleteTrigger(){

// start subject deleteTrigger
      trigger('#subjectDltBtn',async()=>{
         let allSubjectBtn = getAll('#leftsideBar-subject-list .sidebar-subjectBtn')
         if(allSubjectBtn.length === 0) return ;         
         let selectedSubject = get('#leftsideBar-subject-list .sidebar-subjectBtn.active')
         if(!selectedSubject) return ;
         let deleteConfirm = confirm(`remove the subject ( ${selectedSubject.innerText} )`)
         if(!deleteConfirm) return ;         
         this.showStatus(`removing sujbect ${selectedSubject.innerText} ⏳`,false)
         let processResult =  await this.userRepo.removeSubject(selectedSubject.innerText)
         if(processResult){
            this.showToast(`subject : ${selectedSubject.innerText} deleted`,'circle-check')
            this.updatePageAddress('EasyNote')
            this.showStatus('',false) 
            if(this.currentSubject.subject_name === selectedSubject.innerText){
               html('.chapter-accordions','')
            }           
          this.currentSubject = undefined  
          selectedSubject.classList.add('d-none')
         }else{
            this.showStatus('failed ❌',false) 
            this.showToast(`request failed`,'triangle-exclamation')            
         }
      })
// end subject deleteTrigger

//start chapter deleteTrigger
   trigger('#chapterDltBtn',async()=>{
      let allchapter = getAll('#chapter-container .chapter-accordions .accordion-item')
      if((!allchapter) || (allchapter.length === 0)) return ;
         if(!this.currentChapter) return ;
         let deleteConfirm = confirm(`remove the chapter ( ${this.currentChapter} )`)
         if(!deleteConfirm) return ;
         this.currentSubject.chapters.forEach((eachChapter,index)=>{
            if(this.currentChapter === eachChapter.chapter_name){
               this.currentSubject.chapters.splice(index,1)
            }
         })
         this.currentChapter = undefined
         this.showStatus(`removing...`,false)                                          
         let result = await this.userRepo.updateSubject(this.currentSubject.subject_name,this.currentSubject)
            if(result === true){
               this.showStatus(``,true)                                 
               this.showToast('deleted','circle-check')
               this.showChapter(this.currentSubject.subject_name)
                   }else{
                  this.showToast('failed to remove chapter')
               }
   })
//end chapter deleteTrigger

// start topic deleteTrigger
const topicDltBtn = get('#topicDltBtn')
trigger('#topicDltBtn',async()=>{
   let deleteConfirm = confirm(`remove the topic ( ${this.currentTopic} )`)
   if(!deleteConfirm) return ;   
   get('#openBtn').click()   
   this.currentSubject.chapters.forEach(eachChapter=>{
      eachChapter.topics.forEach((eachTopic,idx)=>{
         if(eachTopic.topic_name === this.currentTopic){
            eachChapter.topics.splice(idx,1)
         }
      })
   })
   this.showStatus(`removing...`,false)                                          
   let result = await this.userRepo.updateSubject(this.currentSubject.subject_name,this.currentSubject)
   if(result === true){
      this.showStatus(``,true)                                 
      this.showToast('topic deleted','circle-check')
      this.showChapter(this.currentSubject.subject_name)             
      }else{
         this.showStatus(`failed ❌`,false)                                                      
         this.showToast('failed to removed topic')
      }
})
// end topic deleteTrigger

   }
// end function

   updatePageAddress(title){
      if(!title) return ;
      document.title = title
   }

      saveContentHandler(){
         const modalElementContainer = get('#modal-content #element-content-container')
         trigger('#contentSaveBtn',()=>{
         this.showStatus(`saving ⏳`,false)            
           let currentContentHtml = html(modalElementContainer).trim()
           this.currentSubject.chapters.forEach(eachChapter=>{
            if(eachChapter.chapter_name === this.currentChapter){
               eachChapter.topics.forEach(async eachTopic=>{
                  if(eachTopic.topic_name === this.currentTopic){
                     eachTopic.topic_html = currentContentHtml
                  let result = await this.userRepo.updateSubject(this.currentSubject.subject_name,this.currentSubject)
                   if(result === true){
                     this.showStatus(`saved`,false)                                 
                     this.showToast('saved','circle-check')
                     attr(modalElementContainer,'data-has-new-content','false')
                     this.showChapter(this.currentSubject.subject_name)
                   }else{
                    this.showToast('failed to save content','triangle-exclamation')
                    this.showStatus(`failed to save content ❌`,false)                                                   
                    }
                  }//end topic logic
               })//end 2nd loop
            }//end chapter logic
           })// end first loop
         })// end saveBtnTrigger
      }// end function




      modalContentHandler(){
        const modalContent = get('#modal-content')
        const modalElementContainer = get('#modal-content #element-content-container')
        Trigger('#modal-content','shown.bs.modal',()=>{
         attr(modalElementContainer,'data-has-new-content','false')
         text('#modal-topic-title',this.currentTopic)
        this.updatePageAddress(this.currentTopic)    
        this.currentSubject.chapters.forEach(eachChapter=>{
         if(eachChapter.chapter_name === this.currentChapter){
            eachChapter.topics.forEach(eachTopic=>{
               if(eachTopic.topic_name === this.currentTopic){
                  if(!eachTopic.topic_html) return ;
                  html(modalElementContainer,eachTopic.topic_html)
                  import('./allModule/elRequireJs.js').then(mod=>{
                  mod.initRequireJs()
                  })                              
               }//end topic logic
            })//end topic loop
          }//end chapter logic
        })//end chapter loop
        })

        Trigger('#modal-content','hidden.bs.modal',async()=>{
         let newContentInserted = attr('#element-content-container','data-has-new-content')
         if(newContentInserted === 'true'){
            let autoSaveEnabled = get('#auto-save-btn').checked
            if(autoSaveEnabled){
                  this.showStatus(`saving ⏳`,false)                                 
                  let result = await this.userRepo.updateSubject(this.currentSubject.subject_name,this.currentSubject)
                   if(result === true){
                  this.showToast('saved','circle-check')
                  attr(modalElementContainer,'data-has-new-content','false')
                  this.showChapter(this.currentSubject.subject_name)
                   }else{
                     this.showToast('failed to save content','triangle-exclamation')
                     this.showStatus(`failed to save content ❌`,false)                                                   
                    }                
            }else{this.showToast('content was not saved','triangle-exclamation')}
         }//end new content inserted logic
          this.updatePageAddress(this.currentSubject.subject_name)    
           let currentContentHtml = html(modalElementContainer)
           this.currentSubject.chapters.forEach(eachChapter=>{
            if(eachChapter.chapter_name === this.currentChapter){
               eachChapter.topics.forEach(async eachTopic=>{
                  if(eachTopic.topic_name === this.currentTopic){
                     eachTopic.topic_html = currentContentHtml
                     html(modalElementContainer,'')
                     html('#modal-topic-title','')
                  }//end topic logic
               })//end topic loop
            }//end chapter-lgic
           })//chapter loop
        })

}
// end function




   async newChpaterHandler(){
     trigger('#createNewChapterBtn',()=>{
      if(!this.currentSubject) return ;
      let chapterAccordion = get('.chapter-accordions')
      let newChapter = document.createElement('div')
      newChapter.classList.add('accordion-item','each-chapter')
      newChapter.innerHTML = `<h2 class="accordion-header">
      <button class="accordion-button collapsed ps-1" type="button" data-bs-toggle="collapse" aria-expanded="false">
        <span class="chapter-title text-truncate"></span></button></h2><div class="accordion-collapse collapse"><div class="accordion-body box-bg"><header class="text-end mb-1"><i class="topic-addBtn fa-solid fa-plus fs-5 i-btn rounded-circle "></i></header><div class="topic-list"></div></div>`
      chapterAccordion.appendChild(newChapter)
      let allChapterOfAccordion = getAll(chapterAccordion,'.accordion-item')
      let chapterTitle = allChapterOfAccordion[allChapterOfAccordion.length-1].querySelector('.chapter-title')
      this.autoEdit(chapterTitle,async (chapterName)=>{
        if(!chapterName || chapterName.trim() === ''){
            remove(newChapter)
            return ;
        }
       this.showStatus(`creating new chapter ${chapterName} ⏳`,false)                              
         let newChapterObj = {chapter_name:chapterName,topics:[]}
         this.currentSubject.chapters.push(newChapterObj)
         let result = await this.userRepo.updateSubject(this.currentSubject.subject_name,this.currentSubject)
         if(result === true){
            this.showToast('new chapter created','circle-check')
            this.showChapter(this.currentSubject.subject_name)
         }else{
            this.showStatus('failed ❌ ',false)            
            this.showToast('failed to create new chapter','triangle-exclamation')            
            this.currentSubject.chapters.pop()
            remove(newChapter)
          }

      })//end callback func
     })//end trigger

   }
   // end func




   async showSubjectList(){
      this.showStatus('loading subject list ⏳',false)
      const subjectListContainer = get('#leftsideBar-subject-list')      
      subjectListContainer.innerHTML = '<button class="btn w-100" type="button" disabled><span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span></button>'
      let subjectList =  await this.userRepo.getSubjectList()
      if(!subjectList){
         html(subjectListContainer,"<div class='p-2'>create new subject here</div>")
         this.showStatus(`empty subject list`,true)                     
         return ;
      }
      html(subjectListContainer,'')
      subjectList.forEach(eachSubject=>{
         html(subjectListContainer,`<button class="sidebar-subjectBtn btn w-100 text-start box-hover overflow-hidden text-truncate"><span>${eachSubject}</span></button>`,true)
      })
      this.showStatus('',true)
      let allSubjectBtn = getAll(subjectListContainer,'.sidebar-subjectBtn')
      allSubjectBtn.forEach(eachBtn=>{
         trigger(eachBtn,()=>{
            allSubjectBtn.forEach(eachSubBtn=>{
               if(eachSubBtn.classList.contains('active')){
                  eachSubBtn.classList.remove('active')
               }
            })
            eachBtn.classList.add('active')
            this.updatePageAddress(eachBtn.innerText)
            text('#chapter-container .currentSubjectName',eachBtn.innerText)
            html('.chapter-accordions',`<button class="btn w-100" type="button" disabled><span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span></button>`)
            this.showChapter(eachBtn.innerText)
         })//end trigger
      })//end eachbtn loop
    }// end function




   async showChapter(subject_name){

      this.showStatus(`loading subject ${subject_name}  ⏳`,false)      
      let subObj =  await this.userRepo.getSubject(subject_name)
      let subjectContent;
      try{
          let decodedContent = base64ToUtf8(subObj.content)
          subjectContent = JSON.parse(decodedContent)
      }catch(err){
         console.log(err)
         html('#chapter-container .chapter-accordions','')
      }
      if(!subjectContent){
         this.showToast('corrupt file','triangle-exclamation')
         this.showStatus(`failed ❌ `,false)               
         return ;
      }
      this.currentSubject = subjectContent
      if(subjectContent.chapters.length === 0){
         html('.chapter-accordions',`<h4 class='text-center text-light'>create new subject here</h4>`)
         this.showStatus(`no chapter found`,true)                                 
         return ;
      }
      let allChapterHtml = ''      
      let chapterAccordion = get('#chapter-container .chapter-accordions')
      subjectContent.chapters.forEach(eachChapter=>{
         let chapterName = eachChapter.chapter_name
         let topicHtml = ''
         if(eachChapter.topics.length >= 1){
         eachChapter.topics.forEach(eachTopic=>{
            if(!eachTopic ) return ;
            topicHtml +=`<button class="each-topic btn w-100 text-start d-block box-hover rounded-1 text-truncate" data-bs-toggle = 'modal' data-bs-target='#modal-content' data-topic='${eachTopic.topic_name}'>${eachTopic.topic_name}</button>`
         })            
         }
         allChapterHtml += `  <div class="accordion-item each-chapter"><h2 class="accordion-header"><button class="accordion-button collapsed ps-1" data-chapter='${chapterName}' type="button" data-bs-toggle="collapse" aria-expanded="false"><span data-chapter='${chapterName}' class="chapter-title text-truncate">${chapterName}</span></button></h2><div class="accordion-collapse collapse"><div class="accordion-body box-bg"><header class="text-end mb-1"><i class="topic-addBtn fa-solid fa-plus fs-5 i-btn rounded-circle "></i></header><div class="topic-list">${topicHtml}</div></div></div></div>`
      })
      html(chapterAccordion,allChapterHtml)
      let leftSideBar = get('#offcanvas-leftSideBar')
      if(leftSideBar.classList.contains('show')){
        let x = bootstrap.Offcanvas.getInstance(leftSideBar) 
        x.hide()
      }
      this.showStatus(``,true)            
      setAccordionItemAutoId(chapterAccordion)
      this.newTopicHandler()
      this.topicTriggerHandler()         
      }



      topicTriggerHandler(){
         trigger('.chapter-accordions',(e)=>{
            if(e.target.getAttribute('data-chapter')){
               this.currentChapter = e.target.getAttribute('data-chapter')
               text('#chapter-container .currentSubjectName',`${this.currentSubject.subject_name} / ${this.currentChapter}`)
            }else if(e.target.getAttribute('data-topic')){
               this.currentTopic = e.target.getAttribute('data-topic')
            }
         })
      }

      async newTopicHandler(){
       let allChapterOfAccordion = getAll('#chapter-container .chapter-accordions .accordion-item')
       allChapterOfAccordion.forEach(eachChapter=>{
       let newTopicAddBtn   = get(eachChapter,'.accordion-collapse .topic-addBtn')
       let chapterTopicList = get(eachChapter,'.accordion-collapse .topic-list')
       trigger(newTopicAddBtn,async()=>{
         let topicTitle = prompt('new topic title')
         if(!topicTitle) return ;
         let newTopic = document.createElement('button')
         newTopic.classList.add('each-topic', 'btn', 'w-100','text-start','d-block','box-hover','rounded-1','text-truncate')
         attr(newTopic,'data-bs-toggle','modal')
         attr(newTopic,'data-bs-target','#modal-content')
         attr(newTopic,'data-topic',topicTitle)
         text(newTopic,topicTitle)
         chapterTopicList.appendChild(newTopic)
         this.showStatus(`creating new topic ${topicTitle} ⏳`,false)                              
         let currentChapter = get(eachChapter,'.accordion-button').getAttribute('data-chapter')         
         this.currentSubject.chapters.forEach(async each_chapter=>{
            if(each_chapter.chapter_name === currentChapter){
               let topicObj = {topic_name:topicTitle,topic_html:''}
               each_chapter.topics.push(topicObj)
               let result = await this.userRepo.updateSubject(this.currentSubject.subject_name,this.currentSubject)
               if(result === true){
               this.showToast('new topic created','circle-check')
               this.showChapter(this.currentSubject.subject_name)
               }else{
                  remove(newTopic)
                  this.showToast('failed to create new topic','triangle-exclamation')
                  this.showStatus(`failed ❌`,false)                                                
               }
            }//end chapter logic
         })//end chapter loop
       })//end trigger
       })//end chapter loop
      }
// end function


   async newSubjectHandler(){
      trigger('#leftSideBar-subjectCreateBtn',()=>{
         const subBtnContainer = get('#leftsideBar-subject-list')
         let newSubjectBtn = document.createElement('button')
         newSubjectBtn.classList.add('sidebar-subjectBtn','btn','w-100','text-start','box-hover','overflow-hidden', 'text-truncate')
         newSubjectBtn.innerHTML = "<span class='subject-name'></span><span class='d-none spinner-grow spinner-grow-sm' aria-hidden='true'></span>"
         subBtnContainer.appendChild(newSubjectBtn)
         let allSubjectBtn  = getAll(subBtnContainer,'.sidebar-subjectBtn')
         let newSubjectSpan = get(allSubjectBtn[allSubjectBtn.length -1],'span.subject-name')
         this.autoEdit(newSubjectSpan,async (subject_name)=>{
            if(!subject_name){
               remove(allSubjectBtn[allSubjectBtn.length-1])
            }else{
               subject_name = subject_name.replace(/[\.,!#$%^'`\/&\*\[\]|()+]/g,'-')
               let lastSubjectBtn = allSubjectBtn[allSubjectBtn.length-1] 
                this.showStatus(`creating new subject ${subject_name}...`,false)                     
                attr(lastSubjectBtn,'disabled','true')
                get(lastSubjectBtn,'.spinner-grow').classList.remove('d-none')
               let resultOfCreatingNewSubject = await this.userRepo.createSubject(subject_name)
               if(resultOfCreatingNewSubject === 'subject created'){
                  lastSubjectBtn.removeAttribute('disabled')
                  lastSubjectBtn.removeChild(lastSubjectBtn.querySelector('.spinner-grow'))
                  this.showToast('new subject created','circle-check')               
                  this.showStatus(``,false)          
                  this.showSubjectList()                
               }else if(resultOfCreatingNewSubject === 'subject already exists'){
                subBtnContainer.removeChild(allSubjectBtn[allSubjectBtn.length-1])
                this.showToast('subject already exist','triangle-exclamation')
                this.showStatus(``,false)                          
               }
            }
         })//end callbck func
      })
   }

  autoEdit(element,callback){

   attr(element,'contenteditable','true')
   element.focus()

   Trigger(element,'blur',()=>{
      element.removeAttribute('contenteditable')
       callback(element.innerText)            
   })

   Trigger(element,'keydown',(e)=>{
   if(e.key == 'Enter'){
      element.removeAttribute('contenteditable')
   }
   })

   }
   // end function

   showToast(msg,icon){
    let toast = get('#liveToast')    
    if(!msg) return ;
    text(get(toast,'.toast-msg'),msg)
    if(icon){
     let toastIcon = get(toast,'.toast-icon')
     toastIcon.className = ''
     toastIcon.classList.add('fa-solid',`fa-${icon}`,'fs-5','me-2','toast-icon')      
    }
    get('#liveToastBtn').click()    
   }
   // end function

   showStatus(msg,autohide){
   let msg_text = msg ? msg : ' ' 
   let statusbar = get('#statusBar')
   text(statusbar,msg_text)
   if(autohide===true){
     setTimeout(()=>text(statusbar,''),1300)
   }
   } //end function  

   async showUserDetails(){
      let userObj = await this.userRepo.getUserDetails()
      let user_img_src = userObj.avatar_url 
      let user_name = userObj.login
      if(!(user_img_src && user_name)) return ;
      get('#nav-user-avatar').src = user_img_src
   }      

   initContentCreating(){
   import('./allModule/handleEditMode.js').then(mod=>{
         mod.handleEditMode()
      })            
   import('./allModule/handleOtherLayout.js').then(mod=>{
         mod.handleOtherLayout()
      })               
   import('./allModule/shortcutEvent.js').then(mod=>{
         mod.shortcutHandler()
      })         
   import('./allModule/copyPasteDeleteHandler.js').then(mod=>{
         mod.initElCopyPasteDelete()
      })         
   import('./allModule/createNewElement.js').then(mod=>{
         mod.createNewElementHandler()
      })         
   import('./allModule/handleHighlight.js').then(mod=>{
         mod.handleHightlightMode()
      })         
   import('./allModule/elementTargetHandler.js').then(mod=>{
         mod.elTargetHandler()
      })            
}
// end function

}
// end class

window.addEventListener('DOMContentLoaded',()=>{
const username = attr(document.body,'data-usernme')
const token = attr(document.body,'data-token')
if(username === 'guest'){
   return ;
}
let note = new Note(username,token)
})

