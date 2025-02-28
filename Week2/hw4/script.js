const input=document.querySelector("#input-box")
const listContainer=document.querySelector("#list-container")


const addTask = ()=>{

    if(input.value===""){
        alert('Task can not be blank')
    }else{

        let li =document.createElement("li")
        li.innerHTML=input.value
        listContainer.appendChild(li)
        input.value=""
        let span=document.createElement("span")
        span.innerHTML="\u00d7"
        li.appendChild(span)
        saveData()





    }

}


listContainer.addEventListener("click",function(e){
    if(e.target.tagName==="LI"){
      
        e.target.classList.toggle("checked")
    }else if(e.target.tagName="SPAN"){
       
        e.target.parentElement.remove()
    }
    saveData()
},false)


const saveData=()=>{

    localStorage.setItem("data",listContainer.innerHTML)
}

const showTasks=()=>{
    listContainer.innerHTML=localStorage.getItem("data")
}

showTasks()