import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchBlogBySlug, fetchBlogPage, fetchBlogs, fetchBlogCategories } from '../../../services/api';
import BlogHero from '../../../components/BlogHero';
import BlogComments from '../../../components/BlogComments';
import { SidebarSearch, SidebarCategories } from '../../../components/SidebarWidgets';
import { Calendar, User, MessageCircle, ArrowRight } from 'lucide-react';
import { formatDate } from '../../../utils/dateFormatter';
import '../../service.css';
import '../../blog-detail.css';

const FacebookIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TwitterIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);

const YoutubeIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.46 5.58a2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.46-5.58zM9.75 15.02V8.98L15 12l-5.25 3.02z" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z" />
  </svg>
);

export const dynamic = "force-dynamic";

async function getData(slug) {
  try {
    console.log("[getData] Starting parallel fetch for:", slug);
    const [blogRes, pageRes, blogsRes, categoriesRes] = await Promise.all([
      fetchBlogBySlug(slug),
      fetchBlogPage(),
      fetchBlogs({ status: 'Published' }),
      fetchBlogCategories()
    ]);

    const blog = blogRes?.data || null;
    const allBlogs = blogsRes?.data || [];
    
    console.log("[getData] Success. Blog found:", !!blog, "All blogs count:", allBlogs.length);

    // Logic for Related Posts (Same category, exclude current)
    const relatedPosts = allBlogs
      .filter(b => b.category_id === blog?.category_id && b.slug !== slug)
      .slice(0, 3);

    return {
      blog,
      pageSettings: pageRes?.data || {},
      recentBlogs: allBlogs,
      dynamicCategories: categoriesRes?.data || [],
      relatedPosts,
      totalBlogCount: allBlogs.length
    };
  } catch (error) {
    console.error("[getData] ERROR during fetch:", error);
    throw error;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blogRes = await fetchBlogBySlug(slug);
  const blog = blogRes?.data;
  
  const siteUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://dmctrichology-mkm4.vercel.app';
  const title = blog ? `${blog.title} | DMC Trichology` : 'Blog Detail | DMC Trichology';
  const description = blog?.shortDescription || blog?.excerpt || 'Read the latest updates and advice from DMC Trichology experts.';
  const image = blog?.blogImage || `${siteUrl}/default-blog.jpg`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/blog/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/blog/${slug}`,
      siteName: 'DMC Trichology',
      images: [{ url: image }],
      type: 'article',
      publishedTime: blog?.blogDate || blog?.created_at,
      authors: [blog?.author || 'Admin'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    }
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  
  let data;
  try {
    console.log("[BlogDetailPage] Fetching data for slug:", slug);
    data = await getData(slug);
  } catch (error) {
    console.error("[BlogDetailPage] CRITICAL DATA FETCH ERROR:", error);
    data = { 
      blog: null, 
      pageSettings: {}, 
      recentBlogs: [], 
      dynamicCategories: [], 
      relatedPosts: [], 
      totalBlogCount: 0 
    };
  }

  // Ensure data exists with fallbacks
  const blog = data?.blog || null;
  const pageSettings = data?.pageSettings || {};
  const recentBlogs = Array.isArray(data?.recentBlogs) ? data.recentBlogs : [];
  const dynamicCategories = Array.isArray(data?.dynamicCategories) ? data.dynamicCategories : [];
  const relatedPosts = Array.isArray(data?.relatedPosts) ? data.relatedPosts : [];
  const totalBlogCount = Number(data?.totalBlogCount || 0);

  if (!blog) {
    console.warn("[BlogDetailPage] Blog not found for slug:", slug);
    notFound();
  }

  // Defensive parsing for pageSettings
  const listingSettings = pageSettings?.listing || {};
  const {
    sidebarSearchPlaceholder = "Enter Key Word",
    sidebarCategoriesTitle = "Blog Categories",
    sidebarRecentPostsTitle = "Recent Post",
  } = listingSettings;

  // Ensure content is a string
  const blogContent = typeof blog.content === 'string' 
    ? blog.content 
    : (typeof blog.content === 'object' ? JSON.stringify(blog.content) : String(blog.content || ""));

  // Article Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": String(blog.title || ""),
    "image": [String(blog.blogImage || blog.image || "")],
    "datePublished": blog.blogDate || blog.created_at,
    "dateModified": blog.updated_at || blog.blogDate || blog.created_at,
    "author": [{
        "@type": "Person",
        "name": String(blog.author || "Admin"),
        "url": "#"
    }]
  };

  return (
    <div className="bg-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Blog Hero */}
      <BlogHero data={{
        ...(pageSettings?.hero || {}),
        title: "Blog Detail",
        breadcrumbText: "Blog Detail"
      }} />

      {/* Main Content */}
      <div className="blog-detail-container">
        <div className="blog-detail-grid">
          
          {/* Left Column: Blog Content */}
          <article className="blog-main-content">
            <div className="blog-detail-image">
              <img src={String(blog.blogImage || blog.image || 'https://via.placeholder.com/1200x600')} alt={String(blog.title || "Blog")} />
            </div>

            <div className="blog-detail-meta">
              <div className="meta-item">
                <Calendar size={14} className="text-blue-600" />
                <span>{formatDate(blog.blogDate || blog.date)}</span>
              </div>
              <div className="meta-item">
                <User size={14} className="text-blue-600" />
                <span>Admin By {String(blog.author || 'Admin')}</span>
              </div>
              <div className="meta-item">
                <MessageCircle size={14} className="text-blue-600" />
                <span>Comments (30)</span>
              </div>
            </div>

            <h2 className="blog-detail-title">{String(blog.title || "")}</h2>

            <div 
              className="blog-content-body" 
              dangerouslySetInnerHTML={{ __html: blogContent }} 
            />

            <div className="blog-quote">
                <div className="quote-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path></svg>
                </div>
                <p>
                    Music Events Bring People Together, Creating Magical Moments Through Live Performances, Stunning Visuals, And Immersive Sound. From Intimate Acoustic Sets To Grand Stadium Concerts, Each Experience Leaves A Lasting Impact On Audiences.
                </p>
            </div>

            <div className="blog-image-grid">
                <div className="image-placeholder"></div>
                <div className="image-placeholder"></div>
            </div>

            <p className="blog-post-footer-text">
                From Intimate Acoustic Sets To Grand Stadium Concerts, Each Experience Leaves A Lasting Impact On Audiences. The Energy Of The Crowd, The Passion Of The Artists, And The Atmosphere All Combine To Make Every Event Unique. Whether It's A Music Festival, A Cultural Celebration, Or An Exclusive They Create. Discover How The Right Mix Of Music, Technology, And Creativity Turns An Event Into An Unforgettable Experience.
            </p>

            <div className="blog-share-section">
                <span className="share-label">Follow Us On :</span>
                <div className="share-icons">
                    <a href="#"><FacebookIcon width={18} height={18} /></a>
                    <a href="#"><InstagramIcon width={18} height={18} /></a>
                    <a href="#"><TwitterIcon width={18} height={18} /></a>
                    <a href="#"><YoutubeIcon width={18} height={18} /></a>
                    <a href="#"><LinkedinIcon width={18} height={18} /></a>
                </div>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="related-posts-section" style={{ marginTop: '50px', paddingTop: '50px', borderTop: '1px solid #eee' }}>
                <h3 className="section-title" style={{ marginBottom: '30px', fontSize: '24px' }}>Related Posts</h3>
                <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                  {relatedPosts.map((post, idx) => (
                    <div key={idx} className="blog-card" style={{ boxShadow: 'none', border: '1px solid #eee' }}>
                      <div className="blog-card-image" style={{ height: '200px' }}>
                        <img src={String(post?.blogImage || post?.image || 'https://via.placeholder.com/600x400')} alt={String(post?.title || "Blog")} style={{ height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div className="blog-card-info">
                        <div className="blog-card-meta">
                          <div className="meta-item">
                            <Calendar size={14} className="text-blue-600" />
                            <span>{formatDate(post?.blogDate || post?.date)}</span>
                          </div>
                        </div>
                        <h4 className="blog-card-title" style={{ fontSize: '18px', margin: '15px 0', fontFamily: 'Marcellus' }}>{String(post?.title || "")}</h4>
                        <Link href={`/blog/${String(post?.slug || "")}`} className="explore-link" style={{ display: 'flex', alignItems: 'center', color: '#c5a47e' }}>
                          Explore More <ArrowRight size={14} className="ml-1" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments & Reply Form */}
            <BlogComments blogSlug={slug} />
          </article>

          {/* Right Side: Sidebar */}
          <aside className="blog-sidebar">
            <div className="sidebar-inner">
              {/* Search Widget */}
              <div className="sidebar-widget search-widget">
                <SidebarSearch placeholder={sidebarSearchPlaceholder} />
              </div>

              {/* Categories Widget */}
              <SidebarCategories 
                title={sidebarCategoriesTitle} 
                categories={dynamicCategories} 
                totalCount={totalBlogCount} 
              />

              {/* Recent Posts Widget */}
              <div className="sidebar-widget">
                <h4 className="sidebar-title">{String(sidebarRecentPostsTitle || "")}</h4>
                <div className="recent-posts">
                  {(Array.isArray(recentBlogs) ? recentBlogs.slice(0, 4) : []).map((post, idx) => (
                    <div key={idx} className="recent-post-item">
                      <div 
                        className="post-thumb"
                        style={{
                          backgroundImage: `url(${String(post?.blogImage || post?.image || 'https://via.placeholder.com/80')})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundColor: '#D9D9D9'
                        }}
                      ></div>
                      <div className="post-content">
                        <span className="post-date">
                          {formatDate(post?.blogDate || post?.date)}
                        </span>
                        <h5 className="post-title">
                          <Link href={`/blog/${String(post?.slug || "")}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                            {String(post?.title || "")}
                          </Link>
                        </h5>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Promo Banner Widget (Optional for detail page but part of listing) */}
            </div>
          </aside>

        </div>
      </div>


    </div>
  );
}
