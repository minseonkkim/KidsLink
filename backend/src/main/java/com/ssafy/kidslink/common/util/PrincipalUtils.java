package com.ssafy.kidslink.common.util;

import com.ssafy.kidslink.common.dto.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Iterator;

public class PrincipalUtils {
    public static User getUserFromPrincipal(Object principal) {
        String username = null;
        String role = null;
        Collection<? extends GrantedAuthority> collection = null;

        if (principal instanceof UserDetails userDetails) {
            username = userDetails.getUsername();
            collection = userDetails.getAuthorities();
        } else if (principal instanceof OAuth2User oAuth2User) {
            username = oAuth2User.getAttribute("email"); // OAuth는 이메일이 username
            collection = oAuth2User.getAuthorities();
        } else {
            throw new IllegalArgumentException("Unsupported principal type");
        }

        if (username == null || collection == null) {
            throw new IllegalArgumentException("Invalid principal details.");
        }

        Iterator<? extends GrantedAuthority> it = collection.iterator();
        if (it.hasNext()) {
            GrantedAuthority auth = it.next();
            role = auth.getAuthority();
        }else {
            throw new IllegalArgumentException("No authorities found for principal.");
        }

        return new User(username,role);
    }
}
