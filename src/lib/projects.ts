// src/lib/projects.ts
export type ProjectImage = {
	src: string;
	alt?: string;
};

export type ProjectStat = {
	value: string;
	label: string;
};

export type FeatureGroup = {
	title: string;
	items: string[];
};

export type ProjectHighlight = {
	title: string;
	detail: string;
};

export type Project = {
	id: string;
	title: string;
	description: string; // Short description (used in cards)
	imageUrl: string; // Cover image (used in cards)
	imagePosition?: string; // CSS object-position for the cover crop (default: 30% 30%)
	images: ProjectImage[]; // Gallery images (used on project page)
	overview?: string; // Detailed overview / story
	features?: string[]; // Current features
	roadmap?: string[]; // Planned features / roadmap
	notes?: string[]; // Development notes / progression plan
	tech?: string[]; // Tech stack tags
	repoUrl?: string; // GitHub repo link
	liveUrl?: string; // Live demo link
	caseStudyUrl?: string; // Deeper in-house write-up (engineering report, case study, etc.)
};

export const projects: Project[] = [
	{
		id: 'project1',
		title: 'ParkingPulse',
		description: 'AI-powered parking lot security and vehicle tracking system.',
		imageUrl: '/parkingpulse/pp1.png',
		images: [
			{ src: '/parkingpulse/admin-home.png', alt: 'Admin desktop app home screen' },
			{
				src: '/parkingpulse/multi-camera-feed.jpg',
				alt: 'Composite feed from 9 parking lot cameras'
			},
			{ src: '/parkingpulse/pp2.png', alt: 'Vehicle ReID system' },
			{ src: '/parkingpulse/logged-vehicles.png', alt: 'Logged vehicle history' },
			{ src: '/parkingpulse/settings.png', alt: 'Admin settings — ReID threshold and log limits' },
			{ src: '/parkingpulse/inference-log.png', alt: 'YOLOv8 inference and ReID matching logs' },
			{ src: '/parkingpulse/firestore-console.png', alt: 'Firebase Firestore vehicle data' },
			{ src: '/parkingpulse/vehicle-log-email.png', alt: 'Automated vehicle log email summary' }
		],
		overview: `ParkingPulse is a real-time AI vehicle tracking platform built with Python, OpenCV, and YOLOv8
for intelligent object detection and analytics. It ingests live camera feeds, tracks vehicles across
multiple cameras, and surfaces the results through an admin dashboard backed by Firebase.`,
		features: [
			'Real-time vehicle detection and tracking via YOLOv8 and OpenCV',
			'RESTful APIs for real-time data ingestion, processing, and retrieval',
			'Firebase-backed authentication and cloud data storage',
			'Latency reductions through frame skipping and model tuning',
			'Admin dashboard with history and notifications'
		],
		roadmap: [
			'Mobile app for remote monitoring',
			'Multi-zone camera support with dynamic switching',
			'Enhanced ReID accuracy with additional embeddings',
			'Integration with payment and reservation systems',
			'Automated incident alerts'
		],
		notes: [
			'Optimized ReID performance for slower systems',
			'Implemented dynamic camera zone selection',
			'Preparing for standalone executable deployment'
		],
		tech: ['Python', 'OpenCV', 'YOLOv8', 'Firebase', 'REST APIs'],
		repoUrl: 'https://github.com/loadingError117/ParkingPulse'
	},
	{
		id: 'project4',
		title: 'Nom Square',
		description:
			'A restaurant menu and ordering system with a customer ordering flow and admin back office.',
		imageUrl: '/nomsquare/item-detail.png',
		images: [
			{ src: '/nomsquare/cart.png', alt: 'Cart with subtotal, tax, and total' },
			{ src: '/nomsquare/menu-admin.png', alt: 'Admin menu item management' },
			{ src: '/nomsquare/employee-list.png', alt: 'Employee list with role-based accounts' }
		],
		overview: `Nom Square is a restaurant ordering system covering both sides of the experience: a
customer-facing menu with itemized add-ons and a running cart, and an admin back office for managing
menu items and employee accounts. Menu data is stored in Firebase Firestore.`,
		features: [
			'Customer menu browsing with item detail modals and add-ons',
			'Cart with live subtotal, tax, and total calculation',
			'Admin menu editor for creating, editing, and deleting items',
			'Role-based employee account management',
			'Firebase Firestore-backed data storage'
		],
		roadmap: [
			'Online payment integration',
			'Order history and receipts for customers',
			'Real-time order status for kitchen staff',
			'Analytics dashboard for sales and popular items'
		],
		tech: ['JavaScript', 'Vite', 'Firebase Firestore'],
		repoUrl: 'https://github.com/colormak3r/nom-square'
	},
	{
		id: 'project5',
		title: 'RAG Office Assistant',
		description: 'A retrieval-augmented chatbot that answers patient FAQs using a fully local LLM.',
		imageUrl: '/ragchat/chat-demo.png',
		images: [{ src: '/ragchat/chat-demo.png', alt: 'Chat UI answering an office hours question' }],
		overview: `A retrieval-augmented generation (RAG) chatbot built for a medical office FAQ use case.
Instead of calling a third-party AI API, it runs entirely on a local LLM through Ollama, so patient
questions and office data never leave the machine. A FAISS vector index over the office knowledge
base grounds every answer in real office info rather than letting the model improvise.`,
		features: [
			'FAISS vector search over office FAQ documents using sentence-transformer embeddings',
			'Local LLM inference via Ollama — no patient data sent to an external API',
			'FastAPI backend streaming responses to the browser over Server-Sent Events',
			'Automatic index building on first run from any .txt file dropped into the knowledge base',
			'Fully Dockerized with docker-compose for the API and Ollama services'
		],
		roadmap: [
			'Swap the flat FAISS index for chunked, overlapping passages on longer documents',
			'Add conversation memory for multi-turn context',
			'Source citations in responses',
			'Web-based admin UI for managing the knowledge base'
		],
		tech: ['Python', 'FastAPI', 'Ollama', 'FAISS', 'sentence-transformers', 'Docker'],
		repoUrl: 'https://github.com/josephvelasquez48/rag-office-assistant'
	},
	{
		id: 'homelab',
		title: 'Homelab Cloud + AI Platform',
		description:
			'A self-hosted cloud/AI platform across a Raspberry Pi 5 and an M1 MacBook: Kubernetes, GitOps, local LLM inference, a passkey-secured webcam, an iPhone calling bridge, and a live touchscreen ops display.',
		imageUrl: '/homelab/dashboard.png',
		// The dashboard's heading and metrics cards sit top-left; anchoring there keeps
		// them visible on narrow screens, where the cover crops horizontally instead.
		imagePosition: 'left top',
		images: [
			{
				src: '/homelab/dashboard.png',
				alt: 'Homelab dashboard — live Pi metrics, alert state, backup health, pods, Argo CD apps, and node readiness'
			},
			{
				src: '/homelab/architecture.png',
				alt: 'Homelab architecture: the Raspberry Pi runs host DNS and backups plus the K3s control plane, ingress, apps, data, monitoring and offline Wikipedia; a MacBook VM runs the second API replica and the nightly restic backup; a Windows GPU desktop serves Ollama; GitHub Actions and Argo CD deliver it'
			},
			{
				src: '/homelab/argocd-applications.png',
				alt: 'Argo CD app-of-apps — seven applications, all Synced and Healthy'
			},
			{
				src: '/homelab/prometheus-targets.png',
				alt: 'Prometheus target health — kubernetes-pods, node-pi, and prometheus scrape pools all up'
			},
			{
				src: '/homelab/prometheus-alert-rules.png',
				alt: 'Prometheus alert rules for backup staleness, missing metrics, and agent failure'
			},
			{
				src: '/homelab/adguard-dashboard.png',
				alt: 'AdGuard Home — 24-hour DNS query and filtering statistics'
			}
		],
		overview: `A production-style cloud/AI platform on a Raspberry Pi 5 (K3s control plane, DNS, data tier) and an
M1 MacBook (K3s worker in a bridged Ubuntu VM), with a GPU desktop on the LAN serving local LLM inference.

It started as an 18-step roadmap - Linux, Kubernetes, FastAPI, RAG, observability, GitOps, security, load and
failure testing - and now runs apps used every day. Every phase is documented with what was built, the real
bugs found along the way, and the evidence that each fix worked.`,
		stats: [
			{ value: '21.6% → 0%', label: 'LAN DNS failures after fixing a resolver loop' },
			{ value: '~470 req/s', label: 'sustained under k6 load with 0% errors' },
			{ value: '180s → 18s', label: 'worst case when the AI backend is down' },
			{ value: '16 → 32', label: 'of 40 test questions answered by the top result' }
		],
		featureGroups: [
			{
				title: 'Platform',
				items: [
					'Two-node K3s cluster with GitOps via Argo CD; drift self-heals in ~11s',
					'GitHub Actions builds images to GHCR and commits the tag; Argo CD deploys it',
					'A required PR check on main, enforced by a Terraform-managed ruleset',
					'SOPS + age encrypted secrets; HTTPS everywhere via Traefik and a local CA',
					'Ansible for host configuration'
				]
			},
			{
				title: 'Backend & AI',
				items: [
					'FastAPI with rate limiting, retries, structured logs and Prometheus metrics',
					'Postgres/pgvector + Redis data tier',
					'RAG over a fully local Ollama LLM; no data leaves the network',
					'Streaming chat assistant that searches and cites a 127 GB offline Wikipedia'
				]
			},
			{
				title: 'Apps',
				items: [
					'Mustard Cam: WebRTC webcam with invite-only passkey (WebAuthn) accounts, shared via Tailscale Funnel',
					'iPhone calling bridge: the Pi as a Bluetooth hands-free unit, answered from the PC or touchscreen',
					'Photo and file transfer between the iPhone and PC, reachable over Tailscale',
					'Live touchscreen ops display: a service map and a pod "aquarium" driven by real metrics',
					'Self-hosted RustDesk server for LAN-only remote desktop'
				]
			},
			{
				title: 'Reliability',
				items: [
					'Encrypted off-host backups with a restore rehearsal that boots K3s in a throwaway VM',
					'Prometheus/Alertmanager email on stale or failed backups',
					'k6 load tests and fault injection (pod kills, dependency outages, a stopped AI backend)',
					'Findings cross-checked in Prometheus/Grafana, not just client-side output'
				]
			}
		],
		highlights: [
			{
				title: 'A firewall that never applied',
				detail:
					'Host firewall rules never touched Kubernetes traffic because of iptables chain ordering. Found with real blocked-vs-allowed traffic tests, then fixed and re-tested.'
			},
			{
				title: 'A dead AI backend hung every request',
				detail:
					'Stopping Ollama on purpose left requests hanging for 180s+. Root-caused to the retry and timeout settings; it now fails cleanly in ~18s.'
			},
			{
				title: 'A DNS loop failing 1 in 5 queries',
				detail:
					'"Some apps are slow on my phone" traced to a reverse-lookup cycle between AdGuard and CoreDNS. Authoritative private reverse zones took failures from 21.6% to 0%.'
			},
			{
				title: 'Pod traffic stuck in the router',
				detail:
					"After each move of the worker, the WireGuard tunnel's one long-lived UDP flow got stuck in the router's flow cache. Flannel now routes pod traffic directly (host-gw)."
			},
			{
				title: 'A dashboard reading 200x too high',
				detail:
					"AdGuard's rolling 24-hour totals looked like counter resets, so the DNS rate spiked to ~14,000/min every hour (really ~65). The exporter now keeps true counters."
			},
			{
				title: 'Searching Wikipedia on one 8 GB GPU',
				detail:
					"Embedding millions of articles wasn't realistic, so retrieval uses the archive's own full-text index, scored against 40 labelled questions: obscure topics went from 8/15 to 15/15."
			}
		],
		roadmap: [
			'A native Windows exporter for the GPU host, which stopped being a Prometheus target when it left the cluster',
			'Unattended boot for the worker node - FileVault holds the VM (and the backup agent) until someone unlocks the Mac',
			'A reviewed retention policy so backup snapshots are pruned instead of accumulating',
			'Certificate renewal automation - the current server certificate is renewed by hand, with no expiry alert'
		],
		tech: [
			'Kubernetes (K3s)',
			'Argo CD',
			'FastAPI',
			'PostgreSQL',
			'pgvector',
			'Redis',
			'Ollama',
			'Kiwix',
			'Prometheus',
			'Grafana',
			'Alertmanager',
			'Traefik',
			'GitHub Actions',
			'Ansible',
			'Terraform',
			'SOPS',
			'Restic',
			'k6',
			'Docker',
			'WebRTC',
			'WebAuthn',
			'Tailscale',
			'PipeWire'
		],
		repoUrl: 'https://github.com/josephvelasquez48/homelab'
		// caseStudyUrl: '/projects/homelab/report' — re-add when the report is ready to go public
	}
];
