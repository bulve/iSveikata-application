package lt.vtvpmc.ems.isveikata.medical_record;

import java.util.Date;

import lombok.Data;

@Data
public class MedicalRecordDto {

	private Long id;	
	private String doctorFullName;
	private String icdCode;
	private String icdDescription;
	private Date appointmentDate;
	private Integer appoitmentDuration;
	private String appointmentDescription;
	private boolean isCompensable;
	private boolean isRepetitive;
	private String patientFullName;

}
