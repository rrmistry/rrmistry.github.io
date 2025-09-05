---
title: "Kubernetes for Non-Developers: What They Don't Tell You"
date: 2025-01-06
description: "After 8 years of building apps with Kubernetes, here's what most tutorials won't tell you: it's just cloud computing with different names. Let me show you the patterns they share"
tags:
  [
    'aws-vs-kubernetes',
    'cloud-patterns',
    'cloud',
    'container-orchestration',
    'devops',
    'kubernetes',
    'technology',
    'tutorial'
  ]
---

<script>
	import Mermaid from '$lib/components/Mermaid.svelte';
</script>

After 8 years of working with Kubernetes, I've noticed something interesting: most explanations focus on what Kubernetes _is_, but they rarely talk about what it _really is_ - just another interface to the same patterns you already know from cloud computing.

Here's what they don't tell you: **Kubernetes and cloud platforms are just different ways to interact with the same underlying concepts**. Once you see the patterns, everything clicks.

Before diving deeper, here's Fireship's excellent explanation of Kubernetes in just 100 seconds:

<div class="flex justify-center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/PziYflu8cB8?si=KT5xlYmZKhZx0VBf" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

<div class="text-center">
<span class="text-xs">I am not affiliated with Fireship.io, just really like his work.</span>
</div>

## The Hidden Truth: It's All REST APIs

Here's the first thing they don't mention: whether you're using AWS, Azure, Google Cloud, or Kubernetes, you're ultimately just making REST API calls. The difference? The interface.

<Mermaid chart={`graph LR
    A[User] --> B[AWS CLI]
    A --> C[kubectl]
    A --> D[Azure CLI]
    B --> E[AWS REST API]
    C --> F[Kubernetes REST API]
    D --> G[Azure REST API]
    E --> H[Create VM/Container]
    F --> I[Create Pod]
    G --> J[Create VM/Container]`} />

When you run:

- `aws ec2 run-instances` - You're making a REST API call to AWS
- `kubectl create pod` - You're making a REST API call to Kubernetes
- `az vm create` - You're making a REST API call to Azure

**They're all just REST API wrappers.** The power isn't in the commands - it's in understanding you're always just telling an API to create, read, update, or delete resources.

## The Pattern Nobody Talks About: It's All The Same Concepts

Here's what eight years of working across cloud platforms taught me - they're all selling you the same things with different names:

| What You Want          | AWS Calls It        | Kubernetes Calls It     | Azure Calls It          | What It Really Is         |
| ---------------------- | ------------------- | ----------------------- | ----------------------- | ------------------------- |
| A computer to run code | EC2 Instance        | Pod                     | Virtual Machine         | Isolated compute unit     |
| Storage that persists  | EBS Volume          | PersistentVolume        | Managed Disk            | Block storage             |
| A way to find services | ELB/ALB             | Service/Ingress         | Load Balancer           | Traffic distributor       |
| Grouping of resources  | VPC                 | Namespace               | Resource Group          | Logical boundary          |
| Who can do what        | IAM                 | RBAC                    | Azure AD/RBAC           | Access control            |
| Secrets storage        | Secrets Manager     | Secrets                 | Key Vault               | Encrypted key-value store |
| Scaling rules          | Auto Scaling Groups | HorizontalPodAutoscaler | VM Scale Sets           | Automated scaling         |
| Network isolation      | Security Groups     | NetworkPolicies         | Network Security Groups | Firewall rules            |

## The Real Architecture: Same Patterns, Different Names

Let me show you what they're not telling you. Here's a typical cloud architecture:

<Mermaid chart={`graph TD
    A[Load Balancer] --> B[VM 1]
    A --> C[VM 2]
    A --> D[VM 3]
    B --> E[Disk 1]
    C --> F[Disk 2]
    D --> G[Disk 3]
    H[Security Group] --> B
    H --> C
    H --> D`} />

And here's the "complex" Kubernetes architecture:

<Mermaid chart={`graph TD
    A[Service/Ingress] --> B[Pod 1]
    A --> C[Pod 2]
    A --> D[Pod 3]
    B --> E[PersistentVolume 1]
    C --> F[PersistentVolume 2]
    D --> G[PersistentVolume 3]
    H[NetworkPolicy] --> B
    H --> C
    H --> D`} />

**It's the same picture.** Different words, same concepts.

## Understanding Containers First

To truly understand Kubernetes, you need to understand containers. Here's Fireship's brilliant explanation of Docker in 100 seconds:

<div class="flex justify-center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/Gjnup-PuquQ?si=xZ3x2kQJhVzN0VBf" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

<div class="text-center">
<span class="text-xs">I am not affiliated with Fireship.io, just really like his work.</span>
</div>

And if you want to go deeper, here's his more comprehensive Docker tutorial:

<div class="flex justify-center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/gAkwW2tuIqE?si=7BhXD3z5KNhZ9VBf" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

<div class="text-center">
<span class="text-xs">I am not affiliated with Fireship.io, just really like his work.</span>
</div>

For a complete understanding of Docker concepts, here's Fireship's comprehensive "100+ Docker Concepts You Need to Know":

<div class="flex justify-center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/rIrNIzy6U_g?si=8BhXD3z5KNhZ9VBf" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

<div class="text-center">
<span class="text-xs">I am not affiliated with Fireship.io, just really like his work.</span>
</div>

## What Makes Kubernetes Different (And Why They Don't Emphasize This)

The key difference isn't complexity - it's abstraction level:

### Cloud Platforms: Infrastructure-Centric

- You manage VMs, disks, networks
- You think about servers
- You scale by adding more VMs
- Your unit of deployment is a virtual machine

### Kubernetes: Application-Centric

- You manage applications
- You think about workloads
- You scale by declaring desired state
- Your unit of deployment is a container

Here's what this means in practice:

```yaml
# Cloud approach: "Give me 3 VMs"
aws ec2 run-instances --count 3 --instance-type t2.micro

# Kubernetes approach: "Keep 3 copies of my app running"
kubectl scale deployment myapp --replicas=3
```

The Kubernetes approach is declarative - you say what you want, not how to do it.

## The REST API Secret They Don't Want You to Know

Want to see the magic behind kubectl? Every kubectl command is just a REST API call:

```bash
# This kubectl command:
kubectl get pods

# Is really just:
curl -X GET https://your-cluster/api/v1/namespaces/default/pods
```

```bash
# This kubectl command:
kubectl create deployment nginx --image=nginx

# Is really just a REST API call with JSON payload:
curl -X POST https://your-cluster/apis/apps/v1/namespaces/default/deployments \
  -H "Content-Type: application/json" \
  -d '<JSON with metadata.name=nginx and spec.template.spec.containers>'
```

Every cloud provider works the same way. The CLIs are just convenience wrappers around REST APIs.

## The Mental Model Shift Nobody Explains

Here's what changes when you move from cloud VMs to Kubernetes:

### Cloud VMs: Pets

- Each VM has a name you care about
- You SSH into specific VMs
- You update VMs in place
- A VM dies = investigation time

### Kubernetes: Cattle

- Pods have random names
- You never SSH into pods
- You replace, never update
- A pod dies = Kubernetes makes a new one

This isn't about complexity - it's about a fundamental shift in how you think about infrastructure.

## Real Patterns You'll Recognize

### Pattern 1: Everything Has Labels

**AWS**: Tags

```bash
aws ec2 create-tags --resources i-1234567890abcdef0 --tags Key=Environment,Value=Production
```

**Kubernetes**: Labels

```yaml
metadata:
  labels:
    environment: production
```

Same concept: metadata for organization and selection.

### Pattern 2: Service Discovery

**AWS**: Route53, ELB

- Register service with load balancer
- DNS points to load balancer
- Load balancer routes to instances

**Kubernetes**: Services

- Pods register with service
- DNS points to service
- Service routes to pods

Same pattern: stable endpoint, dynamic backends.

### Pattern 3: Configuration Management

**AWS**: Parameter Store, Secrets Manager

```bash
aws ssm put-parameter --name "/myapp/database/password" --value "secret" --type "SecureString"
```

**Kubernetes**: ConfigMaps, Secrets

```bash
kubectl create secret generic myapp-secret --from-literal=password=secret
```

Same pattern: separate config from code.

## The Uncomfortable Truth About Vendor Lock-in

Here's what they really don't want to talk about: Kubernetes is about avoiding vendor lock-in, but with a catch.

### Traditional Cloud Lock-in:

- AWS RDS → Can't easily move to Azure SQL
- AWS Lambda → Can't run on Google Cloud Functions
- AWS ECS → Specific to AWS

### Kubernetes "Portability":

- Your app runs anywhere... that runs Kubernetes
- But each cloud's Kubernetes has proprietary extensions
- EKS, GKE, AKS all have unique features

The reality? You're trading cloud vendor lock-in for Kubernetes lock-in. Whether that's better depends on your situation.

## What Actually Matters

After 8 years, here's what actually makes a difference:

### 1. **State Management**

- Stateless apps are easy everywhere
- Stateful apps are hard everywhere
- Kubernetes doesn't magically solve state

### 2. **Networking**

- Cloud: Security groups + Load balancers
- Kubernetes: NetworkPolicies + Services + Ingress
- More pieces, same puzzles

### 3. **Cost**

- Cloud VMs: Pay per VM hour
- Kubernetes: Pay for nodes, pack in more apps
- Can be cheaper IF you pack efficiently

### 4. **Operational Overhead**

- Cloud VMs: Update OS, install software, manage configs
- Kubernetes: Update cluster, manage manifests, debug layers
- Different complexity, not less

## The Skills That Actually Transfer

Here's what they don't tell you about learning Kubernetes - these skills transfer everywhere:

1. **REST API Thinking**: Every modern platform is REST APIs
2. **Declarative Configuration**: GitOps, Infrastructure as Code - it's all declarative
3. **Label-Based Selection**: Tags, labels, selectors - same concept everywhere
4. **Service Mesh Patterns**: Load balancing, service discovery, circuit breaking
5. **Container Thinking**: Immutable infrastructure, build once deploy anywhere

## Practical Examples: Same Problem, Different Tools

### Example 1: Deploy a Web App

**AWS Approach:**

1. Launch EC2 instance
2. Install nginx
3. Deploy app
4. Configure load balancer
5. Set up auto-scaling group

**Kubernetes Approach:**

1. Create deployment (includes app)
2. Create service (includes load balancing)
3. Configure horizontal pod autoscaler

Same result, different abstraction level.

### Example 2: Update Your App

**AWS Approach:**

1. Create new AMI with updated app
2. Update launch configuration
3. Rolling update of instances
4. Terminate old instances

**Kubernetes Approach:**

1. Update deployment image tag
2. Kubernetes handles the rolling update

Same pattern (immutable infrastructure), different interface.

## What This Means For You

Understanding these patterns means:

1. **Cloud skills transfer to Kubernetes** - You already know the concepts
2. **Kubernetes skills transfer to cloud** - It's the same patterns
3. **The tool doesn't matter** - The patterns do
4. **Focus on concepts, not commands** - Commands change, patterns don't

## The Questions You Should Actually Ask

Instead of "Is Kubernetes complex?", ask:

1. **"Do I need application-level abstractions?"** - If you're happy managing VMs, maybe not
2. **"Is my team ready for declarative infrastructure?"** - It's a mindset shift
3. **"What's my actual portability requirement?"** - Be honest about vendor lock-in
4. **"Can I afford the operational overhead?"** - Kubernetes isn't free to run

## The Bigger DevOps Picture

Understanding Kubernetes is just one part of the DevOps journey. Here's an excellent DevOps roadmap from TechWorld with Nana:

<div class="flex justify-center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/9pZ2xmsSDdo?si=5BhXD3z5KNhZ9VBf" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

<div class="text-center">
<span class="text-xs">I am not affiliated with TechWorld with Nana, just really appreciate her educational content.</span>
</div>

And here's his excellent explanation of CI/CD, which is crucial when working with Kubernetes:

<div class="flex justify-center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/scEDHsr3APg?si=KT5xlYmZKhZx0VBf" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

<div class="text-center">
<span class="text-xs">I am not affiliated with Fireship.io, just really like his work.</span>
</div>

## Resources That Actually Help

### Video Learning Resources:

- **Fireship.io**: Concise, focused explanations of complex topics
- **The DevOps Toolkit by Viktor Farcic**: Deep dives into Kubernetes, GitOps, and cloud-native practices. His channel provides comprehensive tutorials and real-world implementations that complement Fireship's quick overviews perfectly.

### Understanding the Patterns:

- <a href="https://kubernetes.io/docs/reference/using-api/" target="_blank">Kubernetes API Overview</a> - See it's just REST
- <a href="https://12factor.net/" target="_blank">12 Factor Apps</a> - The patterns behind cloud native
- <a href="https://landing.google.com/sre/books/" target="_blank">Google SRE Book</a> - Where these patterns come from

### Seeing the Connections:

- <a href="https://roadmap.sh/devops" target="_blank">DevOps Roadmap</a> - See how it all connects
- <a href="https://github.com/kelseyhightower/kubernetes-the-hard-way" target="_blank">Kubernetes The Hard Way</a> - Understand what's really happening

### Practical Learning:

- Compare AWS and Kubernetes docs for the same concepts
- Build the same app on EC2 and Kubernetes
- Use kubectl with -v=8 to see the REST calls

## Final Thoughts

After 8 years with Kubernetes, the biggest insight isn't about Kubernetes at all. It's that **modern infrastructure is converging on the same patterns**. Whether you're using AWS, Kubernetes, or the next big thing, you're manipulating the same concepts through different interfaces.

Kubernetes isn't revolutionary because it's complex or simple. It's significant because it standardizes how we think about deploying applications. Once you see past the terminology to the patterns underneath, you realize you've been doing this all along - just with different names.

The real skill isn't learning Kubernetes. It's recognizing that you're always working with:

- Compute units (VMs, containers, functions)
- Storage (block, object, file)
- Networking (load balancing, service discovery, security)
- Identity and access (who can do what)
- Configuration (separate from code)

Master these patterns, and every new platform becomes just another interface to what you already know.

---

_Have different perspectives on these patterns? Want to discuss what other platforms don't tell you? Feel free to connect with me through the contact information on this site._
