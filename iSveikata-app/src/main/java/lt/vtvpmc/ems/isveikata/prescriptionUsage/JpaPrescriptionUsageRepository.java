package lt.vtvpmc.ems.isveikata.prescriptionUsage;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;

public interface JpaPrescriptionUsageRepository extends JpaRepository<PrescriptionUsage, Long> {

    @Query(value = "Select * from prescription_usage where prescription_id = ?1", nativeQuery = true)
    List<PrescriptionUsage> findByPrescriptionUsages(Long id);
}
