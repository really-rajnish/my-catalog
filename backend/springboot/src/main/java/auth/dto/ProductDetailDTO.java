package auth.dto;

import auth.model.Product;
import auth.document.ProductDocument;

public class ProductDetailDTO {
    private Product sqlData;
    private ProductDocument mongoData;

    public ProductDetailDTO(Product sqlData, ProductDocument mongoData) {
        this.sqlData = sqlData;
        this.mongoData = mongoData;
    }

    // Getters
    public Product getSqlData() { return sqlData; }
    public ProductDocument getMongoData() { return mongoData; }
}
