package lt.vtvpmc.ems.isveikata.medical_record;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import lombok.Data;
import lt.vtvpmc.ems.isveikata.appointment.Appointment;
import lt.vtvpmc.ems.isveikata.employees.Doctor;
import lt.vtvpmc.ems.isveikata.icd.Icd;
import lt.vtvpmc.ems.isveikata.patient.Patient;

@Entity
@Data
@Table(indexes = {
		@Index(name = "idx_icd", columnList = "icd_icd_code"),
		@Index(name = "idx_doctorId", columnList = "doctor_id"),
		@Index(name = "idx_patientId", columnList = "PATIENT_PATIENT_ID")
})
public class MedicalRecord implements Serializable {
	private static final long serialVersionUID = -5096487620147474408L;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@OneToOne
	private Appointment appointment;

	@ManyToOne
	private Doctor doctor;

	@ManyToOne
	private Patient patient;

	@ManyToOne
	private Icd icd;

	private boolean isCompensable;
	private boolean isRepetitive;

}
