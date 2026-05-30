---
title: My First Website Building Experience
date: 2025-04-04 18:29:32
tags: 
  - Hexo
categories:
  - 前端
sticky: false
cover: /images/mainweb.webp
urlname: firstblog
lang: en
---

# From C++ to Frontend: My First Experience Crossing Boundaries

I started programming quite late compared to other experts, around the first semester of 10th grade when I began learning C++. I decided to pursue this path to get into a top university. Although my goal is in cybersecurity and competitive programming (mostly because I’m afraid of struggling if I go frontend), I still challenged myself to learn web development (for university admission requirements). However, this time, **I didn’t build the website from scratch but used the Hexo framework with a pre-made template** (my skills weren’t enough). Although the process was relatively simple, it gave me a basic understanding of website architecture (I plan to rewrite everything in 11th grade).

## Why Choose Hexo?
![hexo](/images/FB/hexo.webp) 
At the beginning of learning web development, I faced a question: where should I start? After checking many top developers’ sites, I found Hexo, a fast, simple, and efficient static site generator, especially suitable for beginners like me who have little technical background. Its advantages are:  
> **Eazy to use**: Just install Node.js and npm (more Linux-friendly) to quickly set up a site.

> **Markdown support**: Very friendly to beginners who aren’t familiar with HTML for writing content.

> **Rich templates**: A large collection of ready-made themes to easily create a beautiful site.

Using Hexo allows me to focus on content creation rather than technical details, making it an ideal choice when I was just starting in web development.

## The Template Process

When I decided to use Hexo, I had already picked my template. Among many templates, D-Sketon’s Reimu theme immediately attracted me ~~（我只是看到東方就進來了）~~. However, little did I know that the real challenge was about to begin...  
![reimu](https://camo.githubusercontent.com/f64a6ac5d574730263df80812a6bb4c603a25a9563440b45c9cc37c1b228df65/68747470733a2f2f63646e2e6a7364656c6976722e6e65742f67682f442d536b65746f6e2f6865786f2d7468656d652d7265696d75406d61696e2f5f73637265656e73686f742f5265696d755f6461726b2e706e67)

The first major problem I faced was: “How to work on a Hexo site on Linux?”  
Because my computer runs Linux, and I had never cloned anything from GitHub or used Hexo on Linux before, the environment setup took me quite some time. Node.js, npm, Hexo CLI, permission settings—all required lots of research and trial.

The real problem appeared during deployment on GitHub Pages: the backend kept complaining “Reimu template not found.” I repeatedly confirmed the files and paths were correct, but it just wouldn’t pass. **At the time, I didn’t realize that GitHub Pages by default enables the Jekyll processor, while I was using Hexo—so it was basically doomed from the start.**

I was stuck on this issue for almost a month, trying every method I could find. Until one day, suddenly clear-headed, I asked AI and got the suggestion: “Put an empty file named `.nojekyll` in the root directory.”  
I didn’t fully understand why it worked, but at least it did (◉３◉).

## The Impact of AI

Recently, the buzz around “Vibe Coding” emphasizes **“going with the flow, embracing AI progress, and forgetting about the code itself.”** This approach somewhat frees developers’ minds, making the creative process feel more like painting or composing rather than typing code line by line ( ´- ̥̥̥ω- ̥̥̥` ).

Although this project wasn’t a full “vibe coding” experience, actually about **40% of my problems** were solved with AI help. For example, CSS syntax errors, YAML format mistakes, even small Hexo config details—many bugs I hadn’t noticed, AI could quickly point out and provide fixes.

While AI provided timely and accurate help in many cases, **in some complex or nuanced situations, it could lead me astray.**

For instance, AI sometimes gave YAML fixes that looked correct on the surface but had logic errors, causing Hexo to malfunction. It could also offer outdated solutions or suggest syntax that didn’t exist, especially for niche features or custom components.

Another problem was **“being too reliant on AI.”** Once I got used to asking AI, I reduced my own searching and documentation reading, which hurt my debugging skills. Especially when AI’s answers missed the point, **if I also didn’t know how to debug myself, I’d get stuck even longer.**  
(Nowadays, many people don’t even know how to use Git…)

## The Importance of English

In the AI wave, I often neglected the importance of English, assuming good coding skills alone would carry me through. But during this project, almost all interfaces and docs like VScode, Cursor, and GitHub are in English. When facing issues, I had to spend a lot of time reading and trying to understand English error messages and documentation (…really hard to comprehend sometimes).

This made me deeply realize that English is not just a “plus” for CS students—it is a **“must-have skill.”** From technical docs and language keywords to international developer communities, English is everywhere. Without basic English skills, learning progress slows and many valuable resources and opportunities might be lost.

This project taught me: never sleep during English classes again~~(´◓Д◔`)

## Reflection and Future Plans

### Achievements and Shortcomings

Using Hexo to build a website and apply a template gave me an unprecedented sense of accomplishment (and a bit of ego inflation). Every step from nothing to something was full of joy (and pain). Especially with help from large language models, I could solve problems quickly and even finish some features I thought were complicated.

Still, there are many shortcomings in this development process:

> **Relying on templates and AI:** Mainly using templates and AI assistance means my understanding of the site’s underlying structure and logic is still shallow.

> **Lack of independence:** Though AI helped solve many issues, some code was AI-generated and I didn’t fully grasp its logic, which could lead to maintenance difficulties later (well, I can always rewrite it).

### Future Plans

This experience sparked my interest in web development (one step closer to not being “broke”~). It also gave me clear learning goals:

> **Build a website from scratch:** Next, I plan to learn HTML, CSS, and JavaScript from the ground up, trying to build a simple static site myself (or maybe dynamic?). This will deepen my understanding of web fundamentals and boost my development independence.

> **Explore backend technology:** Besides frontend, I want to learn backend tech like Node.js or Python Flask to understand server-side logic and database operations.

> **Combine cybersecurity and competitive programming background:** As a student familiar with C++ and interested in security and contests, I want to merge these skills. For example, learning common vulnerabilities (XSS, SQL injection) and their prevention while studying web dev. Also, researching how to apply efficient algorithms to site features.

> **Reduce AI tool dependency:** While AI offers great convenience, I want to gradually rely less on it and complete more development on my own.

## Conclusion

**This project helped me meet many people, learn a lot, and experience what it feels like to slowly turn an idea into reality.**

From setting up a blog, learning Hexo, customizing themes and styles, then researching deployment, debugging, and writing Markdown, I found building a website is more than coding—it’s a form of expression, organization, and sharing. **Though the blog still has lots of room to improve, it represents my effort and growth during this time.** I will keep updating it, recording my learning journey, and hope to meet more like-minded friends to write, share, and grow together.

Finally, I want to encourage all beginners not to fear trying new things. Even if you start by using templates or AI help, **every effort is part of your growth.** In the future, I look forward to creating an entirely my own site, combining my cybersecurity and competitive programming background to realize more possibilities.

![Homepage](/images/FB/主頁.webp)
(captured on 2025/8/21)

# Special Thanks
<div class="friend-item-wrap">
  <a href="https://smallr-portfolio.vercel.app/en" rel="external nofollow noopener noreferrer" target="_blank"></a>
    <div class="friend-icon-wrap">
      <div class="friend-icon">
        <img data-src="/images/smallR.webp" data-sizes="auto" alt="Small R" class="lazyautosizes lazyloaded" sizes="70px" src="/images/smallR.webp">
      </div>
    </div>
    <div class="friend-info-wrap">
      <div class="friend-name">Small R</div>
      <div class="friend-desc">A Full-Stack Developer</div>
    </div>
  </div>

**for helping me fix the Waline comment system bugs!**