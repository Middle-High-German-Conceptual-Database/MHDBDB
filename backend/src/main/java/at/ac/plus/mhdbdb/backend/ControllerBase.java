package at.ac.plus.mhdbdb.backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = { "${app.dev.frontend.local}", "${app.dev.frontend.remote}", "${app.dev.frontend.remote2}", "${app.dev.frontend.remote3}", "${app.dev.frontend.remote4}", "${app.dev.frontend.remote5}", "${app.dev.frontend.remote6}" })
@RequestMapping("/api")
public class ControllerBase {

    @Value("${target.host}")
    protected String targetHost;

    @Value("${target.repository}")
    protected String targetRepository;
}
