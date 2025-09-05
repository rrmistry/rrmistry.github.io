---
title: 'Kubernetes Must Know Tools'
date: 2025-01-15
description: 'Essential Kubernetes tools ranked by daily usage: kubectl, K9s, Helm, Lens, and more'
tags:
  [
    'cloud',
    'container-management',
    'devops-tools',
    'devops',
    'helm',
    'k9s',
    'kubectl',
    'kubernetes',
    'technology',
    'tutorial'
  ]
---

<script>
	import Mermaid from '$lib/components/Mermaid.svelte';
</script>

After 8 years of working with Kubernetes across different teams and environments, I've learned that having the right tools makes the difference between struggling with Kubernetes and thriving with it. This isn't just another "awesome-kubernetes" list - these are the tools I actually use, ranked by how often you'll need them.

## Essential Tools Ranked by Daily Usage

| Rank | Tool                                                     | Category          | How Often You'll Use It      | What It Does                          | Free/Paid |
| ---- | -------------------------------------------------------- | ----------------- | ---------------------------- | ------------------------------------- | --------- |
| 🥇   | [kubectl](https://kubernetes.io/docs/reference/kubectl/) | CLI               | Every single day             | Official K8s command-line tool        | Free      |
| 🥈   | [K9s](https://k9scli.io/)                                | TUI               | Daily                        | Terminal UI for cluster management    | Free      |
| 🥉   | [Helm](https://helm.sh/)                                 | Package Manager   | 3-4 times per week           | Package manager for K8s applications  | Free      |
| 4️⃣   | [Lens](https://k8slens.dev/)                             | IDE               | 2-3 times per week           | Visual IDE for K8s cluster management | Free/Pro  |
| 5️⃣   | [Kustomize](https://kustomize.io/)                       | Config Management | Weekly                       | Template-free config customization    | Free      |
| 6️⃣   | [Skaffold](https://skaffold.dev/)                        | Development       | When developing              | Local development and deployment      | Free      |
| 7️⃣   | [Flux](https://fluxcd.io/)                               | GitOps            | Once set up, runs constantly | Continuous delivery with GitOps       | Free      |
| 8️⃣   | [Argo CD](https://argoproj.github.io/cd/)                | GitOps            | Alternative to Flux          | Declarative GitOps CD for K8s         | Free      |
| 9️⃣   | [Istio](https://istio.io/)                               | Service Mesh      | Complex deployments only     | Service mesh for microservices        | Free      |
| 🔟   | [Timoni](https://timoni.sh/)                             | Package Manager   | Alternative to Helm          | CUE-based package manager             | Free      |

## The Daily Drivers (You'll Use These Every Day)

### 1. kubectl - Your Primary Interface

```bash
# The bread and butter commands you'll use constantly
kubectl get pods
kubectl describe pod <pod-name>
kubectl logs <pod-name> -f
kubectl exec -it <pod-name> -- /bin/bash
kubectl apply -f manifest.yaml
kubectl delete -f manifest.yaml
```

**Why it's #1:** You literally cannot work with Kubernetes without kubectl. It's the official CLI and your primary interface to any cluster.

**Pro tip:** Set up aliases to save your sanity:

```bash
alias k=kubectl
alias kg='kubectl get'
alias kd='kubectl describe'
alias kl='kubectl logs'
```

### 2. K9s - Terminal UI That Actually Works

<Mermaid chart={`graph LR
    A[You] --> B[K9s]
    B --> C[Multiple Clusters]
    B --> D[Real-time Monitoring]
    B --> E[Resource Navigation]
    B --> F[Log Streaming]
    C --> G[Context Switching]
    D --> H[Pod Status]
    E --> I[Drill Down]
    F --> J[Multi-pod Logs]`} />

K9s transforms your terminal into a powerful Kubernetes dashboard. Here's what makes it indispensable:

<img src="https://k9scli.io/assets/screens/pods.png" alt="k9s preview" />

**Key Features:**

- Real-time cluster monitoring
- Navigate resources with vim-like keybindings
- Stream logs from multiple pods
- Execute into pods directly
- Resource usage metrics
- Context switching between clusters

**Daily use cases:**

- Check pod status across namespaces
- Quickly jump to logs when something breaks
- Monitor resource usage
- Debug networking issues

**Why it beats the alternatives:** Unlike Lens, it's terminal-based so it works in any SSH session. Unlike kubectl, it gives you a visual overview of your cluster state.

## The Heavy Lifters (Multiple Times Per Week)

### 3. Helm - The Package Manager Everyone Loves to Hate

<Mermaid chart={`graph LR
    A[Helm CLI] --> B[Chart Repository]
    A --> C[Kubernetes API]
    B --> D[Charts]
    D --> E[Templates]
    D --> F[Values]
    E --> G[Manifests]
    F --> G
    G --> C
    C --> H[Deployed Release]`} />

Despite its reputation for complexity, Helm is essential for managing applications at scale:

```bash
# Install applications with one command
helm install my-app bitnami/nginx

# Upgrade with custom values
helm upgrade my-app bitnami/nginx -f custom-values.yaml

# Template and inspect before deploying
helm template my-app bitnami/nginx --values custom-values.yaml
```

**Real-world example:** Installing monitoring stack:

```bash
# Add the Prometheus community Helm repo
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts

# Install Prometheus and Grafana with one command
helm install monitoring prometheus-community/kube-prometheus-stack
```

**Why it's essential:** Try installing Prometheus without Helm. You'll be managing 20+ YAML files with hundreds of configuration options. Helm reduces this to a single command with customizable values.

### 4. Lens - The IDE When You Need Visual Clarity

<Mermaid chart={`graph TD
    A[Lens IDE] --> B[Multi-cluster View]
    A --> C[Resource Editor]
    A --> D[Built-in Terminal]
    A --> E[Metrics Dashboard]
    B --> F[Switch Contexts]
    C --> G[YAML Editing]
    D --> H[kubectl Access]
    E --> I[Pod/Node Metrics]`} />

<img src="https://cdn.sanity.io/images/67awagrd/production/27d8ffc2d91f38cc5c5b4aa3aa8908ee15621faf-1588x802.png" alt="Lens Kubernetes IDE interface" />

Lens shines when you need to:

- Visualize complex deployments
- Edit YAML files with validation
- Compare resources across clusters
- Onboard new team members (great GUI for learning)

**When to use Lens over K9s:**

- Visual learners on your team
- Complex debugging requiring multiple views
- Editing large YAML manifests
- Presenting cluster state to stakeholders

## The Specialists (When You Need Them, You REALLY Need Them)

### 5. Kustomize - Configuration Without Templates

Built into kubectl, Kustomize lets you customize configurations without templating:

```yaml
# kustomization.yaml
resources:
  - deployment.yaml
  - service.yaml

patchesStrategicMerge:
  - replica-count.yaml

images:
  - name: nginx
    newTag: 1.21.0
```

**Apply with:**

```bash
kubectl apply -k .
```

**Why choose Kustomize over Helm:**

- No templating language to learn
- Built into kubectl
- Easier to understand for simple use cases
- Better for environment-specific configurations

### 6. Skaffold - Development Loop Automation

Skaffold automates the development workflow:

```yaml
# skaffold.yaml
apiVersion: skaffold/v4beta1
kind: Config
build:
  artifacts:
    - image: my-app
deploy:
  kubectl:
    manifests:
      - k8s/deployment.yaml
```

**Development workflow:**

```bash
# Continuous development
skaffold dev

# Build and deploy once
skaffold run

# Debug mode
skaffold debug
```

**Game changer for development:** Instead of manually building, tagging, pushing, and deploying every code change, Skaffold watches your files and automates the entire pipeline.

## The Production Operators (Set Once, Run Forever)

### 7. Flux vs 8. Argo CD - GitOps Delivery

Both tools implement GitOps - the practice of using Git as the source of truth for your cluster state.

<img src="https://argo-cd.readthedocs.io/en/stable/assets/argocd-ui.gif" alt="Argo CD UI interface" />

**Flux approach:**

```yaml
# GitRepository
apiVersion: source.toolkit.fluxcd.io/v1beta1
kind: GitRepository
metadata:
  name: my-app
spec:
  url: https://github.com/my-org/my-app
  interval: 1m
```

**Argo CD approach:**

```yaml
# Application
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
spec:
  source:
    repoURL: https://github.com/my-org/my-app
    path: k8s/
```

**Choose Flux if:** You prefer declarative configuration and don't need a UI
**Choose Argo CD if:** You want a rich web UI and visual application management

### 9. Istio - When Microservices Get Complex

<Mermaid chart={`graph LR
    A[Ingress Gateway] --> B[Service A]
    A --> C[Service B]
    B --> D[Service C]
    C --> D
    E[Istio Proxy] --> B
    F[Istio Proxy] --> C
    G[Istio Proxy] --> D
    H[Control Plane] --> E
    H --> F
    H --> G`} />

Istio provides:

- **Traffic Management:** Load balancing, routing, retries
- **Security:** mTLS, authentication, authorization
- **Observability:** Metrics, logs, traces

**Only use Istio when you have:**

- Multiple microservices that need to communicate
- Complex routing requirements
- Strict security requirements
- Need for advanced observability

**Reality check:** Istio adds significant complexity. Start simple and add it when you actually need service mesh capabilities.

### 10. Timoni - The Helm Alternative

Timoni uses CUE (Configure Unify Execute) language for type-safe package management. Instead of Go templates like Helm, Timoni leverages CUE's data validation and schema capabilities.

**Getting started with Timoni:**

```bash
# Install Timoni
brew install stefanprodan/tap/timoni

# Deploy an app from a registry
timoni apply my-app oci://ghcr.io/stefanprodan/modules/nginx

# Deploy with custom values
timoni apply my-app oci://ghcr.io/stefanprodan/modules/nginx \
  --values ./my-values.cue

# List deployed instances
timoni list

# Generate Kubernetes manifests without applying
timoni build my-app oci://ghcr.io/stefanprodan/modules/nginx
```

**Key advantages over Helm:**

- **Type Safety**: CUE language provides compile-time validation
- **Schema Validation**: Catch configuration errors before deployment
- **Better Composition**: CUE's unification model allows powerful data merging
- **No Template Hell**: Avoid complex Go template logic

**Why consider Timoni:**

- Type safety (catch errors before deployment)
- Better validation than Helm templates
- More expressive than Kustomize
- Growing ecosystem
- Native OCI registry support

## Tool Combinations That Work

### For Small Teams (1-3 developers)

- **kubectl** + **K9s** + **Helm** + **Skaffold**
- Skip the service mesh, keep it simple

### For Growing Teams (4-10 developers)

- Add **Lens** for junior developers
- **Kustomize** for environment management
- **Flux** or **Argo CD** for production deployments

### For Enterprise (10+ developers)

- Full stack: All tools as needed
- **Istio** for complex microservices
- **Timoni** for type-safe configurations

## The Learning Path

**Week 1-2: Master the basics**

1. kubectl fundamentals
2. K9s for daily operations

**Week 3-4: Add package management** 3. Helm for installing applications 4. Basic Helm chart creation

**Month 2: Development workflow** 5. Skaffold for development 6. Kustomize for configuration

**Month 3+: Production concerns** 7. GitOps with Flux or Argo CD 8. Lens for team collaboration 9. Istio only if you need service mesh 10. Timoni as Helm alternative

## Common Tool Mistakes

### 1. Starting with Istio Too Early

**Mistake:** Adding service mesh before you have actual microservices
**Reality:** You probably don't need Istio until you have 5+ services with complex communication patterns

### 2. Helm vs Kustomize Religious Wars

**Mistake:** Thinking you must choose one
**Reality:** Use Helm for third-party applications, Kustomize for your own configurations

### 3. Tool Sprawl

**Mistake:** Installing every tool because it's "best practice"
**Reality:** Each tool adds cognitive overhead. Start minimal and add tools when you feel the pain they solve

### 4. Ignoring the Learning Curve

**Mistake:** Expecting instant productivity
**Reality:** Budget 2-4 weeks to become proficient with the core tools

## Tools to Watch (Emerging)

- **[Crossplane](https://crossplane.io/)**: Infrastructure as Code with K8s APIs
- **[Pulumi](https://www.pulumi.com/)**: Modern Infrastructure as Code
- **[Telepresence](https://www.telepresence.io/)**: Local development against remote clusters
- **[Linkerd](https://linkerd.io/)**: Simpler service mesh alternative to Istio

## The Reality Check

After 8 years with Kubernetes, here's what I've learned about tools:

**The 80/20 Rule:** 80% of your work will use kubectl, K9s, and Helm. The other 20% requires specialized tools.

**Tool Fatigue is Real:** Every tool you add increases cognitive load. Be selective.

**Start Simple:** You can run production Kubernetes with just kubectl and Helm. Add complexity only when you feel the pain it solves.

**Team Context Matters:** What works for Netflix won't work for a 3-person startup. Choose tools that match your team size and complexity.

## Quick Reference Commands

### kubectl Essentials

```bash
# Get everything in a namespace
kubectl get all -n my-namespace

# Watch pods in real-time
kubectl get pods -w

# Port forward for local testing
kubectl port-forward svc/my-service 8080:80

# Get cluster info
kubectl cluster-info

# Switch contexts
kubectl config use-context my-cluster
```

### K9s Key Bindings

```
:pods     # View pods
:svc      # View services
:deploy   # View deployments
:ns       # View namespaces
l         # View logs
d         # Describe resource
e         # Edit resource
```

### Helm Quick Commands

```bash
# Search for charts
helm search repo nginx

# Show chart values
helm show values bitnami/nginx

# List installed releases
helm list

# Rollback release
helm rollback my-release 1
```

## Final Thoughts

The Kubernetes ecosystem has an overwhelming number of tools, but you don't need to learn them all at once. Start with the daily drivers (kubectl, K9s, Helm), add tools as you feel their absence, and remember that the best tool is the one your team actually uses consistently.

The goal isn't to use every tool - it's to be productive with Kubernetes. Sometimes that means kubectl and vim. Sometimes it means a full GitOps pipeline with service mesh. Choose tools that solve real problems you're experiencing, not problems you think you might have.

**Most importantly:** Master the fundamentals before adding complexity. A team that's great with kubectl, K9s, and Helm will outperform a team that's mediocre with 15 different tools.

---

_Want to discuss tool choices or share your Kubernetes tool stack? Feel free to connect with me through the contact information on this site._
