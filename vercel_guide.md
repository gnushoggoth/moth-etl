# Dracula's Diabolical Deployment: A Gothic Guide to Terraforming Vercel & GCP

Welcome, nocturnal traveler, to a guide as eerie as a moonlit crypt—where we summon the arcane powers of Terraform to deploy your infrastructure to both Vercel and the dark domain of Google Cloud Platform (GCP). In these shadowy pages, we shall compare and contrast the two eldritch services, blending the fun of gothic humor with the serious sorcery of infrastructure as code.

---

## Prerequisites: Gather Your Dark Artifacts

Before embarking on your midnight ritual, ensure you have these forbidden tools:
- **Terraform CLI** (installed from [the sacred installation guide](https://developer.hashicorp.com/terraform/install)  [oai_citation_attribution:0‡registry.terraform.io](https://registry.terraform.io/providers/vercel/vercel/latest/docs))
- A **Vercel account**—your portal to otherworldly deployments—with GitHub integration in place.
- A **GCP project** with billing enabled (lest the spirits of unpaid bills arise).

---

## 1. Authentication Setup: The Rituals of Entry

### GCP Credentials
Invoke the ancient incantation to log into GCP and bind your soul (and service account key) to your session:
```bash
gcloud auth application-default login
# Secure your blood—er, service account key—as a JSON scroll:
export GOOGLE_APPLICATION_CREDENTIALS="path/to/credentials.json"

Source of dark lore  ￼

Vercel API Token

Whisper your secret token into the void to command Vercel’s forces:

export VERCEL_API_TOKEN="your_vercel_token"

From the crypts of Vercel integration  ￼

2. Provider Configuration: Binding the Dark Powers

In your main.tf scroll, conjure the providers for both realms:

terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
    vercel = {
      source  = "vercel/vercel"
      version = "~> 0.3"
    }
  }
}

# Invoke the power of Google (GCP)
provider "google" {
  project = "your-gcp-project-id"
  region  = "us-central1"  # Where the midnight mists gather
}

# Channel the essence of Vercel
provider "vercel" {
  api_token = var.vercel_token  # Summon this from the shadows of your variables
}

3. Infrastructure Deployment: Conjuring the Network & the Web

In the GCP Crypt: A Sinister VPC

Create a network as unyielding as a vampire’s castle:

resource "google_compute_network" "app_network" {
  name                    = "vercel-app-network"
  auto_create_subnetworks = false
}

In the Vercel Vault: The Haunted Project

Summon your web application project, bound to your Git repository:

resource "vercel_project" "web_app" {
  name      = "gcp-integrated-app"
  framework = "nextjs"
  git_repository = {
    type = "github"
    repo = "your-username/your-repo"
  }
}

Unleash the Deployment: Casting the Production Spell

Package your application code from the depths of your directory and send it forth:

data "vercel_project_directory" "app_code" {
  path = "../your-nextjs-app"
}

resource "vercel_deployment" "production" {
  project_id  = vercel_project.web_app.id
  files       = data.vercel_project_directory.app_code.files
  production  = true
}

A dose of deployment sorcery from the grim vaults  ￼

4. Connecting the Unholy Services: DNS and Dark Pacts

Bind your cursed domain to your Vercel project and the GCP DNS realm:

resource "vercel_project_domain" "primary" {
  project_id = vercel_project.web_app.id
  domain     = "app.your-domain.com"
}

resource "google_dns_record_set" "vercel_dns" {
  name         = "app.your-domain.com."
  type         = "CNAME"
  ttl          = 300
  managed_zone = "your-dns-zone"
  rrdatas      = ["cname.vercel-dns.com."]
}

Learn the secret rites from Puvvadi’s grim manuscript  ￼

5. Execution Workflow: The Incantation of Initialization

Recite these commands to bring forth your spectral infrastructure:

# Awaken the Terraform spirits
terraform init

# Peer into the future—see the spectral plan
terraform plan

# Bind your will to the infrastructure (confirm with a whispered "yes")
terraform apply -auto-approve

# When the darkness must recede, banish all resources:
terraform destroy

6. Key Considerations: Secrets, State, and Team Covenants
	•	State Management:
Use Terraform Cloud or a GCS backend to ensure your state remains guarded like Dracula’s coffins.
	•	Secret Handling:
Keep the Vercel token hidden in your Terraform variables and your GCP credentials away from mortal eyes.
	•	Team Collaboration:
If you lead a coven of developers, set the team_id in your Vercel resources to bind projects to your organization.

For further ghastly details, consult the grim scrolls of the Vercel and GCP Terraform documentation  ￼

Conclusion: Embrace the Eternal Night

Thus, with a flourish of our digital incantations, you have bound together the arcane energies of Vercel and GCP into a single, eerie deployment. May your code remain unbroken and your deployments rise from the crypt each time you invoke Terraform!

Happy haunting and code on, my dark apprentice.
