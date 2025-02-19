Below is a sample training document (in Markdown) that walks you through using Terraform—from a GCP environment—to deploy a project to Vercel. You can adapt this guide to your own application and workflow.

# Terraform Training: Deploying to Vercel from GCP

This guide will show you how to use Terraform (running on Google Cloud Platform) to provision and deploy a Vercel project. By the end of this training, you will have a basic Terraform configuration that creates a Vercel project and (optionally) triggers a deployment from a Git repository.

> **Note:** Although Vercel is a hosted platform, you can manage its projects and deployments using Terraform’s Vercel Provider. This guide assumes you have a Vercel account and a Git repository (e.g., hosting a Next.js or static site) you wish to deploy.

---

## Prerequisites

Before you begin, ensure that you have:

- **Google Cloud Platform (GCP) setup:**
  - A GCP account and active project.
  - [Terraform installed](https://developer.hashicorp.com/terraform/tutorials/install-cli) locally or use [GCP Cloud Shell](https://cloud.google.com/shell).

- **Vercel setup:**
  - A Vercel account.
  - A Vercel API token generated from your Vercel dashboard.
    - Export it in your environment (e.g., in Cloud Shell):  
      ```bash
      export VERCEL_API_TOKEN="your_vercel_api_token"
      ```
- **GitHub repository:**
  - A repo (public or private) containing your project code (e.g., a Next.js app).  
  - (Optional) The Vercel GitHub integration installed if you want to link your repo automatically.

- **Terraform remote state (optional but recommended):**
  - A Google Cloud Storage (GCS) bucket for storing Terraform state.

---

## Setting Up the Environment in GCP

1. **Using Cloud Shell or Local Machine:**  
   Launch [GCP Cloud Shell](https://cloud.google.com/shell) (which comes with Terraform pre-installed) or install Terraform on your local workstation.

2. **Configure Remote State (Optional):**  
   Create a GCS bucket to store your Terraform state. For example:
   ```bash
   PROJECT_ID=$(gcloud config get-value project)
   gsutil mb gs://${PROJECT_ID}-tfstate
   gsutil versioning set on gs://${PROJECT_ID}-tfstate

Then, create a file (e.g., backend.tf) with:

terraform {
  backend "gcs" {
    bucket = "${PROJECT_ID}-tfstate"
    prefix = "vercel-deployment"
  }
}

Writing Your Terraform Configuration

Create a file called main.tf in your working directory. The configuration below uses the Vercel provider to create a project and (optionally) trigger a deployment.

1. Terraform Block & Providers

terraform {
  required_version = ">= 1.1.0"

  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 0.3"  # Use the latest stable version as per the Terraform Registry  [oai_citation_attribution:0‡registry.terraform.io](https://registry.terraform.io/providers/vercel/vercel/latest/docs)
    }
  }

  # (Optional) backend configuration is in a separate file (backend.tf)
}

provider "vercel" {
  # The provider will use the VERCEL_API_TOKEN environment variable.
  # Ensure you have exported VERCEL_API_TOKEN in your shell.
}

2. Creating a Vercel Project Resource

This resource creates a new Vercel project. Replace <your-github-username> and the repository name accordingly.

resource "vercel_project" "example" {
  name      = "terraform-vercel-demo"
  framework = "nextjs"  # Change this to match your project (e.g., "create-react-app", "static", etc.)

  git_repository = {
    type = "github"
    repo = "<your-github-username>/your-repo-name"
  }

  # If deploying under a team, include:
  # team_id = "<your-team-id>"
}

3. Deploying Your Project with Vercel

If you want to deploy your project directly (without relying solely on GitHub integrations), you can add a deployment resource. This example packages the project directory (assuming the project is local) and triggers a production deployment.

data "vercel_project_directory" "example" {
  path = "../your-project-directory"  # Adjust the relative path to your project code.
}

resource "vercel_deployment" "example" {
  project_id  = vercel_project.example.id
  files       = data.vercel_project_directory.example.files
  production  = true
}

For more details on available resources and attributes, refer to the Vercel Provider documentation  ￼.

Running Your Terraform Configuration
	1.	Initialize Terraform:
From your working directory, run:

terraform init


	2.	Review the Plan:
Generate and review the execution plan:

terraform plan


	3.	Apply the Configuration:
Deploy the configuration by running:

terraform apply

When prompted, type yes to confirm.

	4.	Verify on Vercel:
Log in to your Vercel dashboard. You should see the new project (and deployment) created according to your Terraform configuration.

Conclusion

You’ve now deployed a Vercel project using Terraform—from your GCP environment. This code-first approach makes it easy to version and repeat deployments across environments, and it enables you to integrate Vercel management into your broader infrastructure-as-code workflows.

For further learning, check out:
	•	Integrating Terraform with Vercel  ￼
	•	Deploy to Vercel from Terraform  ￼

Happy coding and deploying!

---

This document serves as a starting point. As you expand your infrastructure, you might integrate additional Terraform modules, advanced state management, and CI/CD pipelines (for example, via GitHub Actions). Enjoy building your deployment workflows!