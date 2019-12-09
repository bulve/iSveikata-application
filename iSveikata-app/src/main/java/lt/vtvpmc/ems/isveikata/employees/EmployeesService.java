package lt.vtvpmc.ems.isveikata.employees;

import java.util.List;
import java.util.Map;
import java.util.logging.Level;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;

import lt.vtvpmc.ems.isveikata.IsveikataApplication;
import lt.vtvpmc.ems.isveikata.mappers.DoctorMapper;
import lt.vtvpmc.ems.isveikata.patient.JpaPatientRepository;
import lt.vtvpmc.ems.isveikata.patient.Patient;
import lt.vtvpmc.ems.isveikata.security.SHA256Encrypt;
import lt.vtvpmc.ems.isveikata.specialization.JpaSpecializationRepository;
import lt.vtvpmc.ems.isveikata.specialization.Specialization;

/**
 * The Class EmployeesService.
 * @author DTFG 
 * @version 1.0
 * @since 2018
 */
@Service
@Transactional
@PreAuthorize("hasRole('Admin')")
public class EmployeesService {

	/** The employees repository. */
	@Autowired
	private JpaEmployeesRepository<Employee> employeesRepository;

	/** The doctor Repository. */
	@Autowired
	private JpaEmployeesRepository<Doctor> doctorRepository;

	/** The patient repository. */
	@Autowired
	private JpaPatientRepository patientRepository;

	/** The specialization repository */
	@Autowired
	private JpaSpecializationRepository specializationRepository;

	/** The doctor mapper. */
	@Autowired
	private DoctorMapper doctorMapper;

	/**
	 * Gets the logged user name for logger.
	 *
	 * @return the user name
	 */
	private String getUserName() {
		User loggedUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return loggedUser.getUsername();
	}

	/**
	 * Gets the logged user role for logger.
	 *
	 * @return the user role
	 */
	private String getUserRole() {
		User loggedUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		return loggedUser.getAuthorities().toString();
	}

	/**
	 * Adds new employee to database. <br>
	 * Checks the received object for correct type, detects the employee type, validates it and saves to database
	 * 
	 * @param objectMap
	 *            the employee, specialization
	 *            
	 * @return String message for UI with http status code
	 */
	public ResponseEntity<String> addEmployee(Map<String, Object> objectMap) {
        final ObjectMapper mapper = new ObjectMapper(); 
        final Employee employee = mapper.convertValue(objectMap.get("employee"), Employee.class);
        String specializationTitle = mapper.convertValue(objectMap.get("specialization"), String.class);
        Specialization specialization = null;
        if (employee instanceof Doctor) {
            if (specializationTitle != null) {
                if (specializationRepository.findByTitle(specializationTitle) == null) {
                    specialization = new Specialization();
                    specialization.setTitle(specializationTitle);
                    specialization = specializationRepository.save(specialization);
                } else {
                    specialization = specializationRepository.findByTitle(specializationTitle);
                }
            } else {
                return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                        .body("Gydytojas privalo turėti specializaciją");
            }

            try {

                Doctor doctor = (Doctor) employee;
                doctor.setSpecialization(specialization);
                if (validateUserExists(doctor)) {
                    employeesRepository.save(doctor);
                    IsveikataApplication.loggMsg(Level.INFO, getUserName(), getUserRole(),
                            "created new doctor with " + doctor.getUserName() + " username");
                    return ResponseEntity.status(HttpStatus.CREATED).body("Sukurtas naujas vartotojas");
                } else {
                    IsveikataApplication.loggMsg(Level.WARNING, getUserName(), getUserRole(),
                            "new doctor not created because it exists " + doctor.getUserName() + " username");
                    return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                            .body("Vartotojas su tokiu prisijungimo slapyvardžiu jau egzistuoja");
                }

            } catch (IllegalArgumentException e) {
                IsveikataApplication.loggMsg(Level.WARNING, getUserName(), getUserRole(),
                        "Doctor or specialization exeption... " + e.getMessage());
                return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                        .body("Vartotojas negali buti sukurtas su tokiais duomenimis...");
            }

        }else if(employee instanceof Druggist){
            Druggist druggist = null;
            try{
                druggist = (Druggist) employee;

                if(druggist.getDrugStore() != null) {
                    if(validateUserExists(druggist)){
                        employeesRepository.save(druggist);
                        IsveikataApplication.loggMsg(Level.INFO, getUserName(), getUserRole(),
                                "created new druggist with " + druggist.getUserName() + " username");
                        return ResponseEntity.status(HttpStatus.CREATED).body("Sukurtas naujas vartotojas");
                    }else{
                        IsveikataApplication.loggMsg(Level.WARNING, getUserName(), getUserRole(),
                                "new druggist not created because it exists with  " + druggist.getUserName() + " username");
                        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                                .body("Vartotojas su tokiu prisijungimo slapyvardžiu jau egzistuoja");
                    }
                }else{
                    return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                            .body("Vaistininkas privalo turėti darbovietę");
                }
            }catch (Exception e){
                return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                        .body("Vartotojas negali buti sukurtas su tokiais duomenimis...");
            }



        }else {
			try {
				if(validateUserExists(employee)){
					employeesRepository.save(employee);
					IsveikataApplication.loggMsg(Level.INFO, getUserName(), getUserRole(),
							"created new employee with " + employee.getUserName() + " username");
					return ResponseEntity.status(HttpStatus.CREATED).body("Sukurtas naujas vartotojas");
				}else{
					IsveikataApplication.loggMsg(Level.WARNING, getUserName(), getUserRole(),
							"new employee not created because it exists with  " + employee.getUserName() + " username");
					return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
							.body("Vartotojas su tokiu prisijungimo slapyvardžiu jau egzistuoja");
				}

			} catch (Exception e) {
				IsveikataApplication.loggMsg(Level.WARNING, getUserName(), getUserRole(),
						"employee not created... " + e.getMessage());
				return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
						.body("Vartotojas negali buti sukurtas su tokiais duomenimis...");
			}
		}


	}

	/**
	 * Binds doctor to patient.
	 *
	 * @param doctorId
	 *            the doctor id
	 * @param patientId
	 *            the patient id
	 */
	public void bindDoctorToPatient(String doctorId, String patientId) {
		try {
			Patient patient = patientRepository.findOne(patientId);
			Doctor doctor = (Doctor) employeesRepository.findByUserName(doctorId);
			if (doctor instanceof Doctor) {
				doctor.getPatient().add(patient);
				patient.setDoctor(doctor);
			}
			IsveikataApplication.loggMsg(Level.FINE, getUserName(), getUserRole(), "patient binded to doctor.");

		} catch (Exception e) {
			IsveikataApplication.loggMsg(Level.WARNING, getUserName(), getUserRole(), "doctor " + doctorId + " not binded to " + patientId +"\r\n" +e );
		}

	}

	/**
	 * Gets the active doctors paged list.
	 *@param pageable the pageable
	 * @return the active doctors list
	 */
	@PreAuthorize("hasRole('Admin')")
	public Page<DoctorDto> getActiveDoctorsList(Pageable pageable) {
		try {
			List<Doctor> doctorPage = doctorRepository.findAllDoctor(getPageFrom(pageable), pageable.getPageSize());
			List<DoctorDto> dtos = doctorMapper.doctorsToDto(doctorPage);
			IsveikataApplication.loggMsg(Level.FINE, getUserName(), getUserRole(), "fetched active doctor list.");
			return new PageImpl<>(dtos);
		} catch (Exception e) {
			IsveikataApplication.loggMsg(Level.WARNING, getUserName(), getUserRole(),
					"Error fetching doctors list:" + e.getMessage());
			return null;
		}
	}

	/**
	 * Get active Doctor paged list by search value
	 * 
	 * @param searchValue
	 *            first or last doctor's name
	 *@param pageable the pageable
	 * @return the active doctor paged list
	 */
	public Page<DoctorDto> getActiveDoctorBySearchValue(String searchValue, Pageable pageable) {
		try {
			List<Doctor> doctorPage = doctorRepository.findAllActiveDoctorBySearchValue(searchValue,
					getPageFrom(pageable), pageable.getPageSize());
			List<DoctorDto> dtos = doctorMapper.doctorsToDto(doctorPage);
			IsveikataApplication.loggMsg(Level.FINE, getUserName(), getUserRole(),
					"fetched active doctor list by search value.");
			return new PageImpl<>(dtos);
		} catch (Exception e) {
			IsveikataApplication.loggMsg(Level.WARNING, getUserName(), getUserRole(),
					"Error fetching doctors list by search value:" + searchValue + "\r\n" + e.getMessage());
			return null;
		}

	}

	/**
	 * Update user password. <br> Hashes and updates user password if stored in database matches entered as old one.
	 *
	 * @param oldPassword
	 *            old raw password
	 * @param newPassword
	 *            new raw password 
	 * @param userName
	 *            the user name
	 * @return boolean confirmation 
	 */
	@PreAuthorize("hasRole('Admin') or hasRole('Doctor') or hasRole('Druggist')")
	public boolean updateUserPassword(String oldPassword, final String newPassword, String userName) {
		try {
			Employee employee = employeesRepository.findByUserName(userName);
			if (SHA256Encrypt.sswordEncoder.matches(oldPassword, employee.getPassword())) {
				employee.setPassword(newPassword);
				employeesRepository.save(employee);
				IsveikataApplication.loggMsg(Level.FINE, getUserName(), getUserRole(), "Password changed.");
				return true;
			} else
				IsveikataApplication.loggMsg(Level.INFO, getUserName(), getUserRole(),
						"Password not changed. Passwords do not match");
			return false;
		} catch (Exception e) {
			IsveikataApplication.loggMsg(Level.WARNING, getUserName(), getUserRole(), "Error fetching passwords:" + e.getMessage());
			return false;
		}
	}

	/**
	 * Validate if user exists.
	 *
	 * @param employee
	 *            the employee
	 * @return false if is
	 */
	 public boolean validateUserExists(Employee employee) {
		 Employee employeeDb = employeesRepository.findByUserName(employee.getUserName());
		 return employeeDb == null;
	 }

	/**
	 * Validates if patient not bind to doctor.
	 *
	 * @param doctorId
	 *            the doctor id
	 * @param patientId
	 *            the patient id
	 * @return true, if not
	 */
	public boolean validateBindDoctrorToPatient(String doctorId, String patientId) {
		Patient patient = patientRepository.findOne(patientId);
		Doctor doctor = (Doctor) employeesRepository.findByUserName(doctorId);
		if (doctor instanceof Doctor) {
			return patient.getDoctor() == null;
		} else {
			return false;
		}
	}

	/**
	 * Deactivate user.
	 *
	 * @param userName
	 *            the user name
	 */
	@PreAuthorize("hasRole('Admin')")
	public void deactivateUser(String userName) {
		try {
			Employee emp = employeesRepository.findByUserName(userName);
			emp.setActive(false);
			employeesRepository.save(emp);
			IsveikataApplication.loggMsg(Level.INFO, getUserName(), getUserRole(),
					"User " + userName + " has been marked as inactive");

		} catch (Exception e2) {
			IsveikataApplication.loggMsg(Level.WARNING, getUserName(), getUserRole(),
					"Error fetching user:" + userName);
		}

	}

	/**
	 * Checks if is user active.
	 *
	 * @param userName the user name
	 * @return true, if is user active
	 */
	public boolean isUserActive(String userName) {
		Employee employee = employeesRepository.findByUserName(userName);
		return employee != null ? employee.isActive() : false;
	}

	/**
	 * Gets the from page.
	 *
	 * @param pageable the pageable
	 * @return the from page as integer value
	 */
	private int getPageFrom(Pageable pageable) {
		return pageable.getPageNumber() == 0 ? 0 : pageable.getPageNumber() * pageable.getPageSize();
	}

}
