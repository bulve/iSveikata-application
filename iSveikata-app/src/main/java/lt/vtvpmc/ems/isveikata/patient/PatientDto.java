package lt.vtvpmc.ems.isveikata.patient;

import lombok.Data;

import java.util.Date;

@Data
public class PatientDto {
	
	private String Id;
	private Date birthDate;
	private String fullName;

}
