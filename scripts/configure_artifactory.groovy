import jenkins.model.*
import hudson.model.*
import com.cloudbees.plugins.credentials.*
import com.cloudbees.plugins.credentials.common.*
import com.cloudbees.plugins.credentials.domains.*
import org.jfrog.artifactory.client.*

// Create Artifactory credentials
def credentialsDomain = Domain.global()
def credentialsStore = Jenkins.get().getExtensionList(com.cloudbees.plugins.credentials.SystemCredentialsProvider.class)[0].getStore()

def usernamePassword = new UsernamePasswordCredentialsImpl(
    CredentialsScope.GLOBAL,
    "artifactory-credentials",
    "Artifactory Admin Credentials",
    "admin",
    "password"
)

credentialsStore.addCredentials(credentialsDomain, usernamePassword)

println "Artifactory credentials created successfully"