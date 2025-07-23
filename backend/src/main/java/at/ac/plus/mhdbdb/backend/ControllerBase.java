package at.ac.plus.mhdbdb.backend;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

public class ControllerBase {

    @Value("${target.host}")
    protected String targetHost;

    @Value("${target.repository}")
    protected String targetRepository;
}
