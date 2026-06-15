package auth.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;

@Configuration
public class DataSourceConfig {

    @Value("${spring.datasource.url:jdbc:postgresql://localhost:5432/product_catalog}")
    private String pgUrl;

    @Value("${spring.datasource.username:postgres}")
    private String pgUsername;

    @Value("${spring.datasource.password:Rajnish@02}")
    private String pgPassword;

    @Value("${spring.datasource.driver-class-name:org.postgresql.Driver}")
    private String pgDriver;

    @Bean
    @Primary
    public DataSource dataSource() {
        try {
            // Attempt a test connection to PostgreSQL with a 2-second timeout
            Class.forName(pgDriver);
            DriverManager.setLoginTimeout(2);
            Connection conn = DriverManager.getConnection(pgUrl, pgUsername, pgPassword);
            conn.close();
            
            System.out.println(">>> Connected to PostgreSQL database successfully.");
            DriverManagerDataSource dataSource = new DriverManagerDataSource();
            dataSource.setDriverClassName(pgDriver);
            dataSource.setUrl(pgUrl);
            dataSource.setUsername(pgUsername);
            dataSource.setPassword(pgPassword);
            return dataSource;
        } catch (Exception e) {
            System.err.println(">>> PostgreSQL connection failed: " + e.getMessage() + ". Falling back to local H2 file database (h2db).");
            DriverManagerDataSource dataSource = new DriverManagerDataSource();
            dataSource.setDriverClassName("org.h2.Driver");
            dataSource.setUrl("jdbc:h2:file:./h2db;DB_CLOSE_DELAY=-1;MODE=PostgreSQL");
            dataSource.setUsername("sa");
            dataSource.setPassword("");
            return dataSource;
        }
    }
}
