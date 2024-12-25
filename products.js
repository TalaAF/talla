$(document).ready(function() {
    let allProducts = [];
    let filteredProducts = [];
    let cart = [];
    
    
    function loadProducts() {
        $('.loading-spinner').show();
        $('.products-grid').hide();
        
        $.ajax({
            url: 'https://dummyjson.com/products/category/fragrances',
            method: 'GET',
            success: function(response) {
                
                allProducts = response.products.map(product => ({
                    id: product.id,
                    name: product.title,
                    brand: product.brand,
                    description: product.description,
                    price: product.price,
                    image: product.thumbnail,
                    category: getFragranceCategory(product.title),
                    stock: product.stock
                }));
                
                filteredProducts = [...allProducts];
                displayProducts(filteredProducts);
                initializeFilters();
                
                $('.loading-spinner').hide();
                $('.products-grid').show();
            },
            error: function(xhr, status, error) {
                console.error('Error loading products:', error);
                $('.products-grid').html(
                    '<p class="error-message">Error loading products. Please try again later.</p>'
                );
                $('.loading-spinner').hide();
            }
        });
    }
    
    
    function getFragranceCategory(title) {
        const categories = {
            floral: ['rose', 'jasmine', 'flower', 'bloom', 'blossom'],
            woody: ['wood', 'oud', 'cedar', 'sandal'],
            oriental: ['spice', 'vanilla', 'amber', 'musk'],
            fresh: ['citrus', 'fresh', 'aqua', 'water', 'marine']
        };
        
        title = title.toLowerCase();
        for (let [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => title.includes(keyword))) {
                return category.charAt(0).toUpperCase() + category.slice(1);
            }
        }
        return 'Oriental'; 
    }
    
    
    function displayProducts(products) {
        const grid = $('.products-grid');
        grid.empty();
        
        if (products.length === 0) {
            grid.html('<p class="no-results">No products found matching your criteria.</p>');
            return;
        }
        
        products.forEach(product => {
            const productCard = `
                <div class="product-card" data-id="${product.id}">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" loading="lazy">
                    </div>
                    <div class="product-info">
                        <span class="brand">${product.brand}</span>
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <div class="product-details">
                            <span class="category">${product.category}</span>
                            <span class="price">$${product.price.toFixed(2)}</span>
                        </div>
                        <button class="add-to-cart" ${product.stock < 1 ? 'disabled' : ''}>
                            ${product.stock < 1 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            `;
            grid.append(productCard);
        });
    }
    
    function initializeFilters() {
        const categories = [...new Set(allProducts.map(p => p.category))];
        const categoryFilter = $('#category-filter');
        
        categoryFilter.empty();
        categoryFilter.append('<option value="">All Categories</option>');
        
        categories.forEach(category => {
            categoryFilter.append(`<option value="${category}">${category}</option>`);
        });
    }
    
    function filterProducts() {
        const searchTerm = $('#search-products').val().toLowerCase();
        const category = $('#category-filter').val();
        const priceRange = $('#price-filter').val();
        
        filteredProducts = allProducts.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                                product.description.toLowerCase().includes(searchTerm);
            const matchesCategory = !category || product.category === category;
            const matchesPrice = matchesPriceRange(product.price, priceRange);
            
            return matchesSearch && matchesCategory && matchesPrice;
        });
        
        displayProducts(filteredProducts);
    }
    
    function matchesPriceRange(price, range) {
        if (!range) return true;
        
        const [min, max] = range.split('-').map(val => val === '+' ? Infinity : Number(val));
        return price >= min && (max === Infinity || price <= max);
    }
    
  
    function addToCart(product) {
        cart.push(product);
        updateCartCount();
        updateCartDisplay();
    }
    
    function updateCartCount() {
        $('.cart-count').text(cart.length);
    }
    
    function updateCartDisplay() {
        const cartItems = $('.cart-items');
        cartItems.empty();
        
        let total = 0;
        
        cart.forEach((item, index) => {
            total += item.price;
            
            cartItems.append(`
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                    </div>
                    <button class="remove-item" data-index="${index}">&times;</button>
                </div>
            `);
        });
        
        $('.total-amount').text('$' + total.toFixed(2));
        
        $('.remove-item').click(function() {
            const index = $(this).data('index');
            cart.splice(index, 1);
            updateCartCount();
            updateCartDisplay();
        });
    }
    
   
    $('#search-products').on('input', _.debounce(filterProducts, 300));
    $('#category-filter').change(filterProducts);
    $('#price-filter').change(filterProducts);
    
    $('.cart-button').click(() => $('.cart-sidebar').addClass('open'));
    $('.close-cart').click(() => $('.cart-sidebar').removeClass('open'));
    
   
    $(document).on('click', '.add-to-cart', function() {
        const button = $(this);
        const productCard = button.closest('.product-card');
        const productId = parseInt(productCard.data('id'));
        const product = allProducts.find(p => p.id === productId);
        
        if (product) {
            
            button.addClass('added').text('Added to Cart');
            
           
            addToCart(product);
            
            
            setTimeout(() => {
                button.removeClass('added').text('Add to Cart');
            }, 2000);
        }
    });
    
    
    loadProducts();
});