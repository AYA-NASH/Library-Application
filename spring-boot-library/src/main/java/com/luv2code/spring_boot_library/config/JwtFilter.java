package com.luv2code.spring_boot_library.config;

import com.luv2code.spring_boot_library.entity.AppUser;
import com.luv2code.spring_boot_library.entity.UserPrincipal;
import com.luv2code.spring_boot_library.service.JwtService;
import com.luv2code.spring_boot_library.service.MyUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtFilter.class);

    @Autowired
    private JwtService jwtService;

    @Autowired
    private MyUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String email = null;

        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
                email = jwtService.extractEmail(token);
            }
            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                String role = jwtService.extractRole(token);
                Long userId = jwtService.extractUserId(token);

                if (!jwtService.isTokenExpired(token)) {

                    String formattedRole = role.startsWith("ROLE_") ? role : "ROLE_" + role;
                    List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(formattedRole));

                    AppUser detachedUser = new AppUser();
                    detachedUser.setId(userId);
                    detachedUser.setEmail(email);
                    detachedUser.setRole(role);
                    
                    UserPrincipal principal = new UserPrincipal(detachedUser);

                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            principal, null, authorities);

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (io.jsonwebtoken.ExpiredJwtException ex) {
            logger.warn("JWT expired: {}", ex.getMessage());
        } catch (io.jsonwebtoken.JwtException ex) {
            logger.warn("Invalid JWT: {}", ex.getMessage());
        } catch (Exception ex) {
            logger.error("Error in JwtFilter: {}", ex.getMessage(), ex);
        }

        filterChain.doFilter(request, response);
    }
}
