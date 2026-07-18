import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Coins, Clock, TrendingUp, TrendingDown, Users } from "lucide-react";
import CategoryBadge from "./CategoryBadge";
import StatusBadge from "./StatusBadge";
import BlobVisualization from "./BlobVisualization";
import { formatDeadline, isUrgent } from "@/utils/commitments";

export default function CommitmentCard({ commitment }) {
  const urgent = isUrgent(commitment.deadline);
  const backersCount = (commitment.backers || []).length;
  const backTotal = commitment.back_total || 0;
  const doubtTotal = commitment.doubt_total || 0;
  const totalPool = commitment.pool_total || commitment.stake_amount || 0;
  const tint =
    backTotal > doubtTotal
      ? "bg-emerald-50/60 ring-emerald-200/60 hover:ring-emerald-300"
      : doubtTotal > backTotal
        ? "bg-rose-50/60 ring-rose-200/60 hover:ring-rose-300"
        : "bg-white ring-slate-200/70 hover:ring-primary/60";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
    >
      <Link
        to={`/commitment/${commitment.id}`}
        className={`block rounded-2xl ring-1 shadow-sm hover:shadow-md hover:ring-2 transition-all overflow-hidden ${tint}`}
      >
        <div className="p-0">
          <div className="p-5 pb-3">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <CategoryBadge category={commitment.category} />
                <StatusBadge status={commitment.status} />
              </div>
            </div>

            <h3 className="text-base font-semibold text-slate-900 leading-snug mb-1.5 line-clamp-2">
              {commitment.title}
            </h3>
            {commitment.description && (
              <p className="text-sm text-slate-500 line-clamp-2 mb-2">
                {commitment.description}
              </p>
            )}
            
            <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
              <span className="flex items-center gap-1">
                <Clock className={`w-3.5 h-3.5 ${urgent ? "text-rose-500" : "text-slate-400"}`} />
                {formatDeadline(commitment.deadline)}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                {backersCount}
              </span>
            </div>
          </div>

          <div className="bg-[#0a0e14] text-white p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">The Pot</span>
              <div className="flex items-center gap-1 font-bold text-2xl text-amber-400">
                <Coins className="w-5 h-5" />
                {totalPool} <span className="text-sm text-slate-400 font-normal">USDC (SPL)</span>
              </div>
            </div>
            
            <div className="w-full mb-3 pointer-events-none">
              <BlobVisualization pool={totalPool} title={commitment.title} interactive={false} />
            </div>

            <div className="flex justify-between text-sm">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 uppercase tracking-wide">Escrow</span>
                <span className="font-semibold text-amber-400">{commitment.stake_amount}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-slate-500 uppercase tracking-wide">Backing</span>
                <span className="font-semibold text-emerald-400 flex items-center"><TrendingUp className="w-3 h-3 mr-0.5"/>{backTotal}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-500 uppercase tracking-wide">Doubt</span>
                <span className="font-semibold text-rose-400 flex items-center"><TrendingDown className="w-3 h-3 mr-0.5"/>{doubtTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}