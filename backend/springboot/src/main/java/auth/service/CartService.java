package auth.service;

import auth.model.Cart;
import auth.model.CartItem;
import auth.model.Product;
import auth.model.User;
import auth.repository.CartItemRepository;
import auth.repository.CartRepository;
import auth.repository.ProductRepository;
import auth.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository, 
                       UserRepository userRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    public Cart getCartForUser(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            Cart newCart = new Cart();
            User user = userRepository.findById(userId).orElseThrow();
            newCart.setUser(user);
            return cartRepository.save(newCart);
        });
    }

    public Cart addItemToCart(Long userId, Long productId, int quantity) {
        Cart cart = getCartForUser(userId);
        Product product = productRepository.findById(productId).orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if item already exists
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            cartItemRepository.save(item);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            cart.getItems().add(newItem);
            cartItemRepository.save(newItem);
        }
        
        return cartRepository.findById(cart.getId()).orElse(cart);
    }

    public Cart removeItemFromCart(Long userId, Long cartItemId) {
        Cart cart = getCartForUser(userId);
        cartItemRepository.findById(cartItemId).ifPresent(item -> {
            if (item.getCart().getId().equals(cart.getId())) {
                cartItemRepository.delete(item);
            }
        });
        return cartRepository.findById(cart.getId()).orElse(cart);
    }
}
