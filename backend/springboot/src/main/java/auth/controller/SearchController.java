package auth.controller;

import auth.dto.SearchResultDTO;
import auth.service.CatalogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/search")
public class SearchController {

    private final CatalogService catalogService;

    public SearchController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping("/keyword")
    public ResponseEntity<List<SearchResultDTO>> keywordSearch(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(catalogService.keywordSearch(q, page, size));
    }

    @GetMapping("/semantic")
    public ResponseEntity<List<SearchResultDTO>> semanticSearch(
            @RequestParam String q,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(catalogService.semanticSearch(q, limit));
    }
}
