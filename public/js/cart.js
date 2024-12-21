var buttonPlus = document.querySelectorAll(".qty-btn-plus");
var buttonMinus = document.querySelectorAll(".qty-btn-minus");

// Gán sự kiện cho nút tăng số lượng

buttonPlus.forEach(button => {
    button.addEventListener("click", incrementQuantity);
});

// Gán sự kiện cho nút giảm số lượng
buttonMinus.forEach(button => {
    button.addEventListener("click", decrementQuantity);
});

// Hàm tăng số lượng
function incrementQuantity() {
    var inputField = this.closest(".qty-container").querySelector("input[name='quantity']");
    inputField.value = Number(inputField.value) + 1;
    updateCart(inputField);
}

// Hàm giảm số lượng
function decrementQuantity() {
    var inputField = this.closest(".qty-container").querySelector("input[name='quantity']");
    var amount = Number(inputField.value);
    if (amount > 1) {
        inputField.value = amount - 1;
        updateCart(inputField);
    }
}

// Cập nhật giỏ hàng khi thay đổi số lượng
const inputQuantity = document.querySelectorAll("input[name='quantity']");
if (inputQuantity.length > 0) {
    inputQuantity.forEach(input => {
        input.addEventListener("change", quantityChange);
    });
}

// Hàm xử lý thay đổi số lượng
function quantityChange() {
    const newValue = Number(this.value);
    // Kiểm tra số lượng không âm
    if (newValue < 1) {
        this.value = 1; // Đặt lại về 1 nếu nhỏ hơn 1
    }
    updateCart(this);
}

function updateCart(input) {
    const productId = input.getAttribute("product-id");
    const productSize = input.getAttribute("product-size");
    const productColor = input.getAttribute("product-color");
    const quantity = input.value;

    // Gửi yêu cầu Ajax đến server
    const url = `/cart/update/${productId}/${productSize}/${productColor}/${quantity}`;
    
    fetch(url, {
        method: 'GET', // Hoặc 'POST' nếu cần
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.error);
            });
        }
        return response.json();
    })
    .then(data => {
        displayMessage(data.success, 'success');
        location.reload(); // Tải lại trang nếu cần
    })
    .catch(error => {
        console.error("Lỗi:", error);
        displayMessage(error.message, 'error');
    });
}

function displayMessage(message, type) {
    const messageContainer = document.createElement('div');
    messageContainer.className = `alert alert-${type}`;
    messageContainer.textContent = message;

    document.body.insertAdjacentElement('afterbegin', messageContainer);

    setTimeout(() => {
        messageContainer.remove();
    }, 3000);
}