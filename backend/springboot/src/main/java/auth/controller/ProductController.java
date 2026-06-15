package auth.controller;

import auth.dto.FilterRequest;
import auth.dto.ProductDetailDTO;
import auth.model.Product;
import auth.service.CatalogService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    private final CatalogService catalogService;

    public ProductController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping
    public ResponseEntity<Page<Product>> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(catalogService.filterProducts(new FilterRequest(), page, size));
    }

    @PostMapping("/filter")
    public ResponseEntity<Page<Product>> filterProducts(
            @RequestBody FilterRequest filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(catalogService.filterProducts(filter, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailDTO> getProduct(@PathVariable Long id) {
        ProductDetailDTO product = catalogService.getProductDetails(id);
        if (product == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(product);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDetailDTO> createProduct(@RequestBody ProductDetailDTO payload) {
        return ResponseEntity.ok(catalogService.createProduct(payload.getSqlData(), payload.getMongoData()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDetailDTO> updateProduct(@PathVariable Long id, @RequestBody ProductDetailDTO payload) {
        return ResponseEntity.ok(catalogService.updateProduct(id, payload.getSqlData(), payload.getMongoData()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        catalogService.deleteProduct(id);
        return ResponseEntity.ok().build();
    }
}
