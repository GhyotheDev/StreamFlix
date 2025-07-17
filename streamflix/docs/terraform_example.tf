# Example Terraform configuration for StreamFlix on Azure Kubernetes Service

# Configure the Azure provider
provider "azurerm" {
  features {}
}

# Create a resource group
resource "azurerm_resource_group" "streamflix" {
  name     = "streamflix-resources"
  location = "East US"
  
  tags = {
    environment = "production"
    application = "streamflix"
  }
}

# Create a virtual network
resource "azurerm_virtual_network" "streamflix" {
  name                = "streamflix-network"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.streamflix.location
  resource_group_name = azurerm_resource_group.streamflix.name
}

# Create a subnet for AKS
resource "azurerm_subnet" "aks" {
  name                 = "aks-subnet"
  resource_group_name  = azurerm_resource_group.streamflix.name
  virtual_network_name = azurerm_virtual_network.streamflix.name
  address_prefixes     = ["10.0.1.0/24"]
}

# Create an Azure Container Registry
resource "azurerm_container_registry" "acr" {
  name                = "streamflixacr"
  resource_group_name = azurerm_resource_group.streamflix.name
  location            = azurerm_resource_group.streamflix.location
  sku                 = "Standard"
  admin_enabled       = false
}

# Create an AKS cluster
resource "azurerm_kubernetes_cluster" "aks" {
  name                = "streamflix-aks"
  location            = azurerm_resource_group.streamflix.location
  resource_group_name = azurerm_resource_group.streamflix.name
  dns_prefix          = "streamflix"
  kubernetes_version  = "1.25.5"

  default_node_pool {
    name                = "default"
    node_count          = 2
    vm_size             = "Standard_DS2_v2"
    vnet_subnet_id      = azurerm_subnet.aks.id
    enable_auto_scaling = true
    min_count           = 2
    max_count           = 5
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin    = "azure"
    load_balancer_sku = "standard"
    network_policy    = "calico"
  }

  role_based_access_control_enabled = true

  addon_profile {
    oms_agent {
      enabled                    = true
      log_analytics_workspace_id = azurerm_log_analytics_workspace.streamflix.id
    }
  }

  tags = {
    environment = "production"
    application = "streamflix"
  }
}

# Create a Log Analytics workspace for monitoring
resource "azurerm_log_analytics_workspace" "streamflix" {
  name                = "streamflix-logs"
  location            = azurerm_resource_group.streamflix.location
  resource_group_name = azurerm_resource_group.streamflix.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

# Create a Cosmos DB account
resource "azurerm_cosmosdb_account" "db" {
  name                = "streamflix-cosmos"
  location            = azurerm_resource_group.streamflix.location
  resource_group_name = azurerm_resource_group.streamflix.name
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"

  consistency_policy {
    consistency_level       = "Session"
    max_interval_in_seconds = 5
    max_staleness_prefix    = 100
  }

  geo_location {
    location          = azurerm_resource_group.streamflix.location
    failover_priority = 0
  }
}

# Create a Storage Account for media files
resource "azurerm_storage_account" "storage" {
  name                     = "streamflixstorage"
  resource_group_name      = azurerm_resource_group.streamflix.name
  location                 = azurerm_resource_group.streamflix.location
  account_tier             = "Standard"
  account_replication_type = "GRS"
  
  blob_properties {
    cors_rule {
      allowed_headers    = ["*"]
      allowed_methods    = ["GET", "HEAD"]
      allowed_origins    = ["*"]
      exposed_headers    = ["*"]
      max_age_in_seconds = 3600
    }
  }
}

# Create a CDN profile
resource "azurerm_cdn_profile" "cdn" {
  name                = "streamflix-cdn"
  location            = azurerm_resource_group.streamflix.location
  resource_group_name = azurerm_resource_group.streamflix.name
  sku                 = "Standard_Microsoft"
}

# Create a CDN endpoint
resource "azurerm_cdn_endpoint" "cdn_endpoint" {
  name                = "streamflix-cdn-endpoint"
  profile_name        = azurerm_cdn_profile.cdn.name
  location            = azurerm_resource_group.streamflix.location
  resource_group_name = azurerm_resource_group.streamflix.name
  origin_host_header  = azurerm_storage_account.storage.primary_blob_host

  origin {
    name      = "streamflixorigin"
    host_name = azurerm_storage_account.storage.primary_blob_host
  }
}

# Create a Key Vault
resource "azurerm_key_vault" "keyvault" {
  name                        = "streamflix-keyvault"
  location                    = azurerm_resource_group.streamflix.location
  resource_group_name         = azurerm_resource_group.streamflix.name
  enabled_for_disk_encryption = true
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  soft_delete_retention_days  = 7
  purge_protection_enabled    = false

  sku_name = "standard"

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id

    key_permissions = [
      "Get", "List", "Create", "Delete",
    ]

    secret_permissions = [
      "Get", "List", "Set", "Delete",
    ]

    certificate_permissions = [
      "Get", "List", "Create", "Delete",
    ]
  }
}

# Get current client configuration
data "azurerm_client_config" "current" {}

# Output values
output "aks_cluster_name" {
  value = azurerm_kubernetes_cluster.aks.name
}

output "acr_login_server" {
  value = azurerm_container_registry.acr.login_server
}

output "cosmos_db_endpoint" {
  value = azurerm_cosmosdb_account.db.endpoint
}

output "cdn_endpoint" {
  value = "https://${azurerm_cdn_endpoint.cdn_endpoint.host_name}"
}