"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { fetchBlogs, fetchBlogCategories } from '../services/api';
import EditableSection from './Editable/EditableSection';
import { useBuilder } from '../context/BuilderContext';
import { Search, ChevronRight, Calendar, User, ArrowRight } from 'lucide-react';

const BlogListing = ({ data: initialData }) => {
  const { isEditMode, siteConfig } = useBuilder();
  const [pageData, setPageData] = useState(initialData?.listing || {});
  const [blogs, setBlogs] = useState([]);
  const [allBlogsForSidebar, setAllBlogsForSidebar] = useState([]); // For accurate counts and recent posts
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Real-time sync from Visual Builder
  useEffect(() => {
    if (isEditMode && siteConfig && siteConfig.sectionId === 'blog-listing') {
      setPageData(prev => ({ ...prev, ...siteConfig.data.listing }));
    }
  }, [isEditMode, siteConfig]);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      // Fetch filtered blogs for main listing
      const blogsRes = await fetchBlogs({ search, categoryId: selectedCategory, limit: 10 });
      if (blogsRes?.success) setBlogs(blogsRes.data);
      
      // Fetch categories
      const catsRes = await fetchBlogCategories();
      if (catsRes?.success) setCategories(catsRes.data);

      // Fetch all blogs (minimal fields) for sidebar counts and recent posts if not already done
      if (allBlogsForSidebar.length === 0) {
        const allRes = await fetchBlogs({ limit: 100 });
        if (allRes?.success) setAllBlogsForSidebar(allRes.data);
      }
      
      setLoading(false);
    };
    loadContent();
  }, [search, selectedCategory]);

  const categoryCounts = useMemo(() => {
    const counts = {};
    allBlogsForSidebar.forEach(blog => {
      const catId = blog.categoryId || blog.category?._id || blog.category?.id;
      if (catId) {
        counts[catId] = (counts[catId] || 0) + 1;
      }
    });
    return counts;
  }, [allBlogsForSidebar]);

  const recentPosts = useMemo(() => {
    return allBlogsForSidebar.slice(0, 3);
  }, [allBlogsForSidebar]);

  const {
    sidebarSearchPlaceholder = "Enter Key Word",
    sidebarCategoriesTitle = "Blog Categories",
    sidebarRecentPostsTitle = "Recent Post",
    promoImage = "",
    promoLink = "#"
  } = pageData;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <EditableSection sectionId="blog-listing" label="Blog Listing Section">
      <section className="blog-listing-wrapper">
        <div className="blog-listing-container">
          
          {/* Main Content: Blog Grid */}
          <div className="blog-main-content">
            {loading ? (
              <div className="blog-loading">
                <div className="spinner"></div>
                <span>Loading our latest stories...</span>
              </div>
            ) : blogs.length === 0 ? (
              <div className="blog-empty">
                <h3>No articles found</h3>
                <p>Try adjusting your search or category filter.</p>
                <button onClick={() => {setSearch(""); setSelectedCategory(null);}} className="reset-btn">Reset Filters</button>
              </div>
            ) : (
              <div className="blog-grid">
                {blogs.map((blog) => (
                  <div key={blog.id} className="blog-card-premium">
                    <div className="blog-card-image-wrapper">
                      <img 
                        src={blog.blogImage || 'https://via.placeholder.com/600x400'} 
                        alt={blog.title} 
                        className="blog-card-image"
                      />
                      <div className="blog-card-date-badge">
                        <Calendar size={14} />
                        {formatDate(blog.blogDate)}
                      </div>
                    </div>
                    
                    <div className="blog-card-body">
                      <div className="blog-card-meta">
                        <div className="author-info">
                          <div className="author-icon"><User size={14} /></div>
                          <span>By {blog.author || "Admin"}</span>
                        </div>
                      </div>

                      <h3 className="blog-card-title">{blog.title}</h3>

                      <p className="blog-card-excerpt">
                        {blog.shortDescription}
                      </p>

                      <a href={`/blog/${blog.slug}`} className="blog-card-link">
                        Explore More <ArrowRight size={16} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="blog-sidebar">
            {/* Search */}
            <div className="sidebar-widget search-widget">
              <div className="search-input-wrapper">
                <input 
                  type="text" 
                  placeholder={sidebarSearchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="search-submit"><Search size={18} /></button>
              </div>
            </div>

            {/* Categories */}
            <div className="sidebar-widget">
              <h4 className="widget-title">{sidebarCategoriesTitle}</h4>
              <ul className="category-list">
                <li 
                  className={!selectedCategory ? 'active' : ''}
                  onClick={() => setSelectedCategory(null)}
                >
                  <div className="cat-name">
                     <ChevronRight size={14} className="cat-arrow" />
                     <span>All Posts</span>
                  </div>
                  <span className="cat-count">{allBlogsForSidebar.length}</span>
                </li>
                {categories.map(cat => (
                  <li 
                    key={cat.id} 
                    className={selectedCategory === cat.id ? 'active' : ''}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <div className="cat-name">
                       <ChevronRight size={14} className="cat-arrow" />
                       <span>{cat.name}</span>
                    </div>
                    <span className="cat-count">{categoryCounts[cat.id] || 0}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Posts */}
            <div className="sidebar-widget">
              <h4 className="widget-title">{sidebarRecentPostsTitle}</h4>
              <div className="recent-posts-list">
                {recentPosts.map(blog => (
                  <div key={blog.id} className="recent-post-item">
                    <div className="recent-post-thumb">
                      <img src={blog.blogImage} alt={blog.title} />
                    </div>
                    <div className="recent-post-info">
                      <span className="recent-post-date">{formatDate(blog.blogDate)}</span>
                      <h5 className="recent-post-title">
                        <a href={`/blog/${blog.slug}`}>{blog.title}</a>
                      </h5>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Promo / Banner */}
            {promoImage && (
              <div className="sidebar-promo">
                <a href={promoLink}>
                  <img src={promoImage} alt="Promotion" />
                  <div className="promo-overlay">
                     <span>Special Offer</span>
                     <ArrowRight size={20} />
                  </div>
                </a>
              </div>
            )}
          </aside>
        </div>

        <style jsx>{`
          .blog-listing-wrapper {
            padding: 100px 5%;
            background-color: #ffffff;
            min-height: 800px;
          }
          .blog-listing-container {
            max-width: 1400px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr 350px;
            gap: 60px;
          }

          /* Main Content */
          .blog-main-content {
            flex: 1;
          }
          .blog-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 35px;
          }

          /* Blog Card */
          .blog-card-premium {
            background-color: #F9F7F2;
            border-radius: 40px;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
            display: flex;
            flex-direction: column;
            border: 1px solid rgba(0,0,0,0.03);
          }
          .blog-card-premium:hover {
            transform: translateY(-12px);
            box-shadow: 0 30px 60px rgba(0,0,0,0.08);
            background-color: #ffffff;
            border-color: #eee;
          }

          .blog-card-image-wrapper {
            height: 320px;
            position: relative;
            overflow: hidden;
          }
          .blog-card-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s ease;
          }
          .blog-card-premium:hover .blog-card-image {
            transform: scale(1.08);
          }

          .blog-card-date-badge {
            position: absolute;
            bottom: 20px;
            left: 20px;
            background: #ffffff;
            padding: 10px 22px;
            border-radius: 50px;
            font-size: 13px;
            font-family: 'Marcellus', serif;
            display: flex;
            align-items: center;
            gap: 8px;
            color: #111;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            z-index: 2;
          }

          .blog-card-body {
            padding: 35px;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
          }
          .blog-card-meta {
            display: flex;
            align-items: center;
            margin-bottom: 18px;
          }
          .author-info {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
            color: #777;
            font-family: 'Marcellus', serif;
          }
          .author-icon {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: #eee;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #333;
          }

          .blog-card-title {
            font-size: 26px;
            font-family: 'Marcellus', serif;
            color: #111;
            margin-bottom: 18px;
            line-height: 1.3;
            font-weight: 400;
          }
          .blog-card-excerpt {
            font-size: 15px;
            color: #666;
            font-family: 'Lato', sans-serif;
            line-height: 1.7;
            margin-bottom: 25px;
            display: -webkit-box;
            WebkitLineClamp: 3;
            WebkitBoxOrient: 'vertical';
            overflow: hidden;
            flex-grow: 1;
          }

          .blog-card-link {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
            font-weight: 700;
            font-family: 'Marcellus', serif;
            color: #111;
            text-decoration: none;
            transition: gap 0.3s ease;
            margin-top: auto;
          }
          .blog-card-premium:hover .blog-card-link {
            gap: 15px;
            color: #2D4A8A;
          }

          /* Sidebar Widgets */
          .sidebar-widget {
            margin-bottom: 50px;
            background: #F9F7F2;
            padding: 35px;
            border-radius: 30px;
          }
          .search-widget {
            padding: 0;
            background: transparent;
          }
          .search-input-wrapper {
            position: relative;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          }
          .search-input-wrapper input {
            width: 100%;
            padding: 20px 60px 20px 30px;
            border-radius: 50px;
            border: 1px solid #eee;
            font-size: 15px;
            font-family: 'Marcellus', serif;
            outline: none;
            background: #fff;
            transition: all 0.3s ease;
          }
          .search-input-wrapper input:focus {
            border-color: #2D4A8A;
            box-shadow: 0 10px 40px rgba(45, 74, 138, 0.1);
          }
          .search-submit {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: #111;
            color: #fff;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background 0.3s ease;
          }
          .search-submit:hover {
            background: #2D4A8A;
          }

          .widget-title {
            font-size: 22px;
            font-family: 'Marcellus', serif;
            color: #111;
            margin-bottom: 25px;
            position: relative;
            padding-bottom: 15px;
          }
          .widget-title::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 40px;
            height: 2px;
            background: #2D4A8A;
          }

          .category-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .category-list li {
            padding: 15px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            border-bottom: 1px solid rgba(0,0,0,0.05);
            transition: all 0.3s ease;
            color: #555;
            font-family: 'Marcellus', serif;
          }
          .category-list li:last-child {
            border-bottom: none;
          }
          .cat-name {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .cat-arrow {
            opacity: 0;
            transition: all 0.3s ease;
            transform: translateX(-5px);
          }
          .category-list li:hover {
            color: #2D4A8A;
            padding-left: 5px;
          }
          .category-list li:hover .cat-arrow,
          .category-list li.active .cat-arrow {
            opacity: 1;
            transform: translateX(0);
          }
          .category-list li.active {
            color: #2D4A8A;
            font-weight: bold;
          }
          .cat-count {
            font-size: 12px;
            background: #fff;
            padding: 4px 10px;
            border-radius: 20px;
            color: #999;
          }

          .recent-posts-list {
            display: flex;
            flex-direction: column;
            gap: 25px;
          }
          .recent-post-item {
            display: flex;
            gap: 18px;
            align-items: center;
          }
          .recent-post-thumb {
            width: 90px;
            height: 85px;
            border-radius: 20px;
            overflow: hidden;
            flex-shrink: 0;
          }
          .recent-post-thumb img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .recent-post-info {
            flex-grow: 1;
          }
          .recent-post-date {
            font-size: 11px;
            color: #999;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-family: 'Lato', sans-serif;
            display: block;
            margin-bottom: 5px;
          }
          .recent-post-title {
            font-size: 16px;
            font-family: 'Marcellus', serif;
            line-height: 1.4;
            font-weight: 400;
          }
          .recent-post-title a {
            color: #111;
            text-decoration: none;
            transition: color 0.3s ease;
          }
          .recent-post-title a:hover {
            color: #2D4A8A;
          }

          .sidebar-promo {
            border-radius: 35px;
            overflow: hidden;
            position: relative;
            cursor: pointer;
          }
          .sidebar-promo img {
            width: 100%;
            height: auto;
            display: block;
            transition: transform 0.5s ease;
          }
          .sidebar-promo:hover img {
            transform: scale(1.05);
          }
          .promo-overlay {
            position: absolute;
            bottom: 30px;
            left: 30px;
            right: 30px;
            background: rgba(255,255,255,0.9);
            padding: 15px 25px;
            border-radius: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-family: 'Marcellus', serif;
            font-weight: bold;
            color: #111;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.4s ease;
          }
          .sidebar-promo:hover .promo-overlay {
            opacity: 1;
            transform: translateY(0);
          }

          /* Loading & Empty States */
          .blog-loading, .blog-empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 100px 0;
            text-align: center;
            font-family: 'Marcellus', serif;
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #eee;
            border-top: 3px solid #2D4A8A;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .reset-btn {
            margin-top: 20px;
            padding: 12px 30px;
            background: #111;
            color: #fff;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            font-family: 'Marcellus', serif;
          }

          /* Responsive */
          @media (max-width: 1200px) {
            .blog-listing-container {
              grid-template-columns: 1fr 320px;
              gap: 40px;
            }
            .blog-grid {
              gap: 25px;
            }
            .blog-card-title {
              font-size: 22px;
            }
          }

          @media (max-width: 992px) {
            .blog-listing-container {
              grid-template-columns: 1fr;
            }
            .blog-sidebar {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 30px;
            }
            .sidebar-widget {
              margin-bottom: 0;
            }
            .search-widget {
              grid-column: span 2;
            }
          }

          @media (max-width: 768px) {
            .blog-grid {
              grid-template-columns: 1fr;
            }
            .blog-sidebar {
              grid-template-columns: 1fr;
            }
            .search-widget {
              grid-column: span 1;
            }
            .blog-listing-wrapper {
              padding: 60px 5%;
            }
          }
        `}</style>
      </section>
    </EditableSection>
  );
};

export default BlogListing;
