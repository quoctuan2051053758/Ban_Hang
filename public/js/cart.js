var buttonPlus = document.querySelectorAll(".qty-btn-plus");
var buttonMinus = document.querySelectorAll(".qty-btn-minus");
// Tăng số lượng
buttonPlus.forEach(button => {
    button.addEventListener("click", function() {
        var inputField = this.closest(".qty-container").querySelector("input[name='quantity']");
        inputField.value = Number(inputField.value) + 1;
        updateCart(inputField);
    });
});
// Giảm số lượng
buttonMinus.forEach(button => {
    button.addEventListener("click", function() {
        var inputField = this.closest(".qty-container").querySelector("input[name='quantity']");
        var amount = Number(inputField.value);
        if (amount > 1) {
            inputField.value = amount - 1;
            updateCart(inputField);
        }
    });
});

// Cập nhật giỏ hàng khi thay đổi số lượng
const inputQuantity = document.querySelectorAll("input[name='quantity']");
if (inputQuantity.length > 0) {
    inputQuantity.forEach(input => {
        input.addEventListener("change", () => {
            updateCart(input);
        });
    });
}

// function updateCart(input) {
//     const productId = input.getAttribute("product-id");
//     const productSize = input.getAttribute("product-size");
//     const productColor = input.getAttribute("product-color");
//     const quantity = input.value;

//     // Điều hướng đến endpoint cập nhật
//     window.location.href = `/cart/update/${productId}/${productSize}/${productColor}/${quantity}`;
// }

function updateCart(input) {
    const productId = input.getAttribute("product-id");
    const productSize = input.getAttribute("product-size");
    const productColor = input.getAttribute("product-color");
    const quantity = input.value;

    // Gửi yêu cầu Ajax đến server
    const url = `/cart/update/${productId}/${productSize}/${productColor}/${quantity}`;
    
    fetch(url, {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.error); // Lấy thông báo lỗi từ phản hồi
            });
        }
        return response.json();
    })
    .then(data => {
        // Hiển thị thông báo từ server
        displayMessage(data.success, 'success');
        location.reload(); // Tải lại trang nếu cần
    })
    .catch(error => {
        displayMessage(error.message, 'error');
        // console.error('Có lỗi xảy ra:', error);
    });
}
function displayMessage(message, type) {
    // Thay thế bằng logic hiển thị thông báo của bạn
    const messageContainer = document.createElement('div');
    messageContainer.className = `alert alert-${type}`;
    messageContainer.textContent = message;

    // Thêm thông báo vào body hoặc phần nào đó trong giao diện
    document.body.insertAdjacentElement('afterbegin', messageContainer);

    // Tự động ẩn sau một thời gian
    setTimeout(() => {
        messageContainer.remove();
    }, 3000); // 2000 ms = 2 giây
}