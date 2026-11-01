package com.cutletspring.auth.service;

import com.cutletspring.auth.entity.Admin;
import com.cutletspring.auth.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AdminDetailsService implements UserDetailsService {

    private final AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Admin admin = adminRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Admin not found with email: " + username));

        if (!admin.isActive()) {
            throw new UsernameNotFoundException("Admin account is deactivated");
        }

        String role = admin.getRole();
        if (!role.startsWith("ROLE_")) {
            role = "ROLE_" + role;
        }

        return new User(
                admin.getEmail(),
                admin.getPasswordHash(),
                Collections.singletonList(new SimpleGrantedAuthority(role))
        );
    }
}

