package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.dao.UserRepository;
import com.luv2code.spring_boot_library.entity.AppUser;
import com.luv2code.spring_boot_library.entity.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepository userRepo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        AppUser user = userRepo.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("User Not FOUND");
        }

        return new UserPrincipal(user);
    }
}
