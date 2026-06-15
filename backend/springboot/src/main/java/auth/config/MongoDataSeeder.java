package auth.config;

import auth.document.ProductDocument;
import auth.model.Product;
import auth.repository.ProductDocumentRepository;
import auth.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;

@Component
public class MongoDataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final ProductDocumentRepository mongoRepository;

    public MongoDataSeeder(ProductRepository productRepository, ProductDocumentRepository mongoRepository) {
        this.productRepository = productRepository;
        this.mongoRepository = mongoRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Only seed if databases are empty
        if (mongoRepository.count() == 0) {
            System.out.println(">>> Seeding databases with sample products...");

            // Product 1
            Product p1 = new Product();
            p1.setName("Wireless Gaming Mouse");
            p1.setBrand("Logitech");
            p1.setPrice(BigDecimal.valueOf(49.99));
            p1.setInStock(true);
            p1.setStockCount(150);

            Product savedP1 = productRepository.save(p1);

            ProductDocument doc1 = new ProductDocument();
            doc1.setProductId(savedP1.getId());
            doc1.setDescription("High precision wireless gaming mouse with RGB lighting.");
            doc1.setTags(Arrays.asList("gaming", "mouse", "wireless", "rgb"));
            mongoRepository.save(doc1);

            // Product 2
            Product p2 = new Product();
            p2.setName("Mechanical Keyboard");
            p2.setBrand("Keychron");
            p2.setPrice(BigDecimal.valueOf(99.99));
            p2.setInStock(true);
            p2.setStockCount(75);

            Product savedP2 = productRepository.save(p2);

            ProductDocument doc2 = new ProductDocument();
            doc2.setProductId(savedP2.getId());
            doc2.setDescription("Mechanical keyboard with hot-swappable switches and aluminum frame.");
            doc2.setTags(Arrays.asList("keyboard", "mechanical", "typing"));
            mongoRepository.save(doc2);

            System.out.println(">>> Successfully seeded 2 products into PostgreSQL and MongoDB!");
        } else {
            System.out.println(">>> Database already contains data, skipping seed.");
        }
    }
}
