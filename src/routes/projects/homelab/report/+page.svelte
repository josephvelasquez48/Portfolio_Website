<script lang="ts">
  const pillars = [
    {
      name: 'GitOps Delivery',
      accent: 'emerald',
      items: [
        'GitHub Actions — test, build, push to GHCR, commit the tag',
        'Argo CD — app-of-apps, poll + real-time drift detection',
        'selfHeal: true — reverts imperative drift automatically',
        "Ansible — six ordered roles provisioning the Pi's OS layer",
        'Terraform — GitHub repo settings, imported not created'
      ]
    },
    {
      name: 'Application, Data & AI',
      accent: 'sky',
      items: [
        'FastAPI — auth, rate limiting, retries, structured logging',
        'PostgreSQL + pgvector — HNSW cosine similarity search',
        'Redis — rate-limit state and the async job queue',
        'Ollama on an RTX 3070 Ti — local, no data leaves the network',
        'Restic — encrypted off-host backups, restore-rehearsed'
      ]
    },
    {
      name: 'DNS, Network & Observability',
      accent: 'amber',
      items: [
        'CoreDNS — LAN-facing, config-as-code, *.home zone',
        'AdGuard Home — filtering, loopback-only, behind CoreDNS',
        'Traefik — HTTPS ingress, LAN-only NetworkPolicy',
        'adguard-exporter — in-cluster, Prometheus-only ingress',
        'Prometheus + Alertmanager + Grafana — all as code'
      ]
    }
  ];

  const accentClasses: Record<string, string> = {
    emerald: 'border-t-emerald-400/70',
    sky: 'border-t-sky-400/70',
    amber: 'border-t-amber-400/70'
  };
  const dotClasses: Record<string, string> = {
    emerald: 'bg-emerald-400',
    sky: 'bg-sky-400',
    amber: 'bg-amber-400'
  };

  type Incident = {
    title: string;
    tag: string;
    problem: string;
    rootCause: string;
    fix: string;
    verified: string;
  };

  const incidents: Incident[] = [
    {
      title: 'Cross-node pod traffic over WSL2',
      tag: 'Networking',
      problem:
        "The desktop's K3s worker (joining over WSL2 mirrored networking) couldn't reach any ClusterIP service, including CoreDNS itself — pods crash-looped with \"Temporary failure in name resolution.\" This one was eventually solved structurally rather than repaired; see the migration below.",
      rootCause:
        "Three distinct failures in sequence: flannel's VXLAN encapsulation was silently dropped by the Windows network stack; the follow-up host-gw backend required Windows to forward packets for a subnet it doesn't own, which its strong-host model refuses by default; the WireGuard replacement then needed firewall rules in the correct store (classic vs. Hyper-V) and a throwaway iperf bind to get WSL2 to register the kernel socket at all.",
      fix: 'Switched flannel to wireguard-native, added the matching classic-firewall rule, and deleted stale host-gw-era routes that were silently winning via longest-prefix-match over the new ones.',
      verified:
        'Cross-node ping went from 100% loss to 0%; a subsequent Argo CD sync scheduled a real replica on each node and both came up healthy — actual Kubernetes workloads, not just ICMP.'
    },
    {
      title: "ufw's LAN-only rules were silent no-ops",
      tag: 'Security',
      problem:
        "Traefik — and later, an unrelated Prometheus exporter — was reachable from parts of the network ufw's rules implied it wasn't.",
      rootCause:
        "K3s's own kube-router/kube-proxy iptables chains process before ufw's INPUT chain, so a ufw rule scoping traffic to the LAN was never actually consulted for K3s-managed or same-node pod traffic — the protection it implied didn't exist.",
      fix: 'Moved enforcement to the layer that actually sees this traffic: a Kubernetes NetworkPolicy, not a host firewall rule.',
      verified:
        'Confirmed both the hole and the fix directly from an in-cluster pod, not by re-reading the ufw rule and assuming it applied.'
    },
    {
      title: 'Two CI pipelines racing on the same git push',
      tag: 'CI/CD',
      problem:
        'A deploy pipeline\'s own "commit the new image tag" step failed intermittently when a second pipeline pushed to main in the same window.',
      rootCause:
        "Both pipelines' deploy jobs ran git push against the same branch with no coordination — a plain race, reproduced by bumping a shared dependency in both workflow files at once.",
      fix: 'A shared concurrency group serializes the two deploy jobs; the loser rebases (git pull --rebase) and pushes after, instead of failing.',
      verified:
        'Re-triggered both pipelines simultaneously; the second waited its turn and completed cleanly instead of erroring.'
    },
    {
      title: 'A single timeout covering two different failure speeds',
      tag: 'Resilience',
      problem:
        'Deliberately stopping Ollama during chaos testing caused /v1/chat requests to hang for 180+ seconds instead of failing fast.',
      rootCause:
        'A single 120-second timeout covered both the TCP connect and the full response read, multiplied by three automatic retries — exactly wrong for a dependency that was actually down, where the connect itself should fail in milliseconds.',
      fix: 'Split the client timeout into connect=5s / read=120s, so a genuinely dead dependency fails fast while a slow-but-alive one still gets its full generation budget.',
      verified:
        'Re-ran the same outage scenario live: failure time dropped from 180s+ to 18s, measured, not estimated.'
    },
    {
      title: 'Restricting a metrics exporter to Prometheus only',
      tag: 'Networking',
      problem:
        "A Prometheus exporter for AdGuard Home ran as a Docker Compose container on the Pi — reachable by any pod scheduled on that same node, not just Prometheus. A Compose container isn't a Kubernetes pod, so there was no ingress boundary a NetworkPolicy could even attach to.",
      rootCause:
        "Same-node pod traffic to the Pi's own IP bypasses ufw's INPUT chain the same way the Traefik incident above did — but this time the destination wasn't a pod at all, closing off the normal fix entirely.",
      fix: 'Moved the exporter into the cluster as a real pod (deliberately not hostNetwork, which would have reintroduced the same blind spot) and attached an ingress-only NetworkPolicy scoped to the Prometheus pod.',
      verified:
        "Prometheus's scrape stayed up throughout. A pod forced onto the same node got an immediate connection refused; a cross-node pod timed out instead — two different symptoms of the same policy. Then exec'd into the real, already-running Grafana pod and got the identical refusal, confirming it wasn't a quirk of the synthetic test."
    },
    {
      title: 'One in five LAN DNS queries was failing',
      tag: 'DNS',
      problem:
        'Several apps on a phone — Maps, Mail, Messages, a banking app — worked on cellular and failed on Wi-Fi. Over a four-hour window CoreDNS returned SERVFAIL for 5,193 of 24,064 legitimate queries, 21.6%. That phone alone sat at 46%.',
      rootCause:
        "Two independent load sources, neither of them a client. AdGuard resolves every client IP back to a name and, with no private reverse-resolver configured, fell back to the system resolver — which is CoreDNS, which forwards to AdGuard, so every private reverse lookup looped until it timed out; one address produced 2,430 SERVFAILs in ten minutes. Separately, avahi's wide-area mode emitted 123,341 unicast Bonjour lookups in four hours, roughly 90% of all traffic through the resolver, every one failing and every one forwarded to public DNS. A 30-second cache ceiling in the Corefile multiplied both by re-resolving everything about thirty times more often than its real TTL required.",
      fix: 'CoreDNS now answers the RFC1918 reverse zones itself with NXDOMAIN and never forwards them, which breaks the loop at the layer completing the circuit rather than depending on AdGuard staying correctly configured. Wide-area Bonjour off. Cache ceiling raised to an hour, where it acts as a ceiling and not a floor.',
      verified:
        'SERVFAIL rate went from 21.6% to 0%, Bonjour junk from about 13 per second to none, and the queries the Pi itself generated from roughly 1,400 per ten minutes to 2 per 45 seconds. The apple.com TTL served to clients went from a capped 30 seconds to the real 567.'
    },
    {
      title: 'A stock default that is only wrong at scale',
      tag: 'DNS',
      problem:
        'Pointing the whole house at the Pi through DHCP turned a resolver that had worked for months into a LAN-wide DNS outage. Dropped queries surfaced as client timeouts rather than server errors, so nothing in the symptoms named the cause.',
      rootCause:
        "AdGuard Home's stock rate limit is 20 queries per second per client IP, and CoreDNS forwards every LAN query to it from 127.0.0.1 — so the entire network shared one bucket. Harmless while two devices were pointed at the Pi by hand, instant the moment every phone and TV was too. Found by reading the forwarder's own config after the symptom stopped making sense.",
      fix: 'Set the limit to 0. It exists to protect a LAN-facing resolver from an abusive client, and this AdGuard is bound to loopback and reachable only by CoreDNS — it was rate limiting its own forwarder.',
      verified:
        'A burst of 120 concurrent unique queries through CoreDNS into AdGuard, zero dropped. Under the old limit roughly a hundred of those would have vanished silently. The same root cause also costs per-client visibility in AdGuard, which is recorded as an accepted trade rather than left as a surprise.'
    },
    {
      title: 'Retiring a failure class instead of fixing another instance',
      tag: 'Architecture',
      problem:
        'Nearly every hard networking failure in this project traced back to one root: the worker node ran inside WSL2, so it was never really a host on the network. Each fix held, and a new instance of the same class kept arriving — dropped overlay traffic, a refused routing model, a kernel socket that had to be re-registered on every boot, stale routes winning silently, a listener on the Windows side that pods on that same machine could not reach.',
      rootCause:
        'WSL2 offers NAT or mirrored networking and no genuine bridging, so the node\'s address, its listeners, and its overlay traffic were all mediated by the Windows host stack. Ollama had been moved inside WSL for exactly that reason, which made the constraint self-reinforcing.',
      fix: 'Replaced the node with a bridged Ubuntu VM on an M1 MacBook and took the Windows desktop out of the cluster entirely, leaving it a LAN GPU host. flannel returned to its default vxlan backend, and two Scheduled Task workarounds plus the amd64 half of every image build retired with it. The bridged VM still needed its node IP and flannel interface pinned explicitly, because a multipass VM keeps a NAT default route that otherwise wins — the same sentence as the WSL2 problem arriving by a different road.',
      verified:
        'The real test is a pod on the new node reaching a Service backed by pods on the Pi, which exercises the tunnel, CoreDNS, and Service routing at once: postgres ok, redis ok. Worth stating what it did not prove — draining the old node showed the cluster stayed healthy, not that the new node can carry work, because everything else was already pinned to the Pi.'
    }
  ];

  const stack = [
    {
      name: 'GitOps Delivery',
      accent: 'emerald',
      rows: [
        ['K3s', 'Pi control-plane + M1 MacBook worker'],
        ['Argo CD', 'App-of-apps, automated prune + selfHeal'],
        ['GitHub Actions', 'Test → build → GHCR → tag commit'],
        ['Ansible', 'Six roles, host-level Pi provisioning'],
        ['Terraform', 'GitHub repo settings as code']
      ]
    },
    {
      name: 'Application, Data & AI',
      accent: 'sky',
      rows: [
        ['FastAPI', 'Auth, rate limiting, retries, structured logs'],
        ['PostgreSQL + pgvector', 'HNSW cosine similarity search'],
        ['Redis', 'Rate-limit state, async job queue'],
        ['Ollama', 'RTX 3070 Ti, LAN host outside the cluster'],
        ['Restic', 'Encrypted backups, automated restore rehearsal']
      ]
    },
    {
      name: 'DNS, Network & Observability',
      accent: 'amber',
      rows: [
        ['CoreDNS + AdGuard Home', 'LAN DNS, layered filtering'],
        ['Traefik', 'HTTPS ingress, local CA, LAN-only policy'],
        ['adguard-exporter', 'Own code, Prometheus-only ingress'],
        ['Prometheus + Alertmanager', 'Rules and dashboards as code'],
        ['SOPS + age', 'Encrypted secrets, applied out-of-band']
      ]
    }
  ];

  const headingAccent: Record<string, string> = {
    emerald: 'text-emerald-400',
    sky: 'text-sky-400',
    amber: 'text-amber-400'
  };
</script>

<svelte:head>
  <title>Homelab Engineering Report — Joseph Velasquez</title>
  <meta
    name="description"
    content="Architecture, engineering incidents, and verification practices from a two-node K3s cluster spanning a Raspberry Pi and an M1 MacBook."
  />
  <!-- Private for now: not linked from the project page, and kept out of search
       indexing. Remove once this is ready to be public. -->
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="max-w-4xl mx-auto px-6 pt-8 pb-24 space-y-16 text-gray-300">
  <a
    href="/projects/homelab"
    class="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-emerald-400 transition-colors"
  >
    &larr; Back to Homelab Cloud + AI Platform
  </a>

  <!-- Header -->
  <div>
    <p class="text-emerald-400 text-sm font-medium tracking-wide uppercase mb-4">
      Engineering Report
    </p>
    <h1 class="text-4xl sm:text-5xl font-semibold text-gray-100 mb-5 tracking-tight">
      Homelab Cloud + AI Platform
    </h1>
    <p class="text-lg text-gray-400 max-w-2xl leading-relaxed mb-6">
      A production-style cloud and AI platform built across a Raspberry Pi 5, an M1 MacBook, and a
      GPU desktop: GitOps delivery through Argo CD, a FastAPI + RAG backend with local LLM
      inference, and a DNS / network / observability layer — each debugged and verified against
      real traffic, real firewalls, and real failure, not assumed working from a green checkmark.
    </p>
    <div class="flex flex-wrap gap-2">
      {#each ['2-node K3s cluster', 'Argo CD · selfHeal', 'RAG over pgvector', 'Local inference · RTX 3070 Ti', 'SOPS + age secrets', 'Restore-rehearsed backups', 'NetworkPolicy-enforced'] as chip}
        <span class="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-300 ring-1 ring-white/10">
          {chip}
        </span>
      {/each}
    </div>
  </div>

  <!-- Summary -->
  <section>
    <h2 class="text-2xl font-semibold text-gray-100 mb-5">Summary</h2>
    <div class="space-y-4 leading-relaxed">
      <p>
        I built a production-style cloud and AI platform across a Raspberry Pi and an M1 MacBook,
        with a GPU desktop on the LAN serving inference from outside the cluster. It runs a
        two-node K3s cluster with GitOps deployments through Argo CD and GitHub Actions. The main
        application is a FastAPI backend using PostgreSQL with pgvector, Redis, and local LLM
        inference through Ollama on an NVIDIA GPU. I built a RAG pipeline on top of that and added
        authentication, rate limiting, caching, and async processing.
      </p>
      <p>
        I also built out the operational side: CoreDNS and AdGuard Home for DNS and ad-blocking,
        Prometheus, Alertmanager and Grafana for observability and alerting, SOPS for secrets,
        encrypted off-host backups proven by a scripted restore rehearsal, HTTPS on every
        service through a local CA, Ansible for host provisioning, and Terraform for GitHub
        configuration. Then I load-tested and deliberately broke components to find real failure
        modes.
      </p>
      <p>
        The most valuable part ended up being debugging the interactions <em>between</em> those
        systems — Kubernetes networking across a worker that wasn't really on the network,
        firewall behavior, CI race conditions, timeout failures, network isolation, and a DNS
        resolver looping against its own forwarder — and then verifying every fix against actual
        traffic and metrics, not just a passing health check.
      </p>
    </div>
  </section>

  <!-- Three systems -->
  <section>
    <h2 class="text-2xl font-semibold text-gray-100 mb-5">Three Systems</h2>
    <p class="leading-relaxed mb-6">
      The platform is really three systems working together: a GitOps delivery system that builds
      and reconciles workloads, an application/data/AI system running the actual backend and
      local inference, and a DNS/network/observability system that provides service discovery,
      filtering, ingress, security boundaries, and monitoring.
    </p>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {#each pillars as pillar}
        <div
          class="rounded-xl bg-white/5 ring-1 ring-white/10 border-t-2 {accentClasses[
            pillar.accent
          ]} p-5"
        >
          <h3 class="text-sm font-semibold text-gray-100 mb-3">{pillar.name}</h3>
          <ul class="space-y-2 text-sm text-gray-400">
            {#each pillar.items as item}
              <li class="flex gap-2">
                <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full {dotClasses[pillar.accent]}"
                ></span>
                <span>{item}</span>
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>
  </section>

  <!-- Architecture -->
  <section>
    <h2 class="text-2xl font-semibold text-gray-100 mb-5">Architecture</h2>
    <p class="leading-relaxed mb-6">
      Three machines, two of them a single logical cluster. The Pi is the control-plane and hosts
      almost everything stateful and network-facing; an M1 MacBook runs the worker as a bridged
      Linux VM; the GPU desktop is an ordinary LAN host that serves inference over HTTP and is
      deliberately not a cluster member. That last split is the end state of the migration
      described below, not the original design.
    </p>
    <img
      src="/homelab/architecture.png"
      alt="Two-node K3s architecture: Pi control-plane, M1 worker, GPU inference host, and the GitOps flow"
      class="w-full rounded-xl ring-1 ring-white/10 shadow-lg"
    />
  </section>

  <!-- Engineering narratives -->
  <section>
    <h2 class="text-2xl font-semibold text-gray-100 mb-5">Engineering Narratives</h2>
    <p class="leading-relaxed mb-6">
      The individual technologies are not the interesting part of this project — wiring K3s,
      FastAPI, and Prometheus together is well-trodden ground. What actually took the work was the
      seams between them: the specific, reproducible ways two correctly-configured systems still
      failed to talk to each other, and proving each fix with real traffic rather than a clean
      <code class="rounded bg-white/10 px-1.5 py-0.5 text-sm">kubectl apply</code>.
    </p>
    <div class="space-y-5">
      {#each incidents as incident}
        <div class="rounded-xl bg-white/5 ring-1 ring-white/10 p-6">
          <div class="flex flex-wrap items-baseline justify-between gap-2 mb-4">
            <h3 class="text-base font-semibold text-gray-100">{incident.title}</h3>
            <span class="text-xs uppercase tracking-wide text-gray-500">{incident.tag}</span>
          </div>
          <dl class="space-y-3 text-sm">
            <div>
              <dt class="text-xs uppercase tracking-wide text-emerald-400 mb-1">Problem</dt>
              <dd class="text-gray-400 leading-relaxed">{incident.problem}</dd>
            </div>
            <div>
              <dt class="text-xs uppercase tracking-wide text-emerald-400 mb-1">Root cause</dt>
              <dd class="text-gray-400 leading-relaxed">{incident.rootCause}</dd>
            </div>
            <div>
              <dt class="text-xs uppercase tracking-wide text-emerald-400 mb-1">Fix</dt>
              <dd class="text-gray-400 leading-relaxed">{incident.fix}</dd>
            </div>
            <div>
              <dt class="text-xs uppercase tracking-wide text-emerald-400 mb-1">Verified</dt>
              <dd class="text-gray-300 leading-relaxed">{incident.verified}</dd>
            </div>
          </dl>
        </div>
      {/each}
    </div>
  </section>

  <!-- Verification practice -->
  <section>
    <h2 class="text-2xl font-semibold text-gray-100 mb-5">Verification Practice</h2>
    <p class="leading-relaxed mb-6">
      Every claim above is backed by a test that could have come back negative. The same
      discipline applied to load and failure testing generally: measure the real system under
      real conditions, then decide what it means.
    </p>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <div class="rounded-xl bg-white/5 ring-1 ring-white/10 p-5">
        <h3 class="text-sm font-semibold text-gray-100 mb-2">Load testing — k6</h3>
        <p class="text-3xl font-bold text-amber-400 mb-2">500m</p>
        <p class="text-sm text-gray-400 leading-relaxed">
          Each API replica sat at essentially its full 500m CPU limit through a 5.5-minute soak at
          476 requests per second, with zero errors and no memory growth — the concrete finding
          that says the next scaling step is a CPU limit or a third replica, not a database tune.
          Four scripts: smoke, ramp, rate-limit correctness, and the soak.
        </p>
      </div>
      <div class="rounded-xl bg-white/5 ring-1 ring-white/10 p-5">
        <h3 class="text-sm font-semibold text-gray-100 mb-2">Chaos testing</h3>
        <p class="text-3xl font-bold text-emerald-400 mb-2">5</p>
        <p class="text-sm text-gray-400 leading-relaxed">
          Failure scenarios injected deliberately — an API pod, Redis, Postgres, Ollama, and a
          forced GitOps drift — each measured through a continuous health-check loop rather than
          a single before/after snapshot. This is where the timeout bug above actually surfaced.
        </p>
      </div>
      <div class="rounded-xl bg-white/5 ring-1 ring-white/10 p-5">
        <h3 class="text-sm font-semibold text-gray-100 mb-2">Backup restore rehearsal</h3>
        <p class="text-3xl font-bold text-sky-400 mb-2">Restored</p>
        <p class="text-sm text-gray-400 leading-relaxed">
          A backup is a claim until something restores from it. A state database can pass an
          integrity check and still fail to boot a control plane, and no other check tells those
          apart. So the rehearsal restores the newest encrypted snapshot into a throwaway VM,
          boots K3s against it, checks the result, and destroys the VM either way.
        </p>
      </div>
    </div>
  </section>

  <!-- Stack reference -->
  <section>
    <h2 class="text-2xl font-semibold text-gray-100 mb-5">Stack Reference</h2>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {#each stack as column}
        <div class="rounded-xl bg-white/5 ring-1 ring-white/10 p-5">
          <h3 class="text-xs uppercase tracking-wide {headingAccent[column.accent]} mb-4">
            {column.name}
          </h3>
          <dl class="space-y-3">
            {#each column.rows as [term, desc]}
              <div>
                <dt class="text-sm font-medium text-gray-200">{term}</dt>
                <dd class="text-xs text-gray-500">{desc}</dd>
              </div>
            {/each}
          </dl>
        </div>
      {/each}
    </div>
  </section>

  <!-- Closing -->
  <p class="border-t border-white/10 pt-8 text-gray-400 leading-relaxed">
    <span class="text-gray-100 font-medium">The throughline isn't any one technology</span>
    — it's that nearly every fix above was surfaced and confirmed with real evidence before being
    called done: real traffic across a fixed network path, a real blocked connection instead of a
    policy that merely applied, real CPU numbers under real load. That habit is the actual
    deliverable.
  </p>

  <div class="flex flex-wrap gap-3">
    <a
      href="/projects/homelab"
      class="inline-flex items-center gap-2 rounded-lg bg-white/5 ring-1 ring-white/10 px-5 py-2.5 text-sm font-medium text-gray-200 hover:ring-emerald-400/40 hover:text-emerald-400 transition-colors"
    >
      &larr; Back to project
    </a>
    <a
      href="https://github.com/josephvelasquez48/homelab"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-gray-950 transition-transform hover:scale-105"
    >
      GitHub Repo
    </a>
  </div>
</div>
