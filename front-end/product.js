let productList = document.querySelector("#productList")
let logout = document.querySelector(".logout-btn")
let newProductForm = document.querySelector("#newProductForm")
let newProductName = document.querySelector("#productName")
let newProductPrice = document.querySelector("#productPrice")
let updatedProductForm = document.querySelector("#uptatedProductForm")
let uProductName = document.querySelector("#uproductName")
let uProductPrice = document.querySelector("#uproductPrice")

let BaseUrl = "http://localhost:7777/products"


async function getProducts() {

    let tokenc = localStorage.getItem("tokenzzz")
    let products = await axios.get(BaseUrl,{
        headers:{
            "auth-tokensss":tokenc
        }
    })
    showProducts(products.data);
}


let updatedProductIdInput = document.querySelector("#updatedProductId");

function showProducts(pro) {
    productList.innerHTML=""
    pro.forEach(pel => {
        productList.innerHTML +=
        `
         <div class="product-item">
                <span>${pel.name} - $${pel.price}</span>
                <button class="trash-btn" btn-id=${pel._id}>Delete🗑️</button>
                <button class="edit-btn" btn-id=${pel._id}>Edit✏️</button>
         </div>
        `

        let delBtns = document.querySelectorAll(".trash-btn")
         delBtns.forEach(btn => {
        btn.addEventListener("click", async function(){
            let id = btn.getAttribute("btn-id")

            try {
                await axios.delete(`${BaseUrl}/${id}`, {
                    headers: {
                        "auth-tokensss": localStorage.getItem("tokenzzz")
                    }
                })
                getProducts()
            } catch (error) {
                console.log(error);
                
            } 
        })
     });


     let editBtns = document.querySelectorAll(".edit-btn");
        editBtns.forEach(btn => {
            btn.addEventListener("click", function () {
                let id = btn.getAttribute("btn-id");
                let product = pro.find(p => p._id === id);
                uProductName.value = product.name;
                uProductPrice.value = product.price;
                updatedProductIdInput.value = id;
            });
        });


    });
}


updatedProductForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    let updatedProductId = updatedProductIdInput.value;
    if (!updatedProductId) return;

    let updatedPro = {
        name: uProductName.value,
        price: uProductPrice.value
    }

    try {
        await axios.put(`${BaseUrl}/${updatedProductId}`, updatedPro, {
            headers: {
                "auth-tokensss": localStorage.getItem("tokenzzz")
            }
        });
        uProductName.value = "";
        uProductPrice.value = "";
        updatedProductIdInput.value = "";
        getProducts();
    } catch (error) {
        console.log(error);
    }
});


newProductForm.addEventListener("submit",async function(event){
    event.preventDefault()
    let newPro = {
        name: newProductName.value,
        price: newProductPrice.value
    } 
    await axios.post(`${BaseUrl}`, newPro, {
        headers: {
            "auth-tokensss": localStorage.getItem("tokenzzz")
        }
    })
    newProductName.value=""
    newProductPrice.value=""
    getProducts()
})






logout.addEventListener("click", function(){
    localStorage.removeItem("tokenzzz")
    window.location.href = "register.html"
})

function tokenControlUI() {
    let tokend = localStorage.getItem("tokenzzz")
    if(!tokend){
        window.location.href="register.html"
    }
}


getProducts()
tokenControlUI()



