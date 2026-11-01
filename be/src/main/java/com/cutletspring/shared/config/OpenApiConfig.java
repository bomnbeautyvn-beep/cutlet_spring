package com.cutletspring.shared.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Cutlet Spring API")
                        .version("1.0.0")
                        .description("Production-ready full-stack backend APIs for Cutlet Spring Japanese-Korean Tonkatsu Atelier. Supports public menu discovery, order ticket submission, table reservations, and administrative management.")
                        .contact(new Contact()
                                .name("Cutlet Spring Engineering")
                                .email("atelier@cutletspring.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0")));
    }
}

