package lt.vtvpmc.ems.isveikata.patient;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lt.vtvpmc.ems.isveikata.medical_record.MedicalRecordDto;
import lt.vtvpmc.ems.isveikata.prescription.PrescriptionDto;

@RestController
@RequestMapping(value = "/api/patient")
@CrossOrigin(origins = "*")
public class PatientController {

	@Autowired
	private PatientService patientService;
	
	/**
	 * Gets all active patients URL: /api/patient
	 *
	 * @return list of all patient
	 */
	@GetMapping("/")
	private Page<PatientDto> getPagedPatient(Pageable pageable) {
		return patientService.getAllPagedActivePatient(pageable);
	}

	/**
	 * Gets all active patients by searchValue(firstName, lastName, patientId) URL:
	 * /api/patient/search/{searchValue}
	 *
	 * @return list of all patient
	 */
	@GetMapping("/search/{searchValue}")
	private Page<PatientDto> getPagedPatientBySearchValue(@PathVariable String searchValue, Pageable pageable) {
		return patientService.getAllPagedPatientBySearchValue(pageable, searchValue);
	}

	/**
	 * Gets all active and not bind with doctor patients URL: /api/doctor/notbind.
	 *
	 * @return all active and not bind with doctor patients
	 */
	@GetMapping("/notbind")
	private Page<PatientDto> getPatientListWithoutDoctor(Pageable pageable) {
		return patientService.getPatientListWithoutDoctor(pageable);
	}
	/**
	 * Gets all active and not bind with doctor patients by searchValue (firstName, lastName, patientId)
	 *
	 * @return all active and not bind with doctor patients
	 */
	@GetMapping("/notbind/{searchValue}/search")
	private Page<PatientDto> getPatientListWithoutDoctor(@PathVariable String searchValue, Pageable pageable) {
		return patientService.getPatientListWithoutDoctorBySearchValue(searchValue, pageable);
	}

	/**
	 * Gets patient by patientId
	 * 
	 * @param patientId
	 * @return patient by patientId
	 */
	@GetMapping("/{patientId}")
	private PatientDto getPatientById(@PathVariable String patientId) {
		return patientService.getPatient(patientId);
	}

	/**
	 * Gets all records URL: api/{patientId}/record
	 * 
	 * @param patientId
	 * @return list of all patient
	 */
	@GetMapping("/{patientId}/record")
	private Page<MedicalRecordDto> getRecordList(@PathVariable("patientId") String patientId, Pageable pageable) {
		return patientService.getPatientRecordList(patientId, pageable);
	}

	/**
	 * Gets all records URL: api/{patientId}/prescription
	 *
	 * @param patientId
	 * @return list of all patient
	 */
	@GetMapping("/{patientId}/prescription")
	private Page<PrescriptionDto> getPrescriptionList(@PathVariable("patientId") String patientId, Pageable pageable) {
		return patientService.getPatientPrescriptionList(patientId, pageable);
	}

	/**
	 * Gets all records URL: api/{patientId}/prescription/druggist for druggist all valid date prescription
	 *
	 * @param patientId
	 * @return list of all patient preascription that are valid by date
	 */
	@GetMapping("/{patientId}/prescription/druggist")
	private List<PrescriptionDto> getPrescriptionListForDruggist(@PathVariable("patientId") String patientId) {
		return patientService.getPatientPrescriptionListAfterDate(patientId);
	}

	/**
	 * Change patient password in data base. URL: /{patient_id}/password
	 * 
	 * @param fields
	 *            with oldPassword and newPssword keys
	 * 
	 * @param patientId
	 *            as path variable
	 * 
	 */
	@PutMapping("/{patientId}/password")
	private ResponseEntity<String> update(@RequestBody final Map<String, String> fields,
			@PathVariable final String patientId) {
		boolean passwordChangeIsValid = patientService.updatePatientPassword(fields.get("oldPassword"),
				fields.get("newPassword"), patientId);
		return passwordChangeIsValid
				? ResponseEntity.status(HttpStatus.ACCEPTED).body("Slaptažodis pakeistas sėkmingai")
				: ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Neteisingas slaptažodis");
	}
	
}
