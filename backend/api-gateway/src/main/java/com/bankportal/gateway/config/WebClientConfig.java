package com.bankportal.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;
import io.netty.handler.ssl.SslContextBuilder;
import io.netty.handler.ssl.util.InsecureTrustManagerFactory;

import javax.net.ssl.SSLException;

@Configuration
public class WebClientConfig {
    
    /**
     * Configure WebClient to trust self-signed certificates
     * WARNING: Only for development! Use proper certificates in production
     */
    @Bean
    public WebClient.Builder webClientBuilder() throws SSLException {
        var sslContext = SslContextBuilder
                .forClient()
                .trustManager(InsecureTrustManagerFactory.INSTANCE)
                .build();
        
        var httpClient = HttpClient.create()
                .secure(t -> t.sslContext(sslContext));
        
        return WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient));
    }
}
