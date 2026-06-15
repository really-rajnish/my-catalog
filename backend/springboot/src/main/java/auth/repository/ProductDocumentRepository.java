package auth.repository;

import auth.document.ProductDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductDocumentRepository extends MongoRepository<ProductDocument, String> {
    ProductDocument findByProductId(Long productId);
}
