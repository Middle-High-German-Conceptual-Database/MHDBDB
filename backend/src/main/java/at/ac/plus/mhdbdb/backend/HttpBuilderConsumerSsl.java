package at.ac.plus.mhdbdb.backend;

import java.security.cert.X509Certificate;
import java.util.function.Consumer;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;

import org.apache.http.conn.ssl.X509HostnameVerifier;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.ssl.SSLContextBuilder;
import org.apache.http.ssl.TrustStrategy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;


public class HttpBuilderConsumerSsl implements Consumer<HttpClientBuilder> 
{

    @Value("${trust.store:}")
    protected Resource trustStore;

    @Value("${trust.store.password:}")
    protected String trustStorePassword;

    @Autowired 
    HostnameVerifier hostnameVerifier;

    private static final Logger logger = LoggerFactory.getLogger(HttpBuilderConsumerSsl.class);

    @Override
    public void accept(HttpClientBuilder t) {
        try {

            TrustStrategy trustStrategy = (X509Certificate[] chain, String authType) -> true;
            SSLContext sslContext = new SSLContextBuilder()
                .loadTrustMaterial(trustStore.getURL(), trustStorePassword.toCharArray(), trustStrategy)
                .build();

            t.setSSLContext(sslContext);
            t.setSSLHostnameVerifier(hostnameVerifier);
        } catch(Exception ex) {
            logger.error("Error creating Http Client", ex);
        }
    }
}
