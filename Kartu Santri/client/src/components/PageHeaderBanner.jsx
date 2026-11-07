import React from 'react';

/**
 * PageHeaderBanner
 * Komponen header judul menu dengan warna persis seperti Sidebar (#008272 EMIS Teal),
 * serta watermark mandala islami yang elegan.
 */
export function PageHeaderBanner({
  title,
  subtitle,
  icon: Icon,
  badge,
  actions,
  children,
  className = ''
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#094B44] text-white p-5 sm:p-6 lg:p-7 shadow-md shadow-[#094B44]/25 border border-white/15 ${className}`}
    >
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 sm:space-y-2 max-w-2xl">
          {badge && <div className="mb-1">{badge}</div>}

          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center shrink-0 shadow-xs backdrop-blur-xs">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            )}
            <div>
              {typeof title === 'string' ? (
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#D6F2EE] tracking-tight">
                  {title}
                </h1>
              ) : (
                title
              )}
            </div>
          </div>

          {subtitle && (
            <p className="text-xs sm:text-sm text-[#EFF6F3]/90 leading-relaxed font-normal">
              {subtitle}
            </p>
          )}
        </div>

        {(actions || children) && (
          <div className="relative z-20 flex items-center gap-2.5 sm:gap-3 flex-wrap">
            {actions}
            {children}
          </div>
        )}
      </div>

      {/* Pattern Mandala Watermark (Sama persis seperti pada Sidebar) */}
      <div className="absolute -right-8 -bottom-16 sm:-right-6 sm:-bottom-20 pointer-events-none z-0 opacity-[0.16] text-white select-none">
        <svg className="w-72 h-72 sm:w-96 sm:h-96" viewBox="0 0 200 200" fill="none" stroke="currentColor">
          <circle cx="100" cy="100" r="16" strokeWidth="1.2" />
          <circle cx="100" cy="100" r="32" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="54" strokeWidth="1.2" />
          <circle cx="100" cy="100" r="76" strokeWidth="1" />
          <circle cx="100" cy="100" r="95" strokeWidth="1.5" />
          <path
            d="M100 20 C110 50 130 70 160 80 C130 90 110 110 100 140 C90 110 70 90 40 80 C70 70 90 50 100 20 Z"
            strokeWidth="1.2"
          />
          <path
            d="M100 20 C110 50 130 70 160 80 C130 90 110 110 100 140 C90 110 70 90 40 80 C70 70 90 50 100 20 Z"
            strokeWidth="1"
            transform="rotate(45 100 100)"
          />
          <polygon points="100,8 123,77 192,100 123,123 100,192 77,123 8,100 77,77" strokeWidth="0.8" />
          <polygon
            points="100,8 123,77 192,100 123,123 100,192 77,123 8,100 77,77"
            strokeWidth="0.8"
            transform="rotate(45 100 100)"
          />
        </svg>
      </div>
    </div>
  );
}
