---
layout: post
title: "Scaling Moody's AXIS for Enterprise Actuarial Valuations: A Practitioner's Deep Dive"
date: 2025-12-25
author: Rohit Mistry
categories: [actuarial, cloud-architecture, azure, devops]
tags: [moodys-axis, gridlink, vmss, terraform, packer, ifrs17, actuarial-systems]
description: "A comprehensive guide to deploying Moody's AXIS at enterprise scale using Azure cloud infrastructure. Covers GridLink architecture, auto-scaling patterns, and lessons learned from a $100M global implementation."
image: /assets/images/axis-architecture-hero.png
---

> _Yesterday, life gave me the greatest gift. Today, I pass forward what I can - my knowledge and experience, shared freely, in hopes it finds someone who needs it._
>
> Merry Christmas and happy New Holidays!

**A Practitioner's Deep Dive**

If you've ever been involved in actuarial valuations at a large insurance company, you know the pain. Quarterly close comes around, and suddenly your actuarial team needs 10x the computing power they use on a typical Tuesday. You're either paying for idle servers 90% of the time, or your actuaries are waiting days for their models to complete.

I spent over four years solving this problem at one of the world's largest insurance companies—designing and implementing a global actuarial valuation pipeline that scaled to 5,000+ VMs, processed 500 terabytes of data, and reduced infrastructure costs by over 60%.

This is the guide I wish existed when I started. It's written for actuarial leaders trying to modernize their infrastructure, cloud architects new to the actuarial domain, and anyone curious about what it takes to run insurance valuations at true enterprise scale.

---

## Table of Contents

1. [The Problem: Why Traditional AXIS Deployments Don't Scale](#the-problem-why-traditional-axis-deployments-dont-scale)
2. [Understanding GridLink: The Heart of AXIS Distribution](#understanding-gridlink-the-heart-of-axis-distribution)
3. [Master vs Helper: The Architecture Decision That Changes Everything](#master-vs-helper-the-architecture-decision-that-changes-everything)
4. [Designing Farm Architectures for Different Workloads](#designing-farm-architectures-for-different-workloads)
5. [The Cloud-Native Transformation: Azure VMSS](#the-cloud-native-transformation-azure-vmss)
6. [Building the Auto-Scale Engine](#building-the-auto-scale-engine)
7. [Infrastructure as Code: Terraform and Packer](#infrastructure-as-code-terraform-and-packer)
8. [The Scaling Formula: Calculating Optimal Capacity](#the-scaling-formula-calculating-optimal-capacity)
9. [Regional Deployments and Compliance](#regional-deployments-and-compliance)
10. [Lessons Learned: What I'd Do Differently](#lessons-learned-what-id-do-differently)
11. [The IFRS17 Factor: Why This Matters Now](#the-ifrs17-factor-why-this-matters-now)
12. [Conclusion and Next Steps](#conclusion-and-next-steps)

---

## The Problem: Why Traditional AXIS Deployments Don't Scale

Let me paint you a picture. It's the last week of the quarter. Your actuarial team has 2,000 policy cohorts to value across multiple product lines, regulatory frameworks, and geographies. Each valuation run takes anywhere from 15 minutes to 8 hours depending on complexity.

In a traditional AXIS deployment, you have a fixed number of servers—let's say 200. They're always on, always costing money, and during quarter-end, they're completely overwhelmed. Jobs queue up. Actuaries stay late. Finance gets nervous about hitting deadlines.

The math is brutal:

- **Off-peak**: 200 servers running at 10% utilization = 180 servers doing nothing
- **Quarter-end**: 200 servers running at 100% = a 3-day backlog of jobs
- **Year-end**: You bring in contractors to manually provision more servers (yes, this actually happens)

The traditional response is to buy more hardware. But that just shifts the waste. You're now paying for 500 servers that sit idle 85% of the year.

**The real solution isn't more servers—it's elastic servers.**

Cloud computing solved this problem for web applications a decade ago. But actuarial systems are different. They're complex, stateful, Windows-based, and tied to specialized software like Moody's AXIS. Getting them to scale dynamically requires deep integration work that most vendors don't offer out of the box.

That's what this guide is about: how to make AXIS elastic.

---

## Understanding GridLink: The Heart of AXIS Distribution

Before we can scale AXIS, we need to understand how it distributes work. That's where GridLink comes in.

GridLink is AXIS's distributed computing engine. Think of it as a traffic controller for actuarial calculations. When an actuary submits a job, GridLink decides which servers run it, how the work is split up, and how results are aggregated.

### Core Concepts

**Farms**: A farm is an isolated pool of compute resources. You might have separate farms for different regions (Asia, Canada, US) or different workload types (desktop analysis, production valuations). Farms don't share resources with each other—this isolation is critical for both performance and compliance.

**Primary Controller**: Each farm has exactly one Primary Controller. This is the server that receives job submissions and orchestrates distribution. It's the brain of the farm.

**Servers**: The compute nodes that actually run calculations. Each server has CPU cores, and GridLink tracks how many cores are available on each server.

**Jobs**: A unit of work submitted by an actuary. Jobs get broken down into tasks that can run in parallel across multiple servers.

### How Job Distribution Works

When a job is submitted:

1. It arrives at the Primary Controller
2. The Primary Controller checks which servers are available
3. Work is distributed based on server capacity and job requirements
4. Each server runs its portion of the calculations
5. Results are aggregated and returned

The key insight here is that **GridLink is already designed for distributed computing**. Our job isn't to reinvent distribution—it's to make the underlying server pool dynamic.

---

## Master vs Helper: The Architecture Decision That Changes Everything

This is where most AXIS scaling projects go wrong. They treat all servers as equal. They're not.

GridLink has two server roles, and understanding the difference is critical for capacity planning:

### Master Servers

Master servers can coordinate jobs. When you submit a valuation, a Master server takes ownership, breaks down the work, and manages execution.

**Critical insight**: A farm can only run as many simultaneous jobs as it has Master servers.

If you have 10 Master servers and 500 Helper servers, you can only run 10 jobs at once—even though you have massive compute capacity available.

### Helper Servers

Helper servers execute calculations but can't coordinate jobs. They're the workhorses that crunch numbers.

### The Ratio Problem

Here's where it gets interesting. The optimal Master-to-Helper ratio depends entirely on your workload:

| Workload Type          | Typical Job Duration | Optimal Masters | Why                                 |
| ---------------------- | -------------------- | --------------- | ----------------------------------- |
| Desktop Analysis       | 5-15 minutes         | High (40+)      | Many small jobs, need parallelism   |
| Standard Valuations    | 30-60 minutes        | Medium (30-50)  | Balanced throughput                 |
| Large IFRS17 Runs      | 2-8 hours            | Low (10-15)     | Few massive jobs, need depth        |
| Year-End Consolidation | 8+ hours             | Very Low (4-5)  | Jumbo jobs, maximum helpers per job |

**If you get this ratio wrong, you'll either have jobs queuing up waiting for Masters (bottleneck) or Helpers sitting idle while Masters are overwhelmed (waste).**

In our implementation, we made Master/Helper assignment dynamic. Servers could be promoted from Helper to Master based on current queue depth—but more on that later.

---

## Designing Farm Architectures for Different Workloads

One size does not fit all. A desktop analysis that an actuary runs interactively has completely different requirements than a year-end IFRS17 valuation.

Here's the farm architecture we deployed globally:

### Farm Configuration Matrix

| Farm Name    | Job Slots | Helpers per Job | Primary Use Case                     |
| ------------ | --------- | --------------- | ------------------------------------ |
| Desktop_Job  | 40        | 5               | Interactive analysis, ad-hoc queries |
| Standard_Job | 50        | 25              | Regular production runs              |
| Medium_Job   | 30        | 50              | Complex model valuations             |
| Large_Job    | 10        | 200             | IFRS17 quarterly valuations          |
| Jumbo_Job    | 4         | 500             | Year-end, consolidations             |

Each farm was replicated per region (Asia, Canada, US, Group) for a total of 20+ distinct farms.

### Why This Structure?

**Desktop farms** prioritize responsiveness. Actuaries running quick analyses need results fast, even if the calculations themselves are simple. High job slot count means minimal queuing.

**Standard farms** balance throughput and response time. Most day-to-day production work lands here.

**Large and Jumbo farms** prioritize depth over breadth. IFRS17 valuations can require thousands of CPU cores working on a single job. You don't need many concurrent jobs—you need each job to have access to massive compute.

### Regional Isolation

We maintained separate farms per region for three reasons:

1. **Data residency**: Some regulatory frameworks require that policy data stays within geographic boundaries
2. **Performance**: Network latency matters when you're moving terabytes of model data
3. **Operational independence**: Asia's quarter-end doesn't need to compete with Canada's for resources

---

## The Cloud-Native Transformation: Azure VMSS

Here's where the magic happens. Azure Virtual Machine Scale Sets (VMSS) let you create and destroy VMs programmatically in minutes.

But AXIS wasn't designed for ephemeral infrastructure. It expects servers to be stable, domain-joined, properly configured Windows machines. Making AXIS cloud-native required solving several challenges:

### Challenge 1: Golden Image Creation

Every VMSS instance needs to boot from an image that already has AXIS installed and configured. We used HashiCorp Packer to create these images:

```hcl
# Simplified Packer configuration
source "azure-arm" "axis-image" {
  os_type         = "Windows"
  image_publisher = "MicrosoftWindowsServer"
  image_offer     = "WindowsServer"
  image_sku       = "2019-Datacenter-gensecond"

  vm_size         = "Standard_F16s_v2"

  managed_image_name = "ggy-grid-win2019"
  managed_image_resource_group_name = "ggy-sig-infra-cac-prd"
}

build {
  sources = ["source.azure-arm.axis-image"]

  # Install AXIS components
  provisioner "powershell" {
    script = "scripts/install-axis.ps1"
  }

  # Configure GridLink client
  provisioner "powershell" {
    script = "scripts/configure-gridlink.ps1"
  }

  # Sysprep for generalization
  provisioner "powershell" {
    inline = ["& $env:SystemRoot\\System32\\Sysprep\\Sysprep.exe /oobe /generalize /quiet /shutdown"]
  }
}
```

The image build process takes about 45 minutes and runs weekly through our CI/CD pipeline. Each new image is versioned and stored in Azure Compute Gallery for regional distribution.

### Challenge 2: Domain Join and Configuration

When a new VM spins up, it needs to:

1. Join the Active Directory domain
2. Register with GridLink
3. Synchronize AXIS versions from the shared repository
4. Configure itself as a Helper (default) or Master

We handled this through PowerShell DSC (Desired State Configuration) and a custom Windows service that runs on boot:

```powershell
# Simplified GridLink registration
Function Add-GridLinkServer() {
    $gridLinkAddServerParameter = Get-GridLinkServerNameWithIp

    Log "Installing GridLink service on '$gridLinkAddServerParameter'"

    Start-Process -FilePath $gridLinkUtilityPath -ArgumentList @(
        "-SQLSERVER:$gridLinkSQLServer"
        "-SQLDB:$gridLinkSQLDB"
        "-ADDSERVER:$gridLinkAddServerParameter"
        "-GLINSTALL"
    ) -Wait

    # Add server to farm
    Start-Process -FilePath $gridLinkUtilityPath -ArgumentList @(
        "-SQLSERVER:$gridLinkSQLServer"
        "-SQLDB:$gridLinkSQLDB"
        "-ADDSERVER:$gridLinkAddServerParameter"
        "-FARM:$gridLinkFarmName"
    ) -Wait

    # Synchronize AXIS versions
    Start-Process -FilePath $gridLinkUtilityPath -ArgumentList @(
        "-SQLSERVER:$gridLinkSQLServer"
        "-SQLDB:$gridLinkSQLDB"
        "-FARM:$gridLinkFarmName"
        "-SYNC:1"
    ) -Wait
}
```

### Challenge 3: Graceful Deprovisioning

Scaling down is harder than scaling up. You can't just delete a VM that's in the middle of a calculation.

Our deprovisioning logic:

1. Check if any jobs are pending or running in the farm
2. Verify minimum instance count isn't violated
3. Remove server from GridLink (this stops new work from being assigned)
4. Wait for in-flight calculations to complete
5. Clean up Active Directory computer account
6. Delete the VMSS instance

```powershell
Function Remove-VMSSInstance() {
    # Safety checks
    $anyJobsPendingOrRunning = Get-AnyJobsPendingOrRunning
    If ($anyJobsPendingOrRunning -eq "True") {
        Log "Cannot remove instance - jobs still running"
        Return
    }

    $instanceId = Get-CurrentVMSSInstanceID

    # Remove from GridLink first
    Remove-ServerFromGridLink

    # Then delete from Azure
    az vmss delete-instances `
        --instance-ids $instanceId `
        --name $customData.VmssName `
        --resource-group $customData.VmssNameRG
}
```

---

## Building the Auto-Scale Engine

The auto-scale engine is the brain of the operation. It runs continuously on the Primary Controller, monitoring queue depth and adjusting capacity.

### The Control Loop

Every 30 seconds, the engine:

1. **Queries job queue**: How many jobs are pending? Running?
2. **Checks server status**: How many servers are idle? Working? Starting up?
3. **Calculates target capacity**: Based on queue depth and job requirements
4. **Adjusts VMSS**: Scale up or down as needed
5. **Manages server roles**: Promote Helpers to Masters if needed

### Scale-Up Logic

```powershell
Function Start-FarmScaleUpOnPendingJobs() {
    $pendingOrRunningJobCount = Get-PendingOrRunningJobCount

    If ($pendingOrRunningJobCount -eq 0) {
        # No work pending, ensure minimum instances
        Ensure-MinimumInstanceCount
        Return
    }

    # Get farm configuration
    $maxCoresPerJob = Get-FarmMaxCoresPerJob
    $avgCoresPerMachine = Get-FarmAverageCpuCount

    # Count current capacity
    $idleServerCount = Get-IdleServerCount
    $vmssCreatingCount = Get-VMSSCreatingInstanceCount

    # Calculate how many new instances we need
    $numberOfNewInstances = [Math]::Ceiling(
        (($pendingOrRunningJobCount * $maxCoresPerJob / $avgCoresPerMachine) -
         ($idleServerCount + $vmssCreatingCount)) *
        $overProvisionRatio
    )

    If ($numberOfNewInstances -gt 0) {
        $newCapacity = $currentCapacity + $numberOfNewInstances

        az vmss update `
            --name $vmssName `
            --resource-group $vmssRg `
            --set "sku.capacity=$newCapacity" `
            --no-wait
    }
}
```

### Dynamic Master Promotion

When jobs are queuing but we have idle Helpers, we need more Masters:

```powershell
# If we have enough idle workers and pending jobs, promote one to Master
If (($idleServerCount -ge $numberOfMachinesPerJob) -and
    ($pendingJobCount -gt 0)) {

    # Pick a random idle server
    $serverToPromote = ($idleServerList | Get-Random).ServerName

    Log "Promoting $serverToPromote to Master"
    Set-GridLinkServerType -server $serverToPromote -type "Master"

    # Wait for it to start processing
    Wait-ForServerToAcceptWork -server $serverToPromote -timeout 120
}
```

---

## Infrastructure as Code: Terraform and Packer

Everything is code. No manual configuration. No snowflake servers.

### Terraform Structure

```
infra/
├── prod/
│   ├── main.tf           # Resource groups, storage, identity
│   ├── packer.tf         # Image build orchestration
│   ├── variables.tf      # Configuration parameters
│   ├── terraform.auto.tfvars  # Environment-specific values
│   └── packer/
│       ├── Azure-Windows.pkr.hcl  # Packer template
│       ├── package/
│       │   ├── BulkInstall.ps1    # AXIS installation
│       │   ├── Configuration.ps1  # DSC configuration
│       │   └── GGY_PS_Service_Tick.ps1  # Auto-scale service
│       └── scripts/
│           └── download-and-run.ps1
```

### Key Terraform Resources

```hcl
# Azure Compute Gallery for image distribution
resource "azurerm_shared_image_gallery" "acg" {
  name                = var.shared_image_gallery_name
  resource_group_name = module.acg_rg.name
  location            = module.acg_rg.location
}

# Image definition
resource "azurerm_shared_image" "vmssimg" {
  name                = var.shared_image_name
  gallery_name        = azurerm_shared_image_gallery.acg.name
  resource_group_name = module.acg_rg.name
  location            = module.acg_rg.location
  os_type             = "Windows"
  hyper_v_generation  = "V2"

  identifier {
    publisher = var.image_publisher
    offer     = var.image_offer
    sku       = var.image_sku
  }
}

# Key Vault for credentials
module "packer_keyvault" {
  source              = "../../templates/modules/management_tools/key_vault/v1"
  name                = var.packer_keyvault_name
  resource_group_name = module.acg_rg.name
  location            = module.acg_rg.location

  enabled_for_deployment = true
}
```

### CI/CD Pipeline

Our Jenkins pipeline:

1. **Validate**: `terraform validate`, `packer validate`
2. **Plan**: `terraform plan` with manual approval gate
3. **Build Image**: Run Packer, upload to Compute Gallery
4. **Deploy Infrastructure**: `terraform apply`
5. **Smoke Test**: Verify new instances can join GridLink
6. **Cleanup**: Remove old images beyond retention threshold

---

## The Scaling Formula: Calculating Optimal Capacity

This formula is the result of months of tuning:

```
New Instances = ⌈(Pending Jobs × Max Cores per Job / Avg Cores per VM) -
                 (Idle Servers + Creating Servers)⌉ × Overprovision Ratio
```

### Breaking It Down

**Pending Jobs × Max Cores per Job**: The total compute demand in the queue. If you have 5 pending Large jobs each requiring 200 cores, you need 1,000 cores.

**Avg Cores per VM**: Our VMs were typically 16-core machines. So 1,000 cores ÷ 16 = 63 machines needed.

**Idle Servers + Creating Servers**: What we already have available. Don't create duplicates.

**Overprovision Ratio**: A multiplier (usually 1.0-1.2) to account for startup time and failed instances.

### Why This Works

The formula is **demand-driven, not threshold-driven**. Traditional auto-scaling uses rules like "if CPU > 80%, add 2 instances." That doesn't work for actuarial workloads because:

1. Jobs are batch, not continuous—CPU goes 0-100-0, not gradually up
2. Job sizes vary wildly—a Desktop job and a Jumbo job have completely different needs
3. Queue depth matters more than current utilization

By calculating actual demand and comparing to available supply, we scale precisely.

---

## Regional Deployments and Compliance

Global insurers operate under different regulatory regimes. Our architecture respected these boundaries:

### Regional Farm Matrix

| Region | Farms            | Data Residency   | Compliance Frameworks       |
| ------ | ---------------- | ---------------- | --------------------------- |
| Asia   | VSSC, IFRS17     | Hong Kong, Japan | Local insurance regulations |
| Canada | ASSC, IFRS17     | Canada           | OSFI requirements           |
| US     | LMT, IFRS17      | United States    | State insurance regulations |
| Group  | GAM, GFAST, GABS | Varies           | Consolidated reporting      |

### Implementation Approach

Each region got its own:

- VMSS (compute stays in-region)
- Storage accounts (data stays in-region)
- Key Vault (credentials stay in-region)
- GridLink database (metadata stays in-region)

The Terraform code was parameterized to deploy identical infrastructure across regions with region-specific configuration:

```hcl
# terraform.auto.tfvars for Canada
deploy_location = "canadacentral"
virtual_network_name = "VNET-CAC-GGY-Production-01"
ggy_gridlink_share = "\\\\AZCCSGFAAPPP00\\Software\\Evergreen\\AxisVersions"
```

---

## Lessons Learned: What I'd Do Differently

Four years of running this system taught me things you can't learn from documentation.

### 1. Start with Farm Design

Don't start with infrastructure. Start with understanding your workload patterns. Talk to actuaries. Look at historical job data. Map out peak periods.

The farm structure (Desktop/Standard/Large/Jumbo) came from analyzing a year of job history. We could have saved months if we'd done this analysis first.

### 2. Automate Everything—Including Cleanup

We automated provisioning immediately. We didn't automate cleanup until month six. The result? Orphaned servers in GridLink, stale AD computer accounts, and a lot of manual housekeeping.

Build cleanup automation from day one:

```powershell
Function Start-BadServerCleanup() {
    # Find servers in GridLink that don't exist in VMSS
    $gridLinkServers = Get-GridLinkServers

    foreach ($server in $gridLinkServers) {
        $existsInVMSS = Test-ServerExistsInVMSS -name $server

        If (-not $existsInVMSS) {
            Log "Cleaning up orphaned server: $server"
            Remove-ServerFromGridLink -name $server
            Remove-ServerFromAD -name $server
        }
    }
}
```

### 3. Monitor Aggressively

We logged everything to SQL:

- Every scale event
- Every server registration
- Every job assignment
- Every failure

This data was invaluable for:

- Debugging issues in production
- Capacity planning
- Demonstrating ROI to leadership

### 4. Plan for Failure

VMs fail. Network glitches happen. Azure has outages. Design for resilience:

- Minimum instance counts (never scale to zero)
- Retry logic for Azure CLI calls
- Graceful degradation when services are unavailable
- Alerting on anomalies

### 5. Test at Scale

Our test environment had 20 servers. Production had 5,000. Behaviors that worked perfectly in test failed spectacularly at scale:

- SQL connection pool exhaustion
- Active Directory replication lag
- Storage throughput limits
- Azure API rate limits

Load test with production-scale data before you go live.

---

## The IFRS17 Factor: Why This Matters Now

IFRS17 changed everything for actuarial computing.

Before IFRS17, valuations were relatively straightforward. You'd run a model, get results, move on.

IFRS17 introduced:

- **Cohort-level calculations**: Instead of valuing products in aggregate, you value annual cohorts separately
- **Risk adjustment modeling**: Additional stochastic calculations for each cohort
- **CSM amortization**: The Contractual Service Margin requires tracking and amortization over time
- **Quarterly remeasurement**: What was annual is now quarterly

The computational impact? Roughly 10x increase in workload.

Companies that had comfortable valuation timelines suddenly faced multi-day run times. Those with already-stretched infrastructure faced impossible deadlines.

Cloud-native AXIS isn't a nice-to-have anymore. For any insurer with significant liabilities, it's a necessity.

---

## Conclusion and Next Steps

Scaling Moody's AXIS is hard. It requires deep knowledge of actuarial systems, cloud infrastructure, and distributed computing. But it's absolutely possible, and the rewards are substantial:

- **60%+ cost reduction** from eliminating idle capacity
- **10x throughput increase** during peak periods
- **Hours instead of days** for quarter-end valuations
- **Infinite scalability** for future growth

If your organization is considering this journey, here's my advice:

1. **Start small**: Pick one farm, one region. Prove the concept before scaling.
2. **Invest in observability**: You can't optimize what you can't measure.
3. **Bring actuaries into the process**: They know the workload better than anyone.
4. **Plan for IFRS17**: If you haven't felt the computational pressure yet, you will.

> **Source Code Available**: I've open-sourced a sanitized version of the infrastructure code described in this article. You can find the Terraform modules, Packer templates, and PowerShell scripts at [github.com/righteouslabs/manulife-moodys-axis-build-and-destroy](https://github.com/righteouslabs/manulife-moodys-axis-build-and-destroy).

This is niche knowledge. There aren't many people who've done this end-to-end at enterprise scale. If you're working on something similar and want to compare notes, I'd love to hear from you.

---

## About the Author

**Rohit Mistry** is a Senior Cloud Architecture Consultant with 10+ years of experience delivering enterprise-scale data platforms. He spent 2 years at Moody's Analytics pioneering cloud computing solutions for actuarial systems, followed by 4 years implementing the global actuarial valuation pipeline described in this article.

He specializes in Azure architecture, infrastructure as code, and making complex systems scale.

_Found this useful? Share it with others who might benefit. Have questions? Drop a comment or reach out on LinkedIn._

**Connect:**

- LinkedIn: [linkedin.com/in/rohit-mistry](https://linkedin.com/in/rohit-mistry)
- GitHub: [@rrmistry](https://github.com/rrmistry)
- Website: [rrmistry.ca](https://rrmistry.ca)

---

_Where ever you are, what ever you are doing right now, know that you are loved and appreciated._

_Thank you for giving me the privilege of your time today._
