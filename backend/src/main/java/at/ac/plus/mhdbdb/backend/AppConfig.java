package at.ac.plus.mhdbdb.backend;

import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.X509Certificate;

import javax.net.ssl.SSLContext;

import org.apache.hc.client5.http.classic.HttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClientBuilder;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManagerBuilder;
import org.apache.hc.client5.http.io.HttpClientConnectionManager;
import org.apache.hc.client5.http.ssl.SSLConnectionSocketFactory;
import org.apache.hc.core5.ssl.SSLContextBuilder;
import org.apache.hc.core5.ssl.TrustStrategy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {
    @Value("${target.host}")
    protected String targetHost;

    @Value("${trust.store:}")
    protected Resource trustStore;

    @Value("${trust.store.password:}")
    protected String trustStorePassword;

    private static final Logger logger = LoggerFactory.getLogger(AppConfig.class);

    @Bean
    public RestTemplate restTemplate() {
        HttpClient httpClient = createHttpClient();
        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory(httpClient);
        factory.setConnectTimeout(100000); // 10 seconds
        return new RestTemplate(factory);
    }

    @Bean
    public HttpClient getHttpClient() {
        return createHttpClient();
    }


    protected HttpClient createHttpClient() {
        HttpClient httpClient = HttpClients.createDefault();
        if(targetHost.startsWith("https")) {
            try 
            {
                TrustStrategy trustStrategy = (X509Certificate[] chain, String authType) -> true;
                SSLContext sslContext = new SSLContextBuilder()
                    .loadTrustMaterial(trustStore.getURL(), trustStorePassword.toCharArray(), trustStrategy)
                    .build();
                SSLConnectionSocketFactory socketFactory = new SSLConnectionSocketFactory(sslContext);
                HttpClientConnectionManager connectionManager = PoolingHttpClientConnectionManagerBuilder.create()
                    .setSSLSocketFactory(socketFactory)
                    .build();
                httpClient = HttpClients.custom()
                    .setConnectionManager(connectionManager)
                    .build();
                    
                /*
                //https://stackoverflow.com/questions/4072585/disabling-ssl-certificate-validation-in-spring-resttemplate
                //https://stackoverflow.com/questions/74688513/httpclients-custom-setsslsocketfactory-method-not-found
                TrustStrategy acceptingTrustStrategy = (X509Certificate[] chain, String authType) -> true;
                
                SSLContext sslContext = org.apache.http.ssl.SSLContexts.custom()
                .loadTrustMaterial(null, acceptingTrustStrategy)
                .build();
                
                SSLConnectionSocketFactory csf = new SSLConnectionSocketFactory(sslContext);
                
                HttpClientConnectionManager connectionManager = PoolingHttpClientConnectionManagerBuilder.create()
                .setSSLSocketFactory(csf)
                .build();
                httpClient = HttpClientBuilder.create()
                .setConnectionManager(connectionManager)
                .build();
                */
            } catch(Exception ex) {
                logger.error("Error creating Http Client", ex);
            }
        }
        return httpClient;
    }
}
