package auth.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
public class EmbeddingService {

    @Value("${OPENAI_API_KEY:}")
    private String openAiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final Random random = new Random();

    @SuppressWarnings("unchecked")
    public List<Float> getEmbedding(String text) {
        if (openAiKey == null || openAiKey.trim().isEmpty()) {
            return generateMockEmbedding();
        }

        try {
            String url = "https://api.openai.com/v1/embeddings";
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + openAiKey);
            headers.set("Content-Type", "application/json");

            String requestBody = "{\"input\": \"" + text.replace("\"", "\\\"").replace("\n", " ") + "\", \"model\": \"text-embedding-ada-002\"}";
            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
            Map<String, Object> body = response.getBody();
            if (body != null && body.containsKey("data")) {
                List<Map<String, Object>> dataList = (List<Map<String, Object>>) body.get("data");
                if (!dataList.isEmpty()) {
                    List<Double> doubleList = (List<Double>) dataList.get(0).get("embedding");
                    List<Float> floatList = new ArrayList<>();
                    for (Double d : doubleList) {
                        floatList.add(d.floatValue());
                    }
                    return floatList;
                }
            }
        } catch (Exception e) {
            System.err.println("OpenAI API call failed, falling back to mock embedding: " + e.getMessage());
        }
        
        return generateMockEmbedding();
    }

    private List<Float> generateMockEmbedding() {
        List<Float> embedding = new ArrayList<>(1536);
        for (int i = 0; i < 1536; i++) {
            embedding.add(random.nextFloat() * 2 - 1); // -1 to 1
        }
        // Normalize
        float sumSq = 0;
        for (Float val : embedding) {
            sumSq += val * val;
        }
        float norm = (float) Math.sqrt(sumSq);
        for (int i = 0; i < 1536; i++) {
            embedding.set(i, embedding.get(i) / norm);
        }
        return embedding;
    }
    
    public float cosineSimilarity(List<Float> vec1, List<Float> vec2) {
        if (vec1 == null || vec2 == null || vec1.size() != vec2.size()) return 0;
        float dotProduct = 0;
        float norm1 = 0;
        float norm2 = 0;
        for (int i = 0; i < vec1.size(); i++) {
            dotProduct += vec1.get(i) * vec2.get(i);
            norm1 += vec1.get(i) * vec1.get(i);
            norm2 += vec2.get(i) * vec2.get(i);
        }
        if (norm1 == 0 || norm2 == 0) return 0;
        return (float) (dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2)));
    }
}
