import React, { useState } from 'react';
import { BLOG_POSTS } from '@/content/blogs/blogData';
import { FAQ_ITEMS } from '@/content/faq/faqData';
import { RoutePath } from '@/types';
import { ArrowRight, BookOpen, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface EducationViewProps {
  initialSlug?: string;
  navigate: (path: RoutePath) => void;
  onOpenConsultation: () => void;
}

export const EducationView: React.FC<EducationViewProps> = ({
  initialSlug,
  navigate,
  onOpenConsultation,
}) => {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSlug || null);
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const selectedPost = BLOG_POSTS.find((p) => p.slug === selectedSlug);

  const categories = ['All', 'Basics', 'SIP', 'Tax Planning', 'Retirement', 'Mutual Funds'];

  const filteredPosts = BLOG_POSTS.filter((p) => {
    if (activeCategory !== 'All' && p.category !== activeCategory) return false;
    return true;
  });

  // If viewing a single article
  if (selectedPost) {
    return (
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <button
            onClick={() => setSelectedSlug(null)}
            className="text-xs text-slate-500 hover:text-[var(--farcon-text)] inline-flex items-center gap-1 mb-4"
          >
            ← Back to Education Insights
          </button>

          {/* Zero-Pill Discipline Metadata */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
            <span className="font-semibold text-[var(--farcon-secondary)]">{selectedPost.category}</span>
            <span aria-hidden="true">·</span>
            <span>{selectedPost.publishedDate}</span>
            <span aria-hidden="true">·</span>
            <span>{selectedPost.readTime}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-poppins font-medium text-[var(--farcon-text)] tracking-tight leading-tight">
            {selectedPost.title}
          </h1>

          <p className="mt-4 text-xs sm:text-sm text-slate-500 italic">
            By {selectedPost.author}
          </p>
        </div>

        {/* Article Body */}
        <div className="prose prose-slate max-w-none text-[var(--farcon-text)] space-y-4 text-sm leading-relaxed border-t border-[var(--farcon-border)] pt-8">
          {selectedPost.content.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        {/* Next step CTA */}
        <div className="mt-12 p-6 bg-[var(--farcon-surface-soft)] rounded-xl border border-[var(--farcon-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold text-[var(--farcon-text)]">Have questions about this topic?</h4>
            <p className="text-xs text-[var(--farcon-text-muted)] mt-0.5">Discuss your situation with our advisory team.</p>
          </div>
          <button
            onClick={onOpenConsultation}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-[var(--farcon-navy)] rounded-md hover:bg-slate-800 transition-colors shrink-0"
          >
            Ask Farcon
          </button>
        </div>
      </article>
    );
  }

  // Education Hub View
  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs font-semibold tracking-wider uppercase text-[var(--farcon-primary)]">
          Investor Knowledge
        </span>
        <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-poppins font-medium text-[var(--farcon-text)] tracking-tight">
          Financial Education, Grounded in First Principles
        </h1>
        <p className="mt-4 text-sm text-[var(--farcon-text-muted)] leading-relaxed">
          Unbiased, practical essays on compounding, rupee-cost averaging, asset allocation, and tax planning—written without jargon or sales push.
        </p>

        {/* Category Tabs */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeCategory === cat
                  ? 'bg-[var(--farcon-navy)] text-white'
                  : 'bg-[#EAF0F6] text-[var(--farcon-text-muted)] hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Magazine Editorial Composition (1 Dominant Featured + Supporting Essays) */}
      {filteredPosts.length > 0 && (
        <div className="space-y-8">
          {/* Featured Large Lead Essay */}
          {filteredPosts[0] && (
            <article
              onClick={() => setSelectedSlug(filteredPosts[0].slug)}
              className="bg-[var(--farcon-surface-soft)] p-8 sm:p-12 lg:p-14 rounded-2xl border border-[var(--farcon-border)] cursor-pointer group hover:border-[var(--farcon-border)] transition-all flex flex-col justify-between"
            >
              <div className="space-y-4 max-w-4xl">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                  <span className="text-[var(--farcon-primary)] font-bold uppercase">{filteredPosts[0].category}</span>
                  <span>·</span>
                  <span>{filteredPosts[0].readTime}</span>
                  <span>·</span>
                  <span>{filteredPosts[0].publishedDate}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-poppins font-medium text-[var(--farcon-text)] group-hover:text-[var(--farcon-primary)] transition-colors leading-[1.15]">
                  {filteredPosts[0].title}
                </h2>

                <p className="text-sm sm:text-base text-[var(--farcon-text-muted)] leading-relaxed max-w-3xl">
                  {filteredPosts[0].excerpt}
                </p>
              </div>

              <div className="pt-8 mt-8 border-t border-[var(--farcon-border)]/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">By {filteredPosts[0].author}</span>
                <span className="font-semibold text-[var(--farcon-text)] group-hover:text-[var(--farcon-primary)] inline-flex items-center gap-1.5">
                  Read Essay <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          )}

          {/* Supporting Essays Grid */}
          {filteredPosts.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {filteredPosts.slice(1).map((post) => (
                <article
                  key={post.id}
                  onClick={() => setSelectedSlug(post.slug)}
                  className="bg-white p-6 sm:p-8 rounded-2xl border border-[var(--farcon-border)] flex flex-col justify-between cursor-pointer group hover:border-[var(--farcon-border)] transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                      <span className="text-[var(--farcon-secondary)] font-semibold">{post.category}</span>
                      <span>·</span>
                      <span>{post.readTime}</span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-poppins font-medium text-[var(--farcon-text)] group-hover:text-[var(--farcon-primary)] transition-colors leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-xs text-[var(--farcon-text-muted)] leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 mt-6 border-t border-[var(--farcon-border)]/70 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono text-[11px]">{post.publishedDate}</span>
                    <span className="font-semibold text-[var(--farcon-text)] group-hover:text-[var(--farcon-primary)] inline-flex items-center gap-1">
                      Read Essay <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Embedded FAQ Accordion Section */}
      <div className="bg-[var(--farcon-surface-soft)] rounded-2xl p-6 sm:p-12 border border-[var(--farcon-border)]">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-semibold tracking-wider uppercase text-[var(--farcon-primary)]">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-poppins font-medium text-[var(--farcon-text)] mt-1">
            Transparency, Custody & Process
          </h2>
          <p className="text-xs sm:text-sm text-[var(--farcon-text-muted)] mt-1">
            Clear answers to common questions about Farcon’s distributor model.
          </p>
        </div>

        <div className="space-y-3 max-w-4xl">
          {FAQ_ITEMS.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-lg border border-[var(--farcon-border)]/80 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 transition-colors hover:bg-[#F7F9FC]/50"
                  aria-expanded={isOpen}
                >
                  <span className="text-xs sm:text-sm font-semibold text-[var(--farcon-text)]">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs text-[var(--farcon-text-muted)] leading-relaxed border-t border-[var(--farcon-border)]/70 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
