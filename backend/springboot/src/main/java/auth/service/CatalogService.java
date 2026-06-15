package auth.service;

import auth.document.ProductDocument;
import auth.document.SearchLogDocument;
import auth.dto.FilterRequest;
import auth.dto.ProductDetailDTO;
import auth.dto.SearchResultDTO;
import auth.model.Product;
import auth.repository.ProductDocumentRepository;
import auth.repository.ProductRepository;
import auth.repository.ProductSpecifications;
import auth.repository.SearchLogRepository;
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
    private final ProductDocumentRepository mongoRepository;
    private final EmbeddingService embeddingService;
    private final SearchLogRepository searchLogRepository;

    public CatalogService(ProductRepository productRepository, ProductDocumentRepository mongoRepository, 
                          EmbeddingService embeddingService, SearchLogRepository searchLogRepository) {
        this.productRepository = productRepository;
        this.mongoRepository = mongoRepository;
        this.embeddingService = embeddingService;
        this.searchLogRepository = searchLogRepository;
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

    public ProductDetailDTO getProductDetails(Long id) {
        Product product = productRepository.findById(id).orElse(null);
        if (product == null) return null;
        
        ProductDocument doc = mongoRepository.findByProductId(id);
        return new ProductDetailDTO(product, doc);
    }

    @Transactional
    public ProductDetailDTO createProduct(Product product, ProductDocument doc) {
        Product savedProduct = productRepository.save(product);
        if (doc != null) {
            doc.setProductId(savedProduct.getId());
            mongoRepository.save(doc);
        } else {
            doc = new ProductDocument();
            doc.setProductId(savedProduct.getId());
            mongoRepository.save(doc);
        }
        return new ProductDetailDTO(savedProduct, doc);
    }

    @Transactional
    public ProductDetailDTO updateProduct(Long id, Product productDetails, ProductDocument docDetails) {
        Product existingProduct = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        
        existingProduct.setName(productDetails.getName());
        existingProduct.setBrand(productDetails.getBrand());
        existingProduct.setPrice(productDetails.getPrice());
        existingProduct.setDiscountPrice(productDetails.getDiscountPrice());
        existingProduct.setInStock(productDetails.getInStock());
        existingProduct.setStockCount(productDetails.getStockCount());
        
        // Note: keeping category ID as is for simplicity, or we can update it too.
        if (productDetails.getCategory() != null) {
            existingProduct.setCategory(productDetails.getCategory());
        }

        Product savedProduct = productRepository.save(existingProduct);
        
        ProductDocument existingDoc = mongoRepository.findByProductId(id);
        if (existingDoc == null) {
            existingDoc = new ProductDocument();
            existingDoc.setProductId(id);
        }
        if (docDetails != null) {
            existingDoc.setDescription(docDetails.getDescription());
            existingDoc.setSpecs(docDetails.getSpecs());
            existingDoc.setTags(docDetails.getTags());
        }
        mongoRepository.save(existingDoc);
        
        return new ProductDetailDTO(savedProduct, existingDoc);
    }

    @Transactional
    public void deleteProduct(Long id) {
        ProductDocument doc = mongoRepository.findByProductId(id);
        if (doc != null) {
            mongoRepository.delete(doc);
        }
        productRepository.deleteById(id);
    }

    public List<SearchResultDTO> keywordSearch(String q, int page, int size) {
        long start = System.currentTimeMillis();
        List<Product> products = productRepository.findByNameContainingIgnoreCaseOrBrandContainingIgnoreCase(q, q);
        long time = System.currentTimeMillis() - start;
        
        logSearch(q, "keyword", products.size(), time);
        
        return products.stream()
                .map(p -> new SearchResultDTO(p, "Keyword match", time, 1.0f))
                .limit(size)
                .collect(Collectors.toList());
    }

    public List<SearchResultDTO> semanticSearch(String q, int limit) {
        long start = System.currentTimeMillis();
        List<Float> queryEmbedding = embeddingService.getEmbedding(q);
        
        List<ProductDocument> allDocs = mongoRepository.findAll();
        List<SearchResultDTO> results = new ArrayList<>();
        
        for (ProductDocument doc : allDocs) {
            if (doc.getEmbedding() != null) {
                float score = embeddingService.cosineSimilarity(queryEmbedding, doc.getEmbedding());
                if (score > 0.65f) { // Match threshold
                    Product p = productRepository.findById(doc.getProductId()).orElse(null);
                    if (p != null) {
                        results.add(new SearchResultDTO(p, "Semantic match", 0L, score));
                    }
                }
            }
        }
        
        results.sort((a, b) -> Float.compare(b.getScore(), a.getScore()));
        List<SearchResultDTO> finalResults = results.stream().limit(limit).collect(Collectors.toList());
        
        long time = System.currentTimeMillis() - start;
        List<SearchResultDTO> timedResults = finalResults.stream()
                .map(r -> new SearchResultDTO(r.getProduct(), r.getMatchType(), time, r.getScore()))
                .collect(Collectors.toList());
                
        logSearch(q, "semantic", timedResults.size(), time);
        return timedResults;
    }

    private void logSearch(String q, String type, int count, long time) {
        SearchLogDocument log = new SearchLogDocument();
        log.setQuery(q);
        log.setType(type);
        log.setResultsCount(count);
        log.setTimeTakenMs(time);
        searchLogRepository.save(log);
    }
}
