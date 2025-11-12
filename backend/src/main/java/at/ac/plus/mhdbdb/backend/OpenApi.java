package at.ac.plus.mhdbdb.backend;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class OpenApi {
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI().info(new Info().title("MHDBDB API")
            .description("MHDBDB API - Mittelhochdeutsche Begriffsdatenbank")
            .version("v0.0.1"));
    }    
}
