package auth.config;

import auth.model.Category;
import auth.model.Product;
import auth.repository.CategoryRepository;
import auth.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public DatabaseSeeder(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (productRepository.count() == 0) {
            Category phones = categoryRepository.findByName("Smartphones");
            if (phones == null) {
                phones = new Category();
                phones.setName("Smartphones");
                phones.setDescription("Mobile devices");
                phones = categoryRepository.save(phones);
            }

            Product p1 = new Product();
            p1.setName("Google Pixel 8 Pro");
            p1.setBrand("Google");
            p1.setPrice(new BigDecimal("999.00"));
            p1.setCategory(phones);
            p1.setInStock(true);
            p1.setStockCount(50);
            p1.setDescription("The latest Google Pixel 8 Pro with advanced AI features.");
            
            Map<String, String> specs1 = new HashMap<>();
            specs1.put("screen", "6.7 inch OLED");
            specs1.put("processor", "Tensor G3");
            specs1.put("ram", "12GB");
            p1.setSpecs(specs1);
            p1.setTags(Arrays.asList("flagship", "ai", "camera"));

            Product p2 = new Product();
            p2.setName("Apple iPhone 15 Pro");
            p2.setBrand("Apple");
            p2.setPrice(new BigDecimal("1199.00"));
            p2.setCategory(phones);
            p2.setInStock(true);
            p2.setStockCount(30);
            p2.setDescription("The new titanium iPhone 15 Pro.");
            
            Map<String, String> specs2 = new HashMap<>();
            specs2.put("screen", "6.1 inch OLED");
            specs2.put("processor", "A17 Pro");
            specs2.put("ram", "8GB");
            p2.setSpecs(specs2);
            p2.setTags(Arrays.asList("flagship", "ios", "titanium"));

            productRepository.save(p1);
            productRepository.save(p2);
            
            System.out.println(">>> Successfully seeded products into PostgreSQL!");
        }
    }
}
