package lt.vtvpmc.ems.isveikata.api;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JpaApiRepository extends JpaRepository<Api, Long> {

	Api findByTitle(String title);

	List<Api> findAllByCounterGreaterThanOrderByCounterDesc(Long number,  Pageable pageeable);
}
