'use client';

import React from 'react';
import { BatchTimelineItem } from '@/types';
import {
  CheckCircle2,
  Calendar,
  MapPin,
  User,
  Sprout,
  ShieldCheck,
  PackageCheck,
  Sun,
  Truck,
} from 'lucide-react';

interface TimelineViewProps {
  timeline: BatchTimelineItem[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({ timeline }) => {
  const getStepIcon = (index: number) => {
    switch (index % 5) {
      case 0:
        return <Sprout className="w-4 h-4 text-forest-600" />;
      case 1:
        return <Sun className="w-4 h-4 text-amber-600" />;
      case 2:
        return <ShieldCheck className="w-4 h-4 text-sky-600" />;
      case 3:
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 4:
      default:
        return <PackageCheck className="w-4 h-4 text-purple-600" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-forest-100 text-forest-800 border border-forest-200">
            Immutable Audit Trail
          </span>
          <h3 className="text-xl font-bold text-slate-900 mt-1">Farm-to-Fork Journey</h3>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
          {timeline.length} Milestones Verified
        </span>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-forest-500 before:via-emerald-400 before:to-forest-200">
        {timeline.map((item, idx) => {
          const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });

          return (
            <div key={idx} className="relative group">
              {/* Timeline marker icon */}
              <div className="absolute -left-6 sm:-left-8 top-0 w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-white border-2 border-forest-500 shadow-sm flex items-center justify-center -translate-x-1/2">
                {getStepIcon(idx)}
              </div>

              {/* Milestone Content Card */}
              <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/70 hover:bg-white hover:shadow-md transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-forest-700 bg-forest-100/80 px-2 py-0.5 rounded-md">
                      Step {item.step || idx + 1}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900">
                      {item.title}
                    </h4>
                  </div>

                  <div className="flex items-center space-x-1 text-xs font-medium text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formattedDate}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                  {item.description}
                </p>

                {/* Metadata details: Operator & Location */}
                <div className="flex flex-wrap items-center gap-3 pt-2.5 border-t border-slate-200/60 text-xs text-slate-500">
                  <div className="flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-forest-600" />
                    <span className="font-semibold text-slate-700">{item.operator}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{item.location}</span>
                  </div>
                  <div className="ml-auto">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
