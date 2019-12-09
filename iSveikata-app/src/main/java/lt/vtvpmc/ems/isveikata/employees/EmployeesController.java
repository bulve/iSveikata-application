package lt.vtvpmc.ems.isveikata.employees;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import lt.vtvpmc.ems.isveikata.medical_record.MedicalRecordService;
import lt.vtvpmc.ems.isveikata.patient.Patient;
import lt.vtvpmc.ems.isveikata.patient.PatientDto;
import lt.vtvpmc.ems.isveikata.patient.PatientService;
import lt.vtvpmc.ems.isveikata.prescription.PrescriptionSevice;

/**
 * The Class EmployeesController.
 */
@RestController
@RequestMapping(value = "/api")
@CrossOrigin(origins = "*")
public class EmployeesController {

	/** The employees service. */
	@Autowired
	private EmployeesService employeesService;

	/** The medical record service. */
	@Autowired
	private MedicalRecordService medicalRecordService;

	/** The patient service. */
	@Autowired
	private PatientService patientService;

	/** The Prescription service */
	@Autowired
	private PrescriptionSevice prescriptionSevice;

	/**
	 * Insert user. Insert new user into data base with unique userName. Return
	 * response if userName is not unique. URL: /api/admin/new/user
	 *
	 * @param map
	 *            map with two object Employee and Specialization
	 * @return the response entity
	 */
	@PostMapping("/admin/new/user")
	private ResponseEntity<String> insertUserValid(@RequestBody Map<String, Object> map) {
		return employeesService.addEmployee(map);
	}

	/**
	 * Insert patient. Insert new patient into data base with unique patientId.
	 * Return response if patientId is not unique. URL: /api/admin/new/patient
	 *
	 * @param patient
	 *            the new patient info from UI
	 * @return the response entity
	 */
	@PostMapping("/admin/new/patient")
	private ResponseEntity<String> insertPatientValid(@RequestBody Patient patient) {
		if (patientService.addNewPatient(patient)) {
			return ResponseEntity.status(HttpStatus.CREATED).body("Sukurtas naujas pacientas");
		} else {
			return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
					.body("Pacientas su tokiu asmens kodu jau egzistuoja");
		}
	}

	// Validuoti kad naujai priskiriami pacientai gydytojui neturi priskirto
	// paciento ir kad gydytojui nera priskirtas tas pacientas.
	/**
	 * Binding. Adds new bind between doctor and patient with validation is patient
	 * not bind to doctor. URL: /api/admin/new/bind/{userName}/to/{patientId}
	 *
	 * @param userName
	 *            the doctor id
	 * @param patientId
	 *            the patient id
	 * @return the response entity
	 */
	@PostMapping("/admin/new/bind/{userName}/to/{patientId}")
	private ResponseEntity<String> bindingValid(@PathVariable String userName, @PathVariable String patientId) {
		if (employeesService.validateBindDoctrorToPatient(userName, patientId)) {
			employeesService.bindDoctorToPatient(userName, patientId);
			return ResponseEntity.status(HttpStatus.CREATED).body("Pacientas priskirtas gydytojui");
		} else {
			return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(
					"Pacientas jau buvo priskirtas daktarui anksciau, arba bandote priskirti pacienta ne daktarui");
		}
	}

	/**
	 * Creates the record. Creates appointment record, using data from request body.
	 * In body additional must be specified doctro ID, patient ID and appoitment
	 * duration time.
	 * 
	 * URL: /api/doctor/new/record
	 *
	 * @param map
	 *            with 4 object : MedicalRecord, Appointment, Strin patientId, Strin
	 *            userName
	 */
	@PostMapping("/doctor/new/record")
	private <T extends Object> ResponseEntity<String> createRecord(@RequestBody Map<String, Object> map) {
		if(medicalRecordService.createNewRecord(map)){
			return ResponseEntity.status(HttpStatus.CREATED).body(
					"Ligos įrašas buvo skemingai sukurtas");
		}else {
			return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(
					"Ligos įrašas nebuvo sukurtas, dėl netinkamų duomenų");
		}
	}

	/**
	 *
	 */
	@PostMapping("/doctor/new/prescription")
	@ResponseStatus(HttpStatus.CREATED)
	private <T extends Object> void createPrescription(@RequestBody Map<String, Object> map) {
		prescriptionSevice.createNewPrescription(map);
	}

	/**
	 * Gets all active doctors URL: /api/doctor.
	 *
	 * @return list of all doctors
	 */
	@GetMapping("/doctor")
	private Page<DoctorDto> getAllDoctors(Pageable pageable) {
		return employeesService.getActiveDoctorsList(pageable);
	}

	/**
	 * Get active doctor list (paged) by searchValue (firstName or lastName)
	 *
	 * @param searchValue
	 * @return list of active doctor by searchValue
	 */
	@GetMapping("/doctor/{searchValue}/search")
	private Page<DoctorDto> getAllDoctorBySearchValue(@PathVariable String searchValue, Pageable pageable) {
		return employeesService.getActiveDoctorBySearchValue(searchValue, pageable);
	}

	/**
	 * Gets all active patient from given doctor URL:
	 * /api/doctor/{userName}/patient.
	 *
	 * @param userName
	 *            the user name
	 * @return list of all patient of current doctor
	 */
	@GetMapping("/doctor/{userName}/patient")
	@ResponseStatus(HttpStatus.OK)
	private Page<PatientDto> getAllPagedPatientByDoctor(@PathVariable final String userName, Pageable pageable) {
		return patientService.getAllPagedPatientByDoctor(pageable, userName);
	}

	/**
	 * Gets all active patient nu doctor userName for csv export:
	 * /api/doctor/{userName}/patient/csv.
	 *
	 * @param userName
	 *            the user name
	 * @return list of all patient of current doctor
	 */
	@GetMapping("/doctor/{userName}/patient/csv")
	@ResponseStatus(HttpStatus.OK)
	private List<Object> getAllPagedPatientByDoctorForCsv(@PathVariable final String userName) {
		return patientService.getAllPagedPatientByDoctorForCsv(userName);
	}

	/**
	 * Gets all active patient from given doctor URL:
	 * /api/doctor/{userName}/patient.
	 *
	 * @param userName
	 *            the user name
	 * @return list of all patient of current doctor
	 */
	@GetMapping("/doctor/{userName}/patient/{searchValue}")
	@ResponseStatus(HttpStatus.OK)
	private Page<PatientDto> getAllPagedPatientByDoctorAndBySearchValue(@PathVariable final String userName,
			@PathVariable final String searchValue, Pageable pageable) {
		return patientService.getAllPagedPatientByDoctorAndBySearchValue(pageable, userName, searchValue);
	}
	

	/**
	 * Change employee password in data base. URL: /{userName}/password
	 *
	 * @param fields
	 *            the fields
	 * @param userName
	 *            the user name
	 */
	@PutMapping("/{userName}/password")
	private ResponseEntity<String> updatePassword(@RequestBody final Map<String, String> fields,
			@PathVariable final String userName) {
		boolean passwordChangeIsValid = employeesService.updateUserPassword(fields.get("oldPassword"),
				fields.get("newPassword"), userName);
		return passwordChangeIsValid
				? ResponseEntity.status(HttpStatus.ACCEPTED).body("Slaptažodis pakeistas sekmingai")
				: ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Neteisingas slaptažodis");
	}

	/**
	 * Delete user.
	 *
	 * @param userName
	 *            the user name
	 */
	@DeleteMapping("/admin/delete/user/{userName}")
	@ResponseStatus(HttpStatus.OK)
	private void deleteUser(@PathVariable String userName) {
		employeesService.deactivateUser(userName);
	}

	/**
	 * Delete patient.
	 *
	 * @param patientId
	 *            the patient id
	 */
	@DeleteMapping("/admin/delete/patient/{patientId}")
	@ResponseStatus(HttpStatus.OK)
	private void deletePatient(@PathVariable String patientId) {
		patientService.deactivatePatient(patientId);
	}

}
