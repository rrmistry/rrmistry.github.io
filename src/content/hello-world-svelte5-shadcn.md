---
title: 'Hello World with Svelte 5 and shadcn/ui'
date: 2023-10-01
tags: ['blog', 'svelte', 'shadcn', 'tailwind', 'github-actions', 'devbox']
description: My first blog post
---

# Welcome to my blog!

This is my first post using a bunch of new (to me) tech stacks and tools.

To name a few:

<ul>
    <li><a href="https://svelte.dev/" target="_blank">Svelte</a></li>
    <li><a href="https://tailwindcss.com/" target="_blank">Tailwind CSS</a></li>
    <li><a href="https://github.com/jetify-com/devbox" target="_blank">Devbox</a></li>
    <li><a href="https://ui.shadcn.com/" target="_blank">shadcn/ui</a></li>
    <li><a href="https://next.shadcn-svelte.com/" target="_blank">shadcn/ui for Svelte</a></li>
    <li><a href="https://mdsvex.pngwn.io/" target="_blank">mdsvex</a></li>
    <li><a href="https://github.com/features/actions" target="_blank">GitHub Actions</a></li>
</ul>

---

# Core Philosophy for design choices

There are many tradeoffs when it comes to design and technology choices. The tradeoffs made here are a reflection of my own personal values and preferences. There are many other choices that I would make, but I think this is a good starting point for the end goal I am trying to achieve.

## 1. Using Svelte instead of Vue / React

I am from a heavy C#, ASP.NET, Blazor background and so am used to compiled and statically typed languages. That thinking used to extend into frontend components as well.

Svelte felt like the closet match to that paradigm of thinking and framework. That and the excellent video from <a href="https://www.youtube.com/watch?v=rv3Yq-B8qp4" target="_blank">Fireship.io</a> pushed me to try it out.

<div class="flex justify-center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/rv3Yq-B8qp4?si=iriWIzZZPxXy2Ckq" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

<div class="text-center">
<span class="text-xs">I am not affiliated with Fireship.io, just really like his work.</span>
</div>

## 2. Using Tailwind instead of Bootstrap

Similar to the Svelte choice, I felt that Tailwind CSS was much easier to transition from <a href="https://learn.microsoft.com/en-us/aspnet/core/blazor/components/css-isolation" target="_blank">Blazor CSS</a> implementations to. It is a little more opinionated, but I think it is a good choice overall.

## 3. Using shadcn/ui

I liked the idea of minimalist and easy to use components that I can own and customize. Over the years, I have learnt that depending on pre-packaged components exposes too much risk to upstream changes. Styling and design consistencies are also a nighmare to predict and maintain.

The core philosophy of shadcn/ui felt just right to me. Again, the excellent video from <a href="https://www.youtube.com/watch?v=TBIjgBVFjVI" target="_blank">Fireship.io</a> pushed me to try it out.

<div class="flex justify-center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/TBIjgBVFjVI?si=oqKvTY7_1PP-77WP" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

<div class="text-center">
<span class="text-xs">I am not affiliated with Fireship.io, just really like his work.</span>
</div>

## 4. Using Jetify Devbox

This one is another killer tool that I absolutely live without. It is a full-fledged dev environment that I can use to spin up a new project from scratch. It can **reliably** and **consistently** setup a shell session with all the tools necessary to work on the project.

Previously I used <a href="https://code.visualstudio.com/docs/devcontainers/containers" target="_blank">Docker, VS Code with Dev Containers</a>

<div class="flex justify-center">
![Docker, VS Code with Dev Containers Architecture](https://code.visualstudio.com/assets/docs/devcontainers/containers/architecture-containers.png)
</div>

But it felt really resource heavy for simple minimalist projects like a personal blog. Devbox offers a much more lightweight approach with local host shell sessions. This also means that I can access my local files, databases, etc. without having to solve networking or volume mounting issues.

Also, catching this on the <a href="https://www.youtube.com/watch?v=WiFLtcBvGMU" target="_blank">DevOps Toolkit</a> channel was an excellent find!

<div class="flex justify-center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/WiFLtcBvGMU?si=7YGc9OqnXwuub1Vb" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

<div class="text-center">
<span class="text-xs">I am not affiliated with DevOps Toolkit, just really like his work.</span>
</div>

Now I go for Devbox first, and only when I have specific use cases for isolation do I go for Dev Containers.

<div class="flex justify-center">
<img src="https://user-images.githubusercontent.com/279789/186491771-6b910175-18ec-4c65-92b0-ed1a91bb15ed.svg" alt="devbox preview" />
</div>

---

I hope you like it what you see!

Please feel free to drop a question in the blog's <a href="https://github.com/rrmistry/rrmistry.github.io/discussions/new/choose" target="_blank">discussions</a>.
