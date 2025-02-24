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
            // alert(`${product.title} has been added to the cart!`);
        }
    }
})

// Add the cart quantity display function
function updateCartQuantity() {
    const cartQuantityElement = document.querySelector("#cart-quantity");
    const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
    cartQuantityElement.textContent = totalQuantity;
}

function addToCart(product) {
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
    updateTotal();
    updateCartQuantity(); 
}

function updateCartUI() {
    const cartContainer = document.querySelector(".listCart");
    cartContainer.innerHTML = "";

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
    
    updateCartQuantity(); 
}

function changeQuantity(productId, change) {
    const product = cart.find((item) => item.id === productId);
    if (product) {
        product.quantity += change;

        if (product.quantity <= 0) {
            const index = cart.indexOf(product);
            cart.splice(index, 1);
        }
    }
    updateCartUI();
    updateTotal();
    updateCartQuantity(); 
}


// add to cart button changes
function renderProducts(products) {
    const listProductHTML = document.querySelector("#listProduct");
    listProductHTML.innerHTML = products.map(product => `
        <div id="item-cart" class="product">
            <div class="top d-flex">
                <img src="${product.url}" alt="${product.title}">
                <div class="icon d-flex">
                    <i class='bx bxs-heart'></i>
                </div>
            </div>
            <div class="bottom">
                <div class="d-flex">
                    <h4 class="h2">${product.title}</h4>
                    <button class="btn cart-btn" 
                            data-product-id="${product.id}"
                            ${cart.some(item => item.id === product.id) ? 'disabled' : ''}>
                        ${cart.some(item => item.id === product.id) ? 'Added to Cart' : 'Add to Cart'}
                    </button>
                </div>
                <div class="d-flex">
                    <div class="price">₹${product.price}</div>
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
    `).join('');
}

// Adding CSS for the disabled button state
const style = document.createElement('style');
style.textContent = `
    .cart-btn:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
        opacity: 0.8;
    }
`;
document.head.appendChild(style);

// Modifying addToCart function
function addToCart(product) {
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            id:product.id,
            title:product.title,
            price:product.price,
            quantity:1,
            url:product.url
        });
    }

    const button = document.querySelector(`.cart-btn[data-product-id="${product.id}"]`);
    if (button) {
        button.disabled = true;
        button.textContent = 'Added to Cart';
    }
    // Save cart to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cart));

    updateCartUI();
    updateTotal();
    updateCartQuantity();
}

//Updating the button states when items are removed from cart
function changeQuantity(productId, change) {
    const product = cart.find((item) => item.id === productId);
    if (product) {
        product.quantity += change;

        if (product.quantity <= 0) {
            const index = cart.indexOf(product);
            cart.splice(index, 1);
            
            //Resetting the button state when item is removed
            const button = document.querySelector(`.cart-btn[data-product-id="${productId}"]`);
            if (button) {
                button.disabled = false;
                button.textContent = 'Add to Cart';
            }
        }
    }
    // Save cart to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cart));
    updateCartUI();
    updateTotal();
    updateCartQuantity();
}

// Event listener for cart buttons
document.querySelector("#listProduct").addEventListener("click", (event) => {
    if (event.target.classList.contains("cart-btn")) {
        event.preventDefault();
        const productId = parseInt(event.target.getAttribute("data-product-id"));
        const product = listProducts.find((item) => item.id === productId);
        if (product && !event.target.disabled) {
            addToCart(product);
        }
    }
});
// This function will update the total price in the cart
function updateTotal() {
    let totalAmount = 0;
    cart.forEach(item => {
        totalAmount += item.price * item.quantity;
    });
    document.getElementById("totalPrice").innerText = `${rupeeSymbol}${totalAmount.toFixed(2)}`;
}

const initApp = () => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
        updateTotal();
        updateCartQuantity();
    }

    document.querySelector(".checkOut").addEventListener('click', function() {
        window.location.href = 'checkout.html';
    }); 

    fetch("https://lolam-anusha.github.io/Quick_Buy/products.json")
    .then((response1)=>response1.json())
    .then((data1)=>{
        listProducts = data1.products;
        // console.log(listProducts)
        loadData()
    })
}
initApp()


// // search functionality

const searchBar = document.querySelector("#searchBar");
const searchSuggestions = document.querySelector("#searchSuggestions");
let selectedSuggestionIndex = -1;

// Function to handle Enter key search
function handleEnterSearch(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const suggestions = searchSuggestions.querySelectorAll('.suggestion-item');
        
        if (selectedSuggestionIndex >= 0 && suggestions.length > 0) {
            // If a suggestion is selected, use that
            const selectedTitle = suggestions[selectedSuggestionIndex].textContent;
            searchBar.value = selectedTitle;
            filterProducts(selectedTitle);
        } else {
            // If no suggestion selected or no suggestions shown, use current input
            filterProducts(searchBar.value);
        }
        searchSuggestions.style.display = 'none';
    }
}

// Function to filter products and scroll
function filterProducts(query) {
    if (!query.trim()) {
        // If search is empty, show all products
        document.querySelectorAll('.product').forEach(product => {
            product.style.display = 'block';
        });
        return;
    }

    const products = document.querySelectorAll('.product');
    let matchFound = false;
    let firstMatch = null;

    products.forEach(product => {
        const productTitle = product.querySelector('h4').textContent.toLowerCase();
        if (productTitle.includes(query.toLowerCase())) {
            product.style.display = 'block';
            matchFound = true;
            if (!firstMatch) {
                firstMatch = product;
            }
        } else {
            product.style.display = 'none';
        }
    });

    if (!matchFound) {
        alert('No matching products found!');   
        return;
    }

    if (firstMatch) {
        // Scroll to products section first
        const productsSection = document.getElementById('products-section');
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Enhanced keyboard navigation
searchBar.addEventListener('keydown', (e) => {
    const suggestions = searchSuggestions.querySelectorAll('.suggestion-item');
    
    switch(e.key) {
        case 'Enter':
            handleEnterSearch(e);
            break;
        case 'ArrowDown':
            e.preventDefault();
            if (suggestions.length > 0) {
                selectedSuggestionIndex = (selectedSuggestionIndex + 1) % suggestions.length;
                updateSelectedSuggestion();
            }
            break;
        case 'ArrowUp':
            e.preventDefault();
            if (suggestions.length > 0) {
                selectedSuggestionIndex = selectedSuggestionIndex <= 0 ? suggestions.length - 1 : selectedSuggestionIndex - 1;
                updateSelectedSuggestion();
            }
            break;
        case 'Escape':
            searchSuggestions.style.display = 'none';
            selectedSuggestionIndex = -1;
            break;
    }
});

// Update your showSuggestions function to handle empty queries
function showSuggestions(query) {
    searchSuggestions.innerHTML = '';
    selectedSuggestionIndex = -1;
    
    if (!query.trim()) {
        searchSuggestions.style.display = 'none';
        return;
    }

    const allProducts = [
        ...Array.from(document.querySelectorAll('#products .product h4')),
        ...Array.from(document.querySelectorAll('#listProduct .product h4'))
    ];

    const matchingProducts = allProducts
        .map(product => product.textContent)
        .filter(title => title.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5);

    if (matchingProducts.length > 0) {
        matchingProducts.forEach((title, index) => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            
            const regex = new RegExp(`(${query})`, 'gi');
            const highlightedText = title.replace(regex, '<span class="highlight-text">$1</span>');
            
            div.innerHTML = highlightedText;
            
            div.addEventListener('click', () => {
                searchBar.value = title;
                searchSuggestions.style.display = 'none';
                filterProducts(title);
            });

            div.addEventListener('mouseover', () => {
                selectedSuggestionIndex = index;
                updateSelectedSuggestion();
            });

            searchSuggestions.appendChild(div);
        });

        searchSuggestions.style.display = 'block';
    } else {
        searchSuggestions.style.display = 'none';
    }
}

function updateSelectedSuggestion() {
    const suggestions = searchSuggestions.querySelectorAll('.suggestion-item');
    suggestions.forEach((suggestion, index) => {
        suggestion.classList.toggle('selected', index === selectedSuggestionIndex);
        if (index === selectedSuggestionIndex) {
            suggestion.scrollIntoView({ block: 'nearest' });
        }
    });
}

// Event listener for search input
searchBar.addEventListener('input', (e) => {
    const query = e.target.value;
    showSuggestions(query);
});

// Close suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (!searchBar.contains(e.target) && !searchSuggestions.contains(e.target)) {
        searchSuggestions.style.display = 'none';
    }
});

// Search icon click handler
document.getElementById("searchIcon").addEventListener("click", () => {
    filterProducts(searchBar.value);
    searchSuggestions.style.display = 'none';
});