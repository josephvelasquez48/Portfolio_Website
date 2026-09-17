// src/lib/projects.ts
export type ProjectImage = {
	src: string;
	alt?: string;
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
			'A self-hosted cloud/AI platform across a Raspberry Pi 5 and an M1 MacBook: Kubernetes, GitOps, local LLM inference on a GPU host, a chat assistant grounded in offline Wikipedia, and full-cycle SRE practice.',
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
		overview: `A production-style cloud/AI platform built across a Raspberry Pi 5 (K3s control-plane, DNS,
data tier) and an M1 MacBook (K3s worker, Ubuntu in a bridged VM), with a GPU desktop on the LAN serving
local LLM inference from outside the cluster. Taken through an 18-step roadmap end to end: Linux
administration, Docker to Kubernetes migration, FastAPI + Postgres/pgvector + Redis, RAG over a local
Ollama LLM, Prometheus/Grafana observability, CI/CD with GitOps via Argo CD, Ansible and Terraform,
security hardening, load and failure testing. Every phase is documented with what was actually built, real
bugs found while building it, and the verification evidence for each — not just "it worked."

The engineering value here isn't the roadmap itself, it's what surfaced while running it for real: a
security gap where firewall rules never actually applied to Kubernetes traffic due to iptables chain
ordering; a retry/timeout gap that let a dead AI backend hang requests for minutes instead of failing
fast, found by deliberately breaking things and root-caused from the actual code, then fixed and
re-verified against the live, deployed fix; a DNS resolver loop between AdGuard and CoreDNS that was
failing one LAN query in five, traced from "some apps are slow on my phone" to a reverse-lookup cycle and
a Bonjour flood. The second node itself was eventually migrated off WSL2 onto a bridged Linux VM, which
retired an entire class of Windows-networking failures rather than working around another instance of one.

A small in-cluster dashboard (FastAPI, pinned to the Pi) shows live node, pod, Argo CD, alert, and backup
state, and can free the GPU on demand by evicting the resident Ollama model with a single API call.
A streaming chat assistant at chat.home can search a 127GB offline Wikipedia archive and cite what it
finds. Embedding millions of articles on one 8GB card was never realistic, so retrieval uses the full-text
index the archive already ships with, and query handling is scored against 40 labelled questions before
changes merge: obscure topics went from 8 of 15 to 15 of 15 finding the right article first.
Encrypted backups are collected to a separate machine and proven by a restore rehearsal that boots K3s
from the snapshot in a throwaway VM, with Prometheus alerting by email when a backup goes stale or its
agent fails.`,
		features: [
			'Two-node K3s cluster (Pi control-plane + M1 MacBook worker) with GitOps via Argo CD - selfHeal drift correction confirmed in ~11s',
			'FastAPI backend with rate limiting, retries, structured logging, and Prometheus metrics, backed by Postgres/pgvector + Redis',
			'RAG pipeline over a fully local Ollama LLM - no data leaves the network',
			'Streaming chat assistant with saved conversations and a model picker, grounded in a 127GB offline Wikipedia archive through its built-in full-text index',
			'CI/CD: GitHub Actions builds and pushes images to GHCR, then commits the new tag - Argo CD does the actual deploying',
			'Secrets encrypted at rest with SOPS + age, applied out-of-band from the GitOps sync path',
			'HTTPS on every service hostname through Traefik, using a local CA with a .home name constraint',
			'Encrypted off-host backups with a scripted restore rehearsal that boots K3s from the snapshot in a throwaway VM, plus Prometheus/Alertmanager rules that email on stale or failed backups',
			'Load tested with k6 (0% errors at ~476 req/s sustained) and failure tested with real fault injection (pod kills, dependency outages, a stopped AI backend) - findings cross-checked against Prometheus/Grafana, not just client-side output',
			'A cluster status dashboard showing live Pi metrics, nodes, pods, Argo CD apps, alerts, and backup health, with a one-call GPU release for the inference host'
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
			'Docker'
		],
		repoUrl: 'https://github.com/josephvelasquez48/homelab'
		// caseStudyUrl: '/projects/homelab/report' — re-add when the report is ready to go public
	}
];
