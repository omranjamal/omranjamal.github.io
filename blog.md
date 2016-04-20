---
layout: page
title_html: <i class="fa fa-rss" aria-hidden="true"></i><br><br> Sometimes I <em>write</em> stuff
---
## Recently...
<section class="posts">
    {% for post in site.posts %}
    <a href="{{ post.url }}" class="post">
        <div class="image" style="background-image: url({{ post.image }});"></div>
        <span class="thumb-title">{{ post.title }}</span>
        <footer>
            <span class="date">{{ post.date | date: '%B %d, %Y' }}</span>
        </footer>
    </a>
    {% endfor %}
</section>
