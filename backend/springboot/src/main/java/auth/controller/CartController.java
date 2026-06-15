package auth.controller;

import auth.model.Cart;
import auth.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    private Long getUserId(String userIdHeader) {
        if (userIdHeader == null || userIdHeader.isEmpty()) {
            throw new RuntimeException("User ID missing from headers");
        }
        return Long.parseLong(userIdHeader);
    }

    @GetMapping
    public ResponseEntity<Cart> getCart(@RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {
        try {
            Long userId = getUserId(userIdHeader);
            return ResponseEntity.ok(cartService.getCartForUser(userId));
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    @PostMapping("/items")
    public ResponseEntity<Cart> addItem(@RequestHeader(value = "X-User-Id", required = false) String userIdHeader,
                                        @RequestBody Map<String, Integer> payload) {
        try {
            Long userId = getUserId(userIdHeader);
            Integer productId = payload.get("productId");
            Integer quantity = payload.getOrDefault("quantity", 1);
            if (productId == null) return ResponseEntity.badRequest().build();
            
            return ResponseEntity.ok(cartService.addItemToCart(userId, productId.longValue(), quantity));
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Cart> removeItem(@RequestHeader(value = "X-User-Id", required = false) String userIdHeader,
                                           @PathVariable Long itemId) {
        try {
            Long userId = getUserId(userIdHeader);
            return ResponseEntity.ok(cartService.removeItemFromCart(userId, itemId));
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }
}
