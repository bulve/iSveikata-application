package lt.vtvpmc.ems.isveikata;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import lt.vtvpmc.ems.isveikata.employees.Admin;
import lt.vtvpmc.ems.isveikata.employees.JpaEmployeesRepository;
import lt.vtvpmc.ems.isveikata.security.SHA256Encrypt;

@Configuration
public class AdminInit {

	@Bean
	public CommandLineRunner createAdminOnCleanInstall(JpaEmployeesRepository<Admin> repo) {
		if (repo.count() == 0) {
			return (args) -> repo.save(new Admin("vardenis", "pavardenis", "root", SHA256Encrypt.sswordEncoder.encode("123")));
		} else {
			return null;
		}
	}
//	 @Bean
//	    public CommandLineRunner statisticsQuery(JpaMedicalRecordRepository medRecordSrvc) {
//	        return (args) -> medRecordSrvc.getTotalNonRepetitiveMedicalRecordCount();
//	    }

}
