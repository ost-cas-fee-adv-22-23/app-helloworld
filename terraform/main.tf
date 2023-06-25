locals {
  name       = "app-helloworld"
  gcp_region = "europe-west6"
}

provider "google" {
  project = "expanded-symbol-389711"
  region  = local.gcp_region
}

provider "random" {
}

data "google_project" "project" {
}

terraform {
  backend "gcs" {
    bucket = "cas-fee-advanced-helloworld-tf-state"
  }
}