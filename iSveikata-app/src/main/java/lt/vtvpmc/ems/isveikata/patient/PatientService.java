package lt.vtvpmc.ems.isveikata.patient;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lt.vtvpmc.ems.isveikata.IsveikataApplication;
import lt.vtvpmc.ems.isveikata.employees.Doctor;
import lt.vtvpmc.ems.isveikata.employees.JpaEmployeesRepository;
import lt.vtvpmc.ems.isveikata.mappers.MedicalRecordMapper;
import lt.vtvpmc.ems.isveikata.mappers.PatientMapper;
import lt.vtvpmc.ems.isveikata.mappers.PrescriptionMapper;
import lt.vtvpmc.ems.isveikata.medical_record.JpaMedicalRecordRepository;
import lt.vtvpmc.ems.isveikata.medical_record.MedicalRecord;
import lt.vtvpmc.ems.isveikata.medical_record.MedicalRecordDto;
import lt.vtvpmc.ems.isveikata.prescription.JpaPrescriptionRepository;
import lt.vtvpmc.ems.isveikata.prescription.Prescription;
import lt.vtvpmc.ems.isveikata.prescription.PrescriptionDto;
import lt.vtvpmc.ems.isveikata.security.SHA256Encrypt;

/**
 * The Class PatientService.
 * 
 * @author DTFG 
 * @version 1.0
 * @since 2018
 */
@Service
@Transactional
public class PatientService {

	/** The patient repository. */
	@Autowired
	private JpaPatientRepository patientRepository;

	/** The patient repository. */
	@Autowired
	private JpaEmployeesRepository<Doctor> doctorRepository;

	/** The medical record repository. */
	@Autowired
	private JpaMedicalRecordRepository medicalRecordRepository;

	/** The patient mapper. */
	@Autowired
	private PatientMapper patientMapper;

	/** The medical record mapper. */
	@Autowired
	private MedicalRecordMapper medicalRecordMapper;

	/** The prescription mapper. */
	@Autowired
	private PrescriptionMapper prescriptionMapper;

	/** The medical record repository. */
	@Autowired
	private JpaPrescriptionRepository prescriptionRepository;

	/**
	 * Gets the logged user name for logger.
	 *
	 * @return the user name
	 */
	private String getUserName() {
		try {
			User loggedUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
			return loggedUser.getUsername();
		} catch (ClassCastException e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * Gets the logged user role for logger.
	 *
	 * @return the user role
	 */
	private String getUserRole() {
		try {
			User loggedUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
			return loggedUser.getAuthorities().toString();
		} catch (ClassCastException e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * Get all active patients paged list
	 * 
	 * @param pageable
	 *            the pageable
	 * @return page of patients list
	 */
	@PreAuthorize("hasRole('Admin') OR hasRole('Doctor')")
	public Page<PatientDto> getAllPagedActivePatient(Pageable pageable) {

		try {
			PageRequest request = new PageRequest(pageable.getPageNumber(), pageable.getPageSize());
			List<Patient> patientPage = patientRepository.findByActive(getPageFrom(pageable), pageable.getPageSize());
			List<PatientDto> dtos = patientMapper.patiensToDto(patientPage);
			IsveikataApplication.loggMsg(Level.FINE, getUserName(), getUserRole(), "fetching all active patients.");
			return new PageImpl<>(dtos, request, dtos.size());
		} catch (Exception e) {
			IsveikataApplication.loggMsg(Level.WARNING, getUserName(), getUserRole(),
					"Error fetching ptients list:" + e.getMessage());
			return null;
		}

	}

	/**
	 * Get all active patients paged list searched by part of patient id
	 * 
	 * @param pageable
	 *            the pageable
	 * @param patientId
	 *            the patient id
	 * @return page of patients list
	 */
	@PreAuthorize("hasRole('Admin') OR hasRole('Doctor')")
	public Page<Patient> getAllPatientByPatientId(String patientId, Pageable pageable) {
		try {
			PageRequest request = new PageRequest(pageable.getPageNumber() - 1, pageable.getPageSize());
			IsveikataApplication.loggMsg(Level.FINE, getUserName(), getUserRole(), "fetching patient by patient id");
			return patientRepository.findAllPatientByPatientId(patientId, request);
		} catch (Exception e) {
			IsveikataApplication.loggMsg(Level.WARNING, getUserName(), getUserRole(),
					"Error fetching patient list by patient id" + e.getMessage());
			return null;
		}

	}

	/**
	 * Get all active patients by doctor user name paged list
	 *
	 * @param pageable
	 *            the pageable
	 * @param userName
	 *            the user name of a doctor
	 * @return Page of patients list
	 */
	@PreAuthorize("hasRole('Doctor')")
	public Page<PatientDto> getAllPagedPatientByDoctor(Pageable pageable, String userName) {
		try {
			Long doctorId = doctorRepository.findByUserName(userName).getId();
			List<Patient> patientPage = patientRepository.findPatientByDoctor(doctorId, getPageFrom(pageable),
					pageable.getPageSize());
			List<PatientDto> dtos = patientMapper.patiensToDto(patientPage);
			IsveikataApplication.loggMsg(Level.FINE, getUserName(), getUserRole(), "fetching patient list by dorctor");
			return new PageImpl<>(dtos);
		} catch (Exception e) {
			IsveikataApplication.loggMsg(Level.WARNING, getUserName(), getUserRole(),
					"Error fetching patient list by dorctor" + e.getMessage());
			return null;
		}
	}

	/**
	 * Gets the all active patients by doctor for csv formation.
	 *
	 * @param userName
	 *            the user name of a doctor
	 * @return the all patients
	 */
	@PreAuthorize("hasRole('Doctor')")
	public List<Object> getAllPagedPatientByDoctorForCsv(String userName) {
		try {
			Long doctorId = doctorRepository.findByUserName(userName).getId();
			List<Object> patientList = patientRepository.findAllPatientByDoctorCSV(doctorId);
			IsveikataApplication.loggMsg(Level.FINE, getUserName(), getUserRole(),
					"fetching patient list for csv formation");

			return patientList;
		} catch (Exception e) {
			IsveikataApplication.loggMsg(Level.WARNING, getUserName(), getUserRole(),
					"Error fetching patient list for csv" + e.getMessage());
			return null;
		}

	}

	// /**
	// * Gets the active patients list.
	// *
	// * @return the patients list
	// */
	// @PreAuthorize("hasRole('Admin') OR hasRole('Doctor')")
	// public List<PatientDto> getActivePatientList() {
	// try {
	// IsveikataApplication.loggMsg(Level.FINE, getUserName(), getUserRole(),
	// "fetching active patient list");
	// return patientMapper.patiensToDto(patientRepository.findByIsActiveTrue());
	// } catch (Exception e) {
	// IsveikataApplication.loggMsg(Level.WARNING, getUserName(), getUserRole(),
	// "Error fetching active patient list" + e.getMessage());
	// return null;
	// }
	// }

	/**
	 * Gets the patient.
	 *
	 * @param patientId
	 *            the patient id
	 * @return the patient
	 */
	@PreAuthorize("hasRole('Admin') OR hasRole('Doctor') OR hasRole('Druggist')")
	public PatientDto getPatient(String patientId) {
		try {
			IsveikataApplication.loggMsg(Level.FINE, getUserName(), getUserRole(), "fetching patient by id");
			return patientMapper.patientToDto(patientRepository.findOne(patientId));
		} catch (Exception e) {
			IsveikataApplication.loggMsg(Level.WARNING, getUserName(), getUserRole(),
					"Error fetching patient by id" + e.getMessage());
			return null;
		}

	}

	/**
	 * Gets the patient record list.
	 *
	 * @param patientId
	 *            the patient id
	 * @param pageable
	 *            the pageable
	 * @return the page of patient record list
	 */
	@PreAuthorize("hasRole('Patient') OR hasRole('Doctor')")
	public Page<MedicalRecordDto> getPatientRecordList(String patientId, Pageable pageable) {
		try {
			List<MedicalRecord> medicalRecordPage = medicalRecordRepository.findAllByPatientPatientId(patientId,
					getPageFrom(pageable), pageable.getPageSize());
			List<MedicalRecordDto> dtos = medicalRecordMapper.medicalRecordsToDto(medicalRecordPage);
			IsveikataApplication.loggMsg(Level.FINE, getUserName(), getUserRole(), "fetching patient record list");
			return new PageImpl<>(dtos);
		} catch (Exception e) {
			IsveikataApplication.loggMsg(Level.WARNING, getUserName(), getUserRole(),
					"Error fetching record list" + e.getMessage());
			return null;
		}

	}

	/**
	 * Gets the patient prescription list.
	 *
	 * @param patientId
	 *            the patient id
	 * @param pageable
	 *            the pageable
	 * @return the page of patients prescription list
	 */
	@PreAuthorize("hasRole('Patient') OR hasRole('Doctor') OR hasRole('Druggist')")
	public Page<PrescriptionDto> getPatientPrescriptionList(String patientId, Pageable pageable) {
		try {
			List<Prescription> prescriptionsPage = prescriptionRepository.findAllByPatientPatientId(patientId,
					getPageFrom(pageable), pageable.getPageSize());
			List<PrescriptionDto> dtos = prescriptionMapper.prescriptionsToDto(prescriptionsPage);
			IsveikataApplication.loggMsg(Level.FINE, getUserName(), getUserRole(),
					"fetching patient prescription list");

			return new PageImpl<>(dtos);
		} catch (Exception e) {
			IsveikataApplication.loggMsg(Level.WARNING, getUserName(), getUserRole(),
					"Error fetching patient " + patientId + " prescription list" + e.getMessage());
			return null;
		}

	}

	/**
	 * Gets the patient after date prescription list.
	 *
	 * @param patientId
	 *            the patient id
	 * @return the patient prescription list
	 */
	@PreAuthorize("hasRole('Druggist')")
	public List<PrescriptionDto> getPatientPrescriptionListAfterDate(String patientId) {
		try {
			List<Prescription> prescriptionsPage = prescriptionRepository.findAllByPatientIdAndDateAfter(patientId,
					new Date());
			IsveikataApplication.loggMsg(Level.FINE, getUserName(), getUserRole(),
					"fetching patient precription list after date");

			return prescriptionMapper.prescriptionsToDto(prescriptionsPage);
		} catch (Exception e) {
			IsveikataApplication.loggMsg(Level.WARNING, getUserName(), getUserRole(),
					"Error fetching patient " + patientId + " prescription list after date" + e.getMessage());
			return null;
		}

	}

	/**
	 * Update patient password.
	 *
	 *
	 * @param oldPassword
	 *            raw old password
	 * @param newPassword
	 *            raw new password
	 * @param patientId
	 *            the patient id
	 * @return boolean confirmation
	 */
	@PreAuthorize("hasRole('Patient')")
	public boolean updatePatientPassword(String oldPassword, final String newPassword, String patientId) {
		try {
			Patient pat = patientRepository.findOne(patientId);
			if (SHA256Encrypt.sswordEncoder.matches(oldPassword, pat.getPassword())) {
				pat.setPassword(newPassword);
				patientRepository.save(pat);
				IsveikataApplication.loggMsg(Level.INFO, getUserName(), getUserRole(), "change password success.");
				return true;
			} else {
				IsveikataApplication.loggMsg(Level.INFO, getUserName(), getUserRole(), "change password faill.");
				return false;
			}
		} catch (Exception e) {
			IsveikataApplication.loggMsg(Level.WARNING, getUserName(), getUserRole(),
					"Error changing patient " + patientId + " password " + e.getMessage());
			return false;
		}

	}

	/**
	 * Adds the new patient.
	 *
	 * @param patient
	 *            the patient
	 * @return boolean true if sucess
	 */
	@PreAuthorize("hasRole('Admin')")
	public boolean addNewPatient(Patient patient) {
		try {
			if (validateAddNewPatient(patient)) {
				patientRepository.save(patient);
				IsveikataApplication.loggMsg(Level.INFO, getUserName(), getUserRole(),
						"created new patient with id " + patient.getPatientId());
				return true;
			} else {
				return false;
			}
		} catch (Exception e) {
			IsveikataApplication.loggMsg(Level.WARNING, getUserName(), getUserRole(),
					"Error creating patient " + patient.getPatientId() + e.getMessage());
			return false;
		}
	}

	/**
	 * Gets the patient list without doctor.
	 * 
	 * @param pageable
	 *            the pageable
	 * @return the page list of patients without doctor
	 */
	@PreAuthorize("hasRole('Admin')")
	public Page<PatientDto> getPatientListWithoutDoctor(Pageable pageable) {
		try {
			List<Patient> patientPage = patientRepository.findByIsActiveTrueAndDoctorIsNull(getPageFrom(pageable),
					pageable.getPageSize());
			List<PatientDto> dtos = patientMapper.patiensToDto(patientPage);
			IsveikataApplication.loggMsg(Level.FINE, getUserName(), getUserRole(),
					"fetching patient list not bind to any doctro");
			return new PageImpl<>(dtos);
		} catch (Exception e) {
			IsveikataApplication.loggMsg(Level.WARNING, getUserName(), getUserRole(),
					"Error fetching patient list not bind to any doctor " + e.getMessage());
			return null;
		}

	}

	/**
	 * Validate add new patient.
	 *
	 * @param patient
	 *            the patient
	 * @return true, if successful
	 */
	@PreAuthorize("hasRole('Admin')")
	public boolean validateAddNewPatient(Patient patient) {
		try {
			if (patientRepository.exists(patient.getPatientId())) {
				IsveikataApplication.loggMsg(Level.FINE, getUserName(), getUserRole(), "patient can not be created");
				return false;
			} else {
				IsveikataApplication.loggMsg(Level.FINE, getUserName(), getUserRole(), "patient can be created");

				return true;
			}
		} catch (Exception e) {
			IsveikataApplication.loggMsg(Level.WARNING, getUserName(), getUserRole(),
					"Error validating patien " + patient.getPatientId() + "\r\n" + e.getMessage());
			return false;
		}

	}

	/**
	 * Deactivate patient.
	 *
	 * @param patientId
	 *            the patient id
	 */
	@PreAuthorize("hasRole('Admin')")
	public void deactivatePatient(String patientId) {
		Patient patient = patientRepository.findOne(patientId);
		patient.setActive(false);
		patientRepository.save(patient);
	}

	/**
	 * Return patient status.
	 *
	 * @param patientId
	 *            the patient id
	 * @return true if is active
	 */
	public boolean isPatientActive(String patientId) {
		if (patientId.matches("\\d+")) {
			Patient patient = patientRepository.findOne(patientId);
			return patient != null ? patient.isActive() : false;
		} else {
			return false;
		}
	}

	/**
	 * Return all active paged patients list by doctor and one of search value:
	 * <ul>
	 * <li>first name</li>
	 * <li>last name</li>
	 * <li>patient id</li>
	 * <li>ICD code</li>
	 * </ul>
	 * 
	 * @param pageable
	 *            the pageable
	 * @param userName
	 *            doctors userName
	 * @param searchValue
	 *            searchable value (firstName, lastName, patientId, icd code)
	 *
	 * @return page list of patients
	 */
	@PreAuthorize("hasRole('Doctor')")
	public Page<PatientDto> getAllPagedPatientByDoctorAndBySearchValue(Pageable pageable, String userName,
			String searchValue) {
		List<Patient> patientPage = new ArrayList<Patient>();
		try {
			Long doctorId = doctorRepository.findByUserName(userName).getId();
			if (searchValue.matches("\\d+")) {
				patientPage = patientRepository.findAllPatientByPatientIdAndDoctorId(doctorId, searchValue,
						getPageFrom(pageable), pageable.getPageSize());
			} else if (searchValue.matches("^[A-Z]{1}\\d{2}$")) {
				patientPage = patientRepository.findAllByDoctorIdAndIcdCode(doctorId, searchValue,
						getPageFrom(pageable), pageable.getPageSize());
			} else {
				patientPage = patientRepository.findAllActivePatientByDoctorIdAndSearchValue(searchValue, doctorId,
						getPageFrom(pageable), pageable.getPageSize());
			}
			IsveikataApplication.loggMsg(Level.FINE, getUserName(), getUserRole(),
					"fetching patient list by doctor " + userName + " and search value:" + searchValue);
			List<PatientDto> dtos = patientMapper.patiensToDto(patientPage);
			return new PageImpl<>(dtos);
		} catch (Exception e) {
			IsveikataApplication.loggMsg(Level.WARNING, getUserName(), getUserRole(),
					"Error fetching patient list by doctor " + userName + " and search value of " + searchValue
							+ " \r\n" + e.getMessage());
			return null;
		}
	}

	/**
	 * Return all active paged patients list by one of search value:
	 * <ul>
	 * <li>first name</li>
	 * <li>last name</li>
	 * <li>patient id</li>
	 * </ul>
	 * 
	 * @param pageable
	 *            the pageable
	 *
	 * @param searchValue
	 *            searchable value (firstName, lastName, patientId)
	 *
	 * @return page list of patients
	 */
	@PreAuthorize("hasRole('Admin') OR hasRole('Doctor')")
	public Page<PatientDto> getAllPagedPatientBySearchValue(Pageable pageable, String searchValue) {
		try {
			List<Patient> patientPage = null;
			if (searchValue.matches("\\d+")) {
				patientPage = patientRepository.findAllPatientByPatientId(searchValue, getPageFrom(pageable),
						pageable.getPageSize());
			} else {
				patientPage = patientRepository.findAllPatientByGivenSearchValue(searchValue, getPageFrom(pageable),
						pageable.getPageSize());
			}
			List<PatientDto> dtos = patientMapper.patiensToDto(patientPage);
			IsveikataApplication.loggMsg(Level.FINE, getUserName(), getUserRole(),
					"fetching patient by search value:" + searchValue);

			return new PageImpl<>(dtos);
		} catch (Exception e) {
			IsveikataApplication.loggMsg(Level.WARNING, getUserName(), getUserRole(),
					"Error fetching patient by search value of " + searchValue + "\r\n" + e.getMessage());
			return null;
		}

	}

	/**
	 * Return all active not bind patients by one of search value:
	 * <ul>
	 * <li>first name</li>
	 * <li>last name</li>
	 * <li>patient id</li>
	 * </ul>
	 * 
	 * @param pageable
	 *            the pageable
	 *
	 * @param searchValue
	 *            searchable value (firstName, lastName, patientId)
	 *
	 * @return page list of patients
	 */
	@PreAuthorize("hasRole('Admin')")
	public Page<PatientDto> getPatientListWithoutDoctorBySearchValue(String searchValue, Pageable pageable) {
		try {
			List<Patient> patientPage = patientRepository.findAllActiveNotBindPatientBySearchValue(searchValue,
					getPageFrom(pageable), pageable.getPageSize());
			List<PatientDto> dtos = patientMapper.patiensToDto(patientPage);
			IsveikataApplication.loggMsg(Level.FINE, getUserName(), getUserRole(),
					"fetching patient list not bind to doctor by value:" + searchValue);

			return new PageImpl<>(dtos);
		} catch (Exception e) {
			IsveikataApplication.loggMsg(Level.WARNING, getUserName(), getUserRole(),
					"Error fetching patient list not bind to doctor by search value of " + searchValue + "\r\n"
							+ e.getMessage());
			return null;
		}

	}

	/**
	 * Gets the page from.
	 *
	 * @param pageable
	 *            the pageable
	 * @return the page from
	 */
	private int getPageFrom(Pageable pageable) {
		return pageable.getPageNumber() == 0 ? 0 : pageable.getPageNumber() * pageable.getPageSize();
	}

	/**
	 * Gets the all paged patients by doctor and icd code.
	 *
	 * @param pageable
	 *            the pageable
	 * @param userName
	 *            the user name
	 * @param icdCode
	 *            the icd code
	 * @return the page list of patients by doctor and icd code
	 */
	@PreAuthorize("hasRole('Doctor')")
	public Page<PatientDto> getAllPagedPatientByDoctorAndIcdCode(Pageable pageable, String userName, String icdCode) {
		try {
			Doctor doctor = doctorRepository.findByUserName(userName);
			List<Patient> patientPage = patientRepository.findAllByDoctorIdAndIcdCode(doctor.getId(), icdCode,
					getPageFrom(pageable), pageable.getPageSize());
			List<PatientDto> dtos = patientMapper.patiensToDto(patientPage);
			IsveikataApplication.loggMsg(Level.FINE, getUserName(), getUserRole(),
					"fetching patient list to doctor by ICD code:" + icdCode);

			return new PageImpl<>(dtos);
		} catch (Exception e) {
			IsveikataApplication.loggMsg(Level.WARNING, getUserName(), getUserRole(),
					"Error fetching patient list by doctorid " + userName + " and ICD code of " + icdCode + "\r\n"
							+ e.getMessage());
			return null;
		}
	}

}
