package com.example.demo.security;

import com.example.demo.service.TokenService;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;
import org.springframework.beans.factory.annotation.Value;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final TokenService tokenService;
    private final List<String> allowedOrigins;

    public SecurityConfig(
            TokenService tokenService,
            @Value("${app.cors.allowed-origins:http://localhost:4200,http://localhost:4201}") String allowedOriginsProperty
    ) {
        this.tokenService = tokenService;
        this.allowedOrigins = Arrays.stream(allowedOriginsProperty.split(","))
            .filter(Objects::nonNull)
            .map(origin -> origin.trim())
                .filter(origin -> !origin.isEmpty())
                .toList();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            throw new UsernameNotFoundException("Use token-based authentication");
        };
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(allowedOrigins);
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/index.html").permitAll()
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/actuator/health", "/actuator/health/**", "/actuator/info").permitAll()
                .requestMatchers("/actuator/prometheus").permitAll()
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/contact").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/content/**").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/content/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/notes/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/notes").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/notes/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/notes/**").hasRole("ADMIN")
                .requestMatchers("/users/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(new TokenAuthenticationFilter(tokenService), UsernamePasswordAuthenticationFilter.class)
            .httpBasic(basic -> basic.disable());

        return http.build();
    }
}
