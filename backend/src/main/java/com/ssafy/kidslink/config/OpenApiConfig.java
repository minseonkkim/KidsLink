package com.ssafy.kidslink.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPI() {

        Info info = new Info().version("v2.2.0").title("KidsLink API").description("API 명세서");

        return new OpenAPI()
                .info(info);
    }
}
