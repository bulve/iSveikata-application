package lt.vtvpmc.ems.isveikata;

import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class IsveikataApplication {

	private static Logger LOGGER = Logger.getLogger(IsveikataApplication.class.getName());

	public static void main(String[] args) {
		SpringApplication.run(IsveikataApplication.class, args);
	}

	public static void loggMsg(Level lev, String user, String role, String msg) {
		LOGGER.log(lev, "User:" + user + " " + role + " - " + msg);
	}

}