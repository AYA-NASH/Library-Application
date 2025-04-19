package com.luv2code.spring_boot_library.config;

import com.luv2code.spring_boot_library.entity.Book;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class DataRestConfig implements RepositoryRestConfigurer {

    private String allowedOrigins = "http://localhost:3000";

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config,
                                                     CorsRegistry cors) {
        HttpMethod[] unSupported = {HttpMethod.PUT, HttpMethod.DELETE, HttpMethod.POST, HttpMethod.PATCH};

        disableHttpMethods(config, Book.class, unSupported);

        cors.addMapping(config.getBasePath() + "/**")
                .allowedOrigins(allowedOrigins);
    }

    private void disableHttpMethods(RepositoryRestConfiguration config,
                                    Class entityClass,
                                    HttpMethod[] unSupportedMethods){
        config.getExposureConfiguration()
                .forDomainType(entityClass)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(unSupportedMethods))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(unSupportedMethods));

    }
}
