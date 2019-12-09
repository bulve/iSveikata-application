package lt.vtvpmc.ems.isveikata.employees;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

@Transactional
public interface JpaEmployeesRepository<T extends Employee> extends JpaRepository<T, Long> {
	
	T findByUserName(String username);
	
	@Query(value = "SELECT * FROM EMPLOYEE WHERE DTYPE = LOWER(?1)", nativeQuery = true)
	List<T> findAllByType(String type);

	@Query(value = "SELECT * FROM EMPLOYEE WHERE DTYPE = 'doctor' and IS_ACTIVE = true LIMIT ?1, ?2", nativeQuery = true)
	List<Doctor> findAllDoctor(int from, int to);


	@Query(value = "SELECT * FROM EMPLOYEE WHERE " +
			"DTYPE = 'doctor' and IS_ACTIVE = true " +
			"AND (first_name LIKE ?1% OR last_name LIKE ?1%)" +
			"LIMIT ?2, ?3", nativeQuery = true)
	List<Doctor> findAllActiveDoctorBySearchValue(String searchValue,
													int from, int to);
}
