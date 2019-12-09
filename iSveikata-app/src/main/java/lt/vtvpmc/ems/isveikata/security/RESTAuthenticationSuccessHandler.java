package lt.vtvpmc.ems.isveikata.security;

import java.io.IOException;
import java.util.logging.Level;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import lt.vtvpmc.ems.isveikata.IsveikataApplication;

@Component
public class RESTAuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

// adds json formatted response with logged user name and role
	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException, ServletException {
		String userRoles = "";
		for (GrantedAuthority authority : authentication.getAuthorities()) {
			if (userRoles.length() > 0)
				userRoles = userRoles + ";";
			userRoles = userRoles + authority.getAuthority();
		}
		userRoles = userRoles.replaceAll("ROLE_", "").toLowerCase();
		response.addHeader("Content-Type", "application/json; charset=utf-8");
		response.getWriter()
				.print("{\"fullName\":\"" + authentication.getName() + "\",\"role\":\"" + userRoles + "\"}");
		response.getWriter().flush();
		HttpSession session = request.getSession();
		session.setMaxInactiveInterval(30*60); // 15 min.
		clearAuthenticationAttributes(request);
		IsveikataApplication.loggMsg(Level.INFO, authentication.getName(), authentication.getAuthorities().toString(), "sucessfuly loged in");
		super.onAuthenticationSuccess(request, response, authentication);
	}
}