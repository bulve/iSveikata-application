package lt.vtvpmc.ems.isveikata.medical_record;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface JpaMedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {

	List<MedicalRecord> findAllByOrderByIdDesc();

	@Query(value = "SELECT * FROM MEDICAL_RECORD " +
			"JOIN APPOINTMENT ON MEDICAL_RECORD.APPOINTMENT_ID = APPOINTMENT.ID "+
			"where patient_patient_id = ?1 ORDER BY DATE DESC " +
			"LIMIT ?2, ?3 ", nativeQuery = true)
	List<MedicalRecord> findAllByPatientPatientId(String patientId, int form, int to);

	@Query(value = "SELECT DATE, count(*) as visits, " + "sum(DURATION) as duration FROM MEDICAL_RECORD "
			+ "join APPOINTMENT on MEDICAL_RECORD.APPOINTMENT_ID = APPOINTMENT.ID "
			+ "where MEDICAL_RECORD.DOCTOR_ID = ?1 " + "and APPOINTMENT.DATE >= ?2 " + "and APPOINTMENT.DATE <= ?3 "
			+ "group by DATE order by DATE", nativeQuery = true)
	List<Object> getDoctorWorkDaysStatistic(Long doctorId, String dateFrom, String dateTill);

	@Query("SELECT count(*) FROM MedicalRecord mr where mr.isRepetitive = false")
	Integer getTotalNonRepetitiveMedicalRecordCount();
	
	

}
