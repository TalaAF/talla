$(document).ready(() => {
    
    let products = []
    let filteredProducts = []
    let cart = []
    

    loadProducts()


    setupEventListeners()

  
    function loadProducts() {
        
        $('.loading-spinner').show()
        $('.products-grid').hide()
       
        $.ajax({
            url: 'https://dummyjson.com/products/category/fragrances',
            method: 'GET',
            success: (data) => {
               
                products = data.products.map(p => ({
                    id: p.id,
                    name: p.title,
                    brand: p.brand,
                    description: p.description,
                    price: p.price,
                    image: p.thumbnail,
                    category: guessCategory(p.title),
                    stock: p.stock
                }))
                
                
                filteredProducts = [...products]
                showProducts(filteredProducts)
           
                setupFilters()
                
              
                $('.loading-spinner').hide()
                $('.products-grid').show()
            },
            error: (xhr, status, err) => {
                console.error('Failed to load products:', err)
                $('.products-grid').html(
                    '<p class="error-message">Oops! Something went wrong. Try refreshing the page.</p>'
                )
                $('.loading-spinner').hide()
            }
        })
    }
    
  
    function guessCategory(name) {
        name = name.toLowerCase()
        
       
        const categories = {
            floral: ['rose', 'jasmine', 'flower', 'bloom', 'blossom'],
            woody: ['wood', 'oud', 'cedar', 'sandal'],
            oriental: ['spice', 'vanilla', 'amber', 'musk'],
            fresh: ['citrus', 'fresh', 'aqua', 'water', 'marine']
        }
        
       
        for (let [cat, keywords] of Object.entries(categories)) {
            if (keywords.some(word => name.includes(word))) {
                return cat.charAt(0).toUpperCase() + cat.slice(1)
            }
        }
        
        return 'Oriental'
    }
    
   
    function showProducts(productsToShow) {
        const grid = $('.products-grid')
        grid.empty()
        
        
        if (productsToShow.length === 0) {
            grid.html('<p class="no-results">No products found. Try different filters!</p>')
            return
        }
        
        
        productsToShow.forEach(product => {
            const card = `
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
            `
            grid.append(card)
        })
    }
    
   
    function setupFilters() {
        
        const categories = [...new Set(products.map(p => p.category))]
        const categoryDropdown = $('#category-filter')
        
       
        categoryDropdown.html('<option value="">All Categories</option>')
        categories.forEach(cat => {
            categoryDropdown.append(`<option value="${cat}">${cat}</option>`)
        })
    }
    
    function filterProducts() {
        const searchText = $('#search-products').val().toLowerCase()
        const category = $('#category-filter').val()
        const priceRange = $('#price-filter').val()
        
       
        filteredProducts = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchText) || 
                                product.description.toLowerCase().includes(searchText)
            const matchesCategory = !category || product.category === category
            const matchesPrice = checkPriceRange(product.price, priceRange)
            
            return matchesSearch && matchesCategory && matchesPrice
        })
        
        showProducts(filteredProducts)
    }
    
   
    function checkPriceRange(price, range) {
        if (!range) return true
        
        const [min, max] = range.split('-').map(v => v === '+' ? Infinity : Number(v))
        return price >= min && (max === Infinity || price <= max)
    }
    
   
    function addToCart(product) {
        cart.push(product)
        updateCart()
    }
    
    
    function updateCart() {
     
        $('.cart-count').text(cart.length)
        
        
        const cartItems = $('.cart-items')
        cartItems.empty()
        
        let total = 0
        
        cart.forEach((item, i) => {
            total += item.price
            
            const cartItem = `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                    </div>
                    <button class="remove-item" data-index="${i}">&times;</button>
                </div>
            `
            cartItems.append(cartItem)
        })
        
        // Update total price
        $('.total-amount').text('$' + total.toFixed(2))
        
        // Set up remove buttons
        $('.remove-item').click(function() {
            const index = $(this).data('index')
            cart.splice(index, 1)
            updateCart()
        })
    }
    
    
    function showAddedMessage(button) {
        const oldText = button.text()
        const oldColor = button.css('background-color')
        button.text('Added to Cart')
              .prop('disabled', true)
              .css('background-color', '#8B7E74') // matches --primary-color
        
        setTimeout(() => {
            button.text(oldText)
                  .prop('disabled', false)
                  .css('background-color', '#92817A') // matches --accent-color
        }, 1500)
    }
    
    
    function setupEventListeners() {
        // Search and filter changes
        $('#search-products').on('input', _.debounce(filterProducts, 300))
        $('#category-filter').change(filterProducts)
        $('#price-filter').change(filterProducts)
        
        // Cart open/close
        $('.cart-button').click(() => $('.cart-sidebar').addClass('open'))
        $('.close-cart').click(() => $('.cart-sidebar').removeClass('open'))
        
        // Add to cart buttons
        $(document).on('click', '.add-to-cart', function() {
            const card = $(this).closest('.product-card')
            const id = parseInt(card.data('id'))
            const product = products.find(p => p.id === id)
            
            if (product) {
                addToCart(product)
                showAddedMessage($(this))
            }
        })
    }
})
