package lt.vtvpmc.ems.isveikata.prescription;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface JpaPrescriptionRepository extends JpaRepository<Prescription, Long> {


    @Query(value = "SELECT * FROM PRESCRIPTION WHERE " +
            "patient_patient_id = ?1 ORDER BY EXPIRATION_DATE DESC " +
            "LIMIT ?2, ?3 ", nativeQuery = true)
    List<Prescription> findAllByPatientPatientId(String id, int from, int to);

//    SELECT * FROM PRESCRIPTION where PATIENT_PATIENT_ID  = 31202290012 and EXPIRATION_DATE > '2018-01-01'
    @Query("SELECT t FROM Prescription t WHERE " +
            "t.patient.patientId = :id AND  " +
            "t.expirationDate >= :date ")
    List<Prescription> findAllByPatientIdAndDateAfter(@Param("id")String id, @Param("date") Date date);    
    

}

