//show alert
const showAlert=document.querySelector("[show-alert]")
if(showAlert){
    const time = parseInt(showAlert.getAttribute("data-time"));
    const closeAlert = showAlert.querySelector("[close-alert]")
    setTimeout(()=>{
        showAlert.classList.add("alert-hidden")
    },time)
    closeAlert.addEventListener("click",()=>{
        showAlert.classList.add("alert-hidden")
    })
}
//end show alert

//pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]")
if(buttonsPagination){
    let url = new URL(window.location.href)
    buttonsPagination.forEach(button => {
        button.addEventListener("click",()=>{
            const page= button.getAttribute("button-pagination");
            url.searchParams.set("page",page);
            window.location.href=url.href
        })
    })
}
//end Pagination
