const inputQuantity = document.querySelectorAll("input[name='quantity']")
if(inputQuantity.length>0){
    inputQuantity.forEach(input=>{
        input.addEventListener("change",()=>{
            // event.preventDefault();
            const productId=input.getAttribute("product-id")
            const quantity=input.value
            // $.ajax({
            //     url: `/cart/update/${productId}/${quantity}`, // Đường dẫn đến endpoint xử lý
            //     type: 'GET' ,// Sử dụng phương thức GET
                
            // });
            
            window.location.href=`/cart/update/${productId}/${quantity}`
        })
    })
}

