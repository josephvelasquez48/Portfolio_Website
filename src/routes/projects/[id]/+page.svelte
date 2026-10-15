<script lang="ts">
  import type { Project } from '$lib/projects';

  export let data: {
    project: Project;
  };

  const { project } = data;

  // The overview is a template literal wrapped for the editor: blank lines
  // separate paragraphs, single newlines are just wrapping.
  const overviewParagraphs = (project.overview ?? '')
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean);

  let lightboxSrc: string | null = null;
  let lightboxAlt = '';

  function openLightbox(src: string, alt: string) {
    lightboxSrc = src;
    lightboxAlt = alt;
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxSrc = null;
    document.body.style.overflow = '';
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') closeLightbox();
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="max-w-5xl mx-auto px-6 pt-8 pb-24 space-y-12 text-gray-300">
  <a
    href="/"
    class="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-emerald-400 transition-colors"
  >
    &larr; Back to projects
  </a>

  <!-- Title + meta -->
  <div>
    <h1 class="text-4xl font-semibold text-gray-100 mb-4">{project.title}</h1>
    <p class="text-lg text-gray-400 max-w-2xl mb-5">{project.description}</p>

    {#if project.tech && project.tech.length > 0}
      <div class="flex flex-wrap gap-2 mb-5">
        {#each project.tech as tag}
          <span class="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-300 ring-1 ring-white/10">
            {tag}
          </span>
        {/each}
      </div>
    {/if}

    {#if project.repoUrl || project.liveUrl || project.caseStudyUrl}
      <div class="flex flex-wrap gap-3">
        {#if project.caseStudyUrl}
          <a
            href={project.caseStudyUrl}
            class="inline-flex items-center gap-2 rounded-lg bg-emerald-400/10 px-5 py-2.5 text-sm font-medium text-emerald-400 ring-1 ring-emerald-400/30 transition-colors hover:bg-emerald-400/20"
          >
            Read the Engineering Report &rarr;
          </a>
        {/if}
        {#if project.repoUrl}
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 rounded-lg bg-white/5 ring-1 ring-white/10 px-5 py-2.5 text-sm font-medium text-gray-200 hover:ring-emerald-400/40 hover:text-emerald-400 transition-colors"
          >
            GitHub Repo
          </a>
        {/if}
        {#if project.liveUrl}
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-gray-950 transition-transform hover:scale-105"
          >
            Live Demo
          </a>
        {/if}
      </div>
    {/if}
  </div>

  <!-- Cover Image -->
  <div>
    <button
      type="button"
      class="block w-full cursor-zoom-in"
      on:click={() => openLightbox(project.imageUrl, project.title)}
    >
      <img
        src={project.imageUrl}
        alt={project.title}
        class="w-full h-[420px] object-cover rounded-xl ring-1 ring-white/10 shadow-lg"
        style="object-position: {project.imagePosition ?? '30% 30%'}"
      />
    </button>
  </div>

  <!-- Overview -->
  {#if project.overview}
    <section>
      <h2 class="text-2xl font-semibold text-gray-100 mb-4">Overview</h2>
      <div class="max-w-3xl space-y-4 leading-relaxed">
        {#each overviewParagraphs as paragraph}
          <p>{paragraph}</p>
        {/each}
      </div>
    </section>
  {/if}

  <!-- Headline numbers -->
  {#if project.stats && project.stats.length > 0}
    <section class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {#each project.stats as stat}
        <div class="rounded-xl bg-white/[0.03] p-5 ring-1 ring-white/10">
          <div class="text-2xl font-semibold text-emerald-400">{stat.value}</div>
          <div class="mt-1 text-sm text-gray-400">{stat.label}</div>
        </div>
      {/each}
    </section>
  {/if}

  <!-- Features, in groups -->
  {#if project.featureGroups && project.featureGroups.length > 0}
    <section>
      <h2 class="text-2xl font-semibold text-gray-100 mb-6">What It Runs</h2>
      <div class="grid gap-4 md:grid-cols-2">
        {#each project.featureGroups as group}
          <div class="rounded-xl bg-white/[0.03] p-6 ring-1 ring-white/10">
            <h3 class="mb-3 text-sm font-semibold uppercase tracking-wider text-emerald-400">
              {group.title}
            </h3>
            <ul class="space-y-2 text-sm leading-relaxed">
              {#each group.items as item}
                <li class="flex gap-2">
                  <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/60"></span>
                  <span>{item}</span>
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>
    </section>
  {/if}

  <!-- Problems found and fixed -->
  {#if project.highlights && project.highlights.length > 0}
    <section>
      <h2 class="text-2xl font-semibold text-gray-100 mb-6">Problems Found and Fixed</h2>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {#each project.highlights as highlight}
          <div class="rounded-xl bg-white/[0.03] p-5 ring-1 ring-white/10 border-l-2 border-emerald-400/60">
            <h3 class="mb-2 font-semibold text-gray-100">{highlight.title}</h3>
            <p class="text-sm leading-relaxed text-gray-400">{highlight.detail}</p>
          </div>
        {/each}
      </div>
    </section>
  {/if}

  <!-- Current Features -->
  {#if !project.featureGroups?.length && project.features && project.features.length > 0}
    <section>
      <h2 class="text-2xl font-semibold text-gray-100 mb-4">Current Features</h2>
      <ul class="list-disc ml-5 space-y-2">
        {#each project.features as feature}
          <li>{feature}</li>
        {/each}
      </ul>
    </section>
  {/if}

  <!-- Roadmap / Planned Features -->
  {#if project.roadmap && project.roadmap.length > 0}
    <section>
      <h2 class="text-2xl font-semibold text-gray-100 mb-4">Roadmap / Planned Features</h2>
      <ul class="list-disc ml-5 space-y-2">
        {#each project.roadmap as item}
          <li>{item}</li>
        {/each}
      </ul>
    </section>
  {/if}

  <!-- Development Notes -->
  {#if project.notes && project.notes.length > 0}
    <section>
      <h2 class="text-2xl font-semibold text-gray-100 mb-4">Development Notes</h2>
      <ul class="list-disc ml-5 space-y-2">
        {#each project.notes as note}
          <li>{note}</li>
        {/each}
      </ul>
    </section>
  {/if}

  <!-- Image Gallery -->
  {#if project.images.length > 0}
    <section>
      <h2 class="text-2xl font-semibold text-gray-100 mb-6">Project Gallery</h2>
      <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {#each project.images as image}
          <button
            type="button"
            class="overflow-hidden rounded-xl bg-gray-900 ring-1 ring-white/10 shadow-md group cursor-zoom-in"
            on:click={() => openLightbox(image.src, image.alt ?? project.title)}
          >
            <img
              src={image.src}
              alt={image.alt ?? project.title}
              class="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </button>
        {/each}
      </div>
    </section>
  {/if}
</div>

{#if lightboxSrc}
  <div
    class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-6"
    on:click={closeLightbox}
    role="button"
    tabindex="0"
    on:keydown={(e) => e.key === 'Enter' && closeLightbox()}
  >
    <button
      type="button"
      class="absolute top-5 right-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-gray-200 ring-1 ring-white/20 hover:bg-white/20 transition-colors"
      on:click={closeLightbox}
      aria-label="Close"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <div on:click|stopPropagation role="presentation">
      <!-- Sized against the viewport, not the wrapper: the wrapper has no height
           of its own, so max-h-full never limited anything and tall images ran
           past the bottom of the screen. 3rem is the overlay's p-6 on both sides. -->
      <img
        src={lightboxSrc}
        alt={lightboxAlt}
        class="block w-auto h-auto max-w-[calc(100vw_-_3rem)] max-h-[calc(100dvh_-_3rem)] object-contain rounded-lg shadow-2xl"
      />
    </div>
  </div>
{/if}
