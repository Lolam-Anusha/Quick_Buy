// slider code
const swiper = new Swiper(".mySwiper", {
    grabCursor: true,
    slidesPerView: 1,
    spaceBetween: 70,
    pagination: {
        el: ".custom-pagination",
        clickable: true,
    },
    breakpoints: {
        567: {
            slidesPerView: 2,
        },
        996: {
            slidesPerView: 3,
        },
    },
});

// fetching the  products from products.json
// collection section
const getProducts = async () => {
    try {
        const results = await fetch("https://lolam-anusha.github.io/Quick_Buy/products.json");
        const data = await results.json();
        const products = data.products;
        return products;

    }
    catch (error) {
        console.log(error)
    }
}
// getProducts()
const ProductWrapper = document.getElementById("products");
window.addEventListener("DOMContentLoaded", async function (){
    let products = await getProducts();
    products = products.filter((product) => product.category === "Dresses");
    displayProductItems(products);
    loadData();
})
var rupeeSymbol = "\u20B9"
// display the products
const displayProductItems = (items)=>{
    let displayProduct = items.map(
        (product) => `<div class="swiper-slide">
                        <div class="product">
                            <div class="top d-flex">
                                <img src=${product.url} alt="product1">
                                <div class="icon d-flex">
                                    <i class='bx bxs-heart'></i>
                                </div>
                            </div>
                            <div class="bottom">
                                <h4>${product.title}</h4>
                                <div class="d-flex">
                                    <div class="price">${rupeeSymbol}${product.price}</div>
                                    <div class="rating">
                                        <i class='bx bxs-star'></i>
                                        <i class='bx bxs-star'></i>
                                        <i class='bx bxs-star'></i>
                                        <i class='bx bxs-star'></i>
                                        <i class='bx bxs-star'></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
    );
    displayProduct = displayProduct.join("");
    ProductWrapper.innerHTML = displayProduct;
};

// filter the products based on categories
const filters = [...document.querySelectorAll(".filters div")];
filters.forEach((filter)=>{
    filters[2].classList.add("active");
    filter.addEventListener("click", async (e) => {
        const id = e.target.getAttribute("data-filter");
        const target = e.target;
        const products = await getProducts();
        filters.forEach((btn) => {
            btn.classList.remove("active");
        })
        target.classList.add("active");

        let menuCategory = products.filter((product) => {
            if(product.category === id) {
                return product;
            }
        });
        displayProductItems(menuCategory);
        swiper.update()
    })
})


// display products and loadmore functionality
var categoriesProducts = document.querySelector(".categories .products");
const loadmore = document.querySelector(".loadmore");
let currentIndex = 0;
async function loadData(){
    let maxResult = 4;
    // let products = await getProducts();
    if(listProducts.length === 0){
        listProducts = await getProducts();
    }
    if(currentIndex >= listProducts.length){
        loadmore.disabled = true;
        loadmore.innerText = "No More Products";
        return;
    }
    for(let i=0; i<maxResult; i++){
        const product = listProducts[i + currentIndex];
        if(!product) break;
        categoriesProducts.insertAdjacentHTML(
            "beforeend", 
            `<div id="item-cart" class="product">
                <div class="top d-flex">    
                    <img src="${product.url}" alt="${product.title}">
                    <div class="icon d-flex">
                        <i class='bx bxs-heart'></i>
                    </div>
                </div>
                <div class="bottom">
                    <div class="d-flex">
                        <h4 class="h2">${product.title}</h4>
                        <a href="javascript:void(0)" id="addCart" class="btn cart-btn" data-product-id="${product.id}">Add to Cart</a>
                    </div>
                    <div class="d-flex">
                        <div id="price" class="price">${rupeeSymbol}${product.price}</div>
                        <div class="rating">
                            <i class='bx bxs-star'></i>
                            <i class='bx bxs-star'></i>
                            <i class='bx bxs-star'></i>
                            <i class='bx bxs-star'></i>
                            <i class='bx bxs-star'></i>
                        </div>
                    </div>
                </div>
            </div>`
        )
    };
    currentIndex += maxResult;
   
}
loadmore.addEventListener("click", loadData);


// cart
// Select elements
let iconCart = document.querySelector("#icon-cart");
let closeCart = document.querySelector("#close");
let cartSection = document.querySelector(".cartTab");
let listProductHTML = document.querySelector("#listProduct");

let listProducts = [];
let cart=[]
let cartQuantity = 0; 
// Function to show the cart
iconCart.addEventListener("click", () => {
    cartSection.classList.add("active"); 
});

// Function to hide the cart
closeCart.addEventListener("click", () => {
    cartSection.classList.remove("active");
});



categoriesProducts.addEventListener("click", (event)=>{
    if (event.target.classList.contains("cart-btn")) {
        const productId = parseInt(event.target.getAttribute("data-product-id"));
        const product = listProducts.find((item) => item.id === productId);
        if (product) {
            addToCart(product);
            alert(`${product.title} has been added to the cart!`);
        }
    }
})

function addToCart(product) {
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
        // If the product already exists in the cart, increase its quantity
        existingProduct.quantity++;
    } else {
        // If the product doesn't exist, add it with a quantity of 1
        cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
    updateTotal()   
}

// Function to update the cart UI
function updateCartUI() {
    const cartContainer = document.querySelector(".listCart");
    cartContainer.innerHTML = ""; // Clear the current cart items

    cart.forEach((item) => {
        cartContainer.insertAdjacentHTML(
            "beforeend",
            `<div class="cartitem">
                <div class="cartimage">
                    <img src="${item.url}" alt="${item.title}">
                </div>
                <div class="name">${item.title}</div>
                <div class="totalPrice">${rupeeSymbol}${item.price * item.quantity}</div>
                <div class="quantity">
                    <span class="minus" data-product-id="${item.id}"><i class='bx bx-minus'></i></span>
                    <span>${item.quantity}</span>
                    <span class="plus" data-product-id="${item.id}"><i class='bx bx-plus'></i></span>
                </div>
            </div>`
        );
    });
    // Add event listeners to the "+" and "-" buttons for quantity adjustment
    const plusButtons = document.querySelectorAll(".plus");
    const minusButtons = document.querySelectorAll(".minus");

    plusButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            const productId = parseInt(event.target.closest(".plus").getAttribute("data-product-id"));
            changeQuantity(productId, 1);
        });
    });

    minusButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            const productId = parseInt(event.target.closest(".minus").getAttribute("data-product-id"));
            changeQuantity(productId, -1);
        });
    });
}

// Function to change the quantity of a product in the cart
function changeQuantity(productId, change) {
    const product = cart.find((item) => item.id === productId);
    if (product) {
        product.quantity += change;

        if (product.quantity <= 0) {
            // Remove the product from the cart if the quantity is 0 or less
            const index = cart.indexOf(product);
            cart.splice(index, 1);
        }
    }
    updateCartUI();
    updateTotal()
} 

// This function will update the total price in the cart
function updateTotal() {
    let totalAmount = 0;
    cart.forEach(item => {
        totalAmount += item.price * item.quantity;
    });
    document.getElementById("totalPrice").innerText = `${rupeeSymbol}${totalAmount.toFixed(2)}`;
}

const initApp = () => {
    fetch("https://lolam-anusha.github.io/Quick_Buy/products.json")
    .then((response1)=>response1.json())
    .then((data1)=>{
        listProducts = data1.products;
        // console.log(listProducts)
        loadData()
    })
}
initApp()


// search functionality
const searchBar = document.querySelector("#searchBar");

// Event listener for the search bar
searchBar.addEventListener("input", () => {
    const query = searchBar.value.toLowerCase();
    filterProducts(query);
});


document.getElementById("searchIcon").addEventListener("click", () => {
    const searchQuery = document.getElementById("searchBar").value.toLowerCase();
    const products = document.querySelectorAll(".product");
    let firstMatch = null;

    products.forEach((product) => {
        const productName = product.querySelector("h4").innerText.toLowerCase();
        if (productName.includes(searchQuery)) {
            product.style.display = "block"; 
            if (!firstMatch) {
                firstMatch = product; 
            }
        } else {
            product.style.display = "none"; 
        }
    });

    if (firstMatch) {
        firstMatch.scrollIntoView({
            behavior: "smooth", 
            block: "start",   
        });
        // Optionally, highlight the first match
        products.forEach((product) => product.classList.remove("highlight")); // Remove previous highlights
        firstMatch.classList.add("highlight");
    } else {
        alert("No matching products found!");
    }
});