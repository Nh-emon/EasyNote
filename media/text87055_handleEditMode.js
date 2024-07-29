export function handleEditMode(){

let editModeBtn = get('#modal-content .modal-header #modal-content-edit-btn')
let promptToggleBtn = get('#bottom-insert-btn')
let contentEditBtn = get('#contentEditBtn')

trigger(editModeBtn,()=>{
     let editMode = get('#modal-content .modal-header #modal-content-edit-btn').checked
     if(editMode === true){
      elClass(contentEditBtn,'remove','d-none')
      elClass(promptToggleBtn,'remove','d-none')
     }else{
      elClass(contentEditBtn,'add','d-none')
      elClass(promptToggleBtn,'add','d-none')
     getAll('#modal-content .modal-body *').forEach(eachEl=>{
       if(eachEl.classList.contains('selectedEl')){
        eachEl.classList.remove('selectedEl')
         }
       })//end loop
     }
})//end trigger

}//end function