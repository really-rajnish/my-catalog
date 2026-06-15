package auth.dto;

public class AuthResponse {
    private String token;
    private String role;
    private Long expiresIn;

    public AuthResponse() {}

    public AuthResponse(String token, String role, Long expiresIn) {
        this.token = token;
        this.role = role;
        this.expiresIn = expiresIn;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Long getExpiresIn() { return expiresIn; }
    public void setExpiresIn(Long expiresIn) { this.expiresIn = expiresIn; }
}
