package lt.vtvpmc.ems.isveikata.employees;

import java.util.List;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lt.vtvpmc.ems.isveikata.medical_record.MedicalRecord;
import lt.vtvpmc.ems.isveikata.patient.Patient;
import lt.vtvpmc.ems.isveikata.prescription.Prescription;
import lt.vtvpmc.ems.isveikata.specialization.Specialization;

@Entity
@EqualsAndHashCode(callSuper = true)
@Data
@DiscriminatorValue(value = "doctor")
public class Doctor extends Employee {

	@ManyToOne(fetch = FetchType.LAZY)
	private Specialization specialization;

	@JsonIgnore
	@OneToMany(mappedBy = "doctor")
	private List<Patient> patient;

	@JsonIgnore
	@OneToMany(mappedBy = "doctor")
	private List<MedicalRecord> medicalRecords;

	@JsonIgnore
	@OneToMany(mappedBy = "doctor")
	private List<Prescription> prescriptions;

}
