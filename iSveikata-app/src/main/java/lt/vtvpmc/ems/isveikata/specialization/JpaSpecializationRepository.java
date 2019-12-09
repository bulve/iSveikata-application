package lt.vtvpmc.ems.isveikata.specialization;

import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaSpecializationRepository extends JpaRepository<Specialization, Long> {

    Specialization findByTitle(String title);
}
