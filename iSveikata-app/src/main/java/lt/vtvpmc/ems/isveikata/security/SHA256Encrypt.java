package lt.vtvpmc.ems.isveikata.security;

import org.springframework.security.authentication.encoding.ShaPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class SHA256Encrypt implements PasswordEncoder {
	
	private final ShaPasswordEncoder encoder = new ShaPasswordEncoder(256);
	private final Object salt = null;
	static public PasswordEncoder sswordEncoder = new SHA256Encrypt();
	
	@Override
	public String encode(CharSequence rawPassword) {
		return encoder.encodePassword(rawPassword.toString(), salt);
	}

	@Override
	public boolean matches(CharSequence rawPassword, String encodedPassword) {
		return encoder.isPasswordValid(encodedPassword, rawPassword.toString(), salt);
	}

}
