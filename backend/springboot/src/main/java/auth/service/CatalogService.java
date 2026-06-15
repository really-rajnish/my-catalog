package auth.service;

import auth.dto.FilterRequest;
import auth.dto.SearchResultDTO;
import auth.model.Product;
import auth.repository.ProductRepository;
import auth.repository.ProductSpecifications;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CatalogService {

    private final ProductRepository productRepository;
    private final EmbeddingService embeddingService;

    public CatalogService(ProductRepository productRepository, EmbeddingService embeddingService) {
        this.productRepository = productRepository;
        this.embeddingService = embeddingService;
    }

    public Page<Product> filterProducts(FilterRequest filter, int page, int size) {
        Sort sort = Sort.unsorted();
        if ("price_asc".equals(filter.getSortBy())) {
            sort = Sort.by(Sort.Direction.ASC, "price");
        } else if ("price_desc".equals(filter.getSortBy())) {
            sort = Sort.by(Sort.Direction.DESC, "price");
        } else if ("name_asc".equals(filter.getSortBy())) {
            sort = Sort.by(Sort.Direction.ASC, "name");
        } else if ("newest".equals(filter.getSortBy())) {
            sort = Sort.by(Sort.Direction.DESC, "createdAt");
        }
        
        Pageable pageable = PageRequest.of(page, size, sort);
        return productRepository.findAll(ProductSpecifications.withFilter(filter), pageable);
    }

    public Product getProductDetails(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    @Transactional
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(Long id, Product productDetails) {
        Product existingProduct = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        
        existingProduct.setName(productDetails.getName());
        existingProduct.setBrand(productDetails.getBrand());
        existingProduct.setPrice(productDetails.getPrice());
        existingProduct.setDiscountPrice(productDetails.getDiscountPrice());
        existingProduct.setInStock(productDetails.getInStock());
        existingProduct.setStockCount(productDetails.getStockCount());
        
        existingProduct.setDescription(productDetails.getDescription());
        existingProduct.setSpecs(productDetails.getSpecs());
        existingProduct.setTags(productDetails.getTags());
        existingProduct.setEmbedding(productDetails.getEmbedding());
        
        if (productDetails.getCategory() != null) {
            existingProduct.setCategory(productDetails.getCategory());
        }

        return productRepository.save(existingProduct);
    }

    @Transactional
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public List<SearchResultDTO> keywordSearch(String q, int page, int size) {
        long start = System.currentTimeMillis();
        List<Product> products = productRepository.findByNameContainingIgnoreCaseOrBrandContainingIgnoreCase(q, q);
        long time = System.currentTimeMillis() - start;
        
        return products.stream()
                .map(p -> new SearchResultDTO(p, "Keyword match", time, 1.0f))
                .limit(size)
                .collect(Collectors.toList());
    }

    public List<SearchResultDTO> semanticSearch(String q, int limit) {
        long start = System.currentTimeMillis();
        List<Float> queryEmbedding = embeddingService.getEmbedding(q);
        
        List<Product> allDocs = productRepository.findAll();
        List<SearchResultDTO> results = new ArrayList<>();
        
        for (Product doc : allDocs) {
            if (doc.getEmbedding() != null && !doc.getEmbedding().isEmpty()) {
                float score = embeddingService.cosineSimilarity(queryEmbedding, doc.getEmbedding());
                if (score > 0.65f) { // Match threshold
                    results.add(new SearchResultDTO(doc, "Semantic match", 0L, score));
                }
            }
        }
        
        results.sort((a, b) -> Float.compare(b.getScore(), a.getScore()));
        List<SearchResultDTO> finalResults = results.stream().limit(limit).collect(Collectors.toList());
        
        long time = System.currentTimeMillis() - start;
        return finalResults.stream()
                .map(r -> new SearchResultDTO(r.getProduct(), r.getMatchType(), time, r.getScore()))
                .collect(Collectors.toList());
    }
}
