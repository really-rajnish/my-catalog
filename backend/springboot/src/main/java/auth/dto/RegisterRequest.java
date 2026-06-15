package auth.dto;

import auth.model.Role;

public class RegisterRequest {
    private String email;
    private String password;
    private Role role = Role.USER; // defaults to USER

    public RegisterRequest() {}

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}
