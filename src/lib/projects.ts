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
			'A self-hosted cloud/AI platform across a Raspberry Pi 5 and a GPU desktop: Kubernetes, GitOps, local LLM inference, and full-cycle SRE practice.',
		imageUrl: '/homelab/dashboard.png',
		images: [
			{
				src: '/homelab/dashboard.png',
				alt: 'Homelab dashboard — gaming-mode cordon/drain log, plus live Pi and desktop node metrics cards'
			},
			{
				src: '/homelab/architecture.png',
				alt: 'Two-node K3s architecture: Pi control-plane, desktop worker, GitOps flow'
			}
		],
		overview: `A production-style cloud/AI platform built across a Raspberry Pi 5 (control-plane, DNS, data
tier) and a GPU desktop (K3s worker, local LLM inference), taken through an 18-step roadmap end to end:
Linux administration, Docker to Kubernetes migration, FastAPI + Postgres/pgvector + Redis, RAG over a
local Ollama LLM, Prometheus/Grafana observability, CI/CD with GitOps via Argo CD, Ansible and Terraform,
security hardening, load and failure testing. Every phase is documented with what was actually built, real
bugs found while building it, and the verification evidence for each — not just "it worked."

The engineering value here isn't the roadmap itself, it's what surfaced while running it for real: a
security gap where firewall rules never actually applied to Kubernetes traffic due to iptables chain
ordering; a GitOps credential-rotation mistake that cascaded into an unrelated Windows networking bug on
the WSL2-based worker node; a retry/timeout gap that let a dead AI backend hang requests for minutes
instead of failing fast, found by deliberately breaking things and root-caused from the actual code, then
fixed and re-verified against the live, deployed fix. A small in-cluster dashboard (FastAPI, pinned to the
Pi so it stays up even when the desktop is pulled out of the cluster) shows live status and can trigger a
"gaming mode" - cordon and drain the desktop node over SSH so a game gets the machine's full CPU/GPU, then
rejoin it to the cluster afterward.`,
		features: [
			'Two-node K3s cluster (Pi control-plane + WSL2 desktop worker) with GitOps via Argo CD - selfHeal drift correction confirmed in ~11s',
			'FastAPI backend with rate limiting, retries, structured logging, and Prometheus metrics, backed by Postgres/pgvector + Redis',
			'RAG pipeline over a fully local Ollama LLM - no data leaves the network',
			'CI/CD: GitHub Actions builds multi-arch images, pushes to GHCR, and commits the new tag - Argo CD does the actual deploying',
			'Secrets encrypted at rest with SOPS + age, applied out-of-band from the GitOps sync path',
			'Load tested with k6 (0% errors at ~480 req/s sustained) and failure tested with real fault injection (pod kills, dependency outages, a stopped AI backend) - findings cross-checked against Prometheus/Grafana, not just client-side output',
			'A cluster status dashboard with a live gaming-mode toggle that cordons/drains the desktop node over SSH and hands it back afterward'
		],
		roadmap: [
			'Streaming (SSE/websocket) output for the gaming-mode toggle instead of a blocking request',
			'A second Prometheus scrape target for the desktop’s own GPU/host metrics',
			'Multi-tenant API keys, to make the rate limiter’s per-key design actually load-testable at scale'
		],
		tech: [
			'Kubernetes (K3s)',
			'Argo CD',
			'FastAPI',
			'PostgreSQL',
			'pgvector',
			'Redis',
			'Ollama',
			'Prometheus',
			'Grafana',
			'GitHub Actions',
			'Ansible',
			'Terraform',
			'SOPS',
			'k6',
			'Docker'
		],
		repoUrl: 'https://github.com/josephvelasquez48/homelab'
		// caseStudyUrl: '/projects/homelab/report' — re-add when the report is ready to go public
	}
];
