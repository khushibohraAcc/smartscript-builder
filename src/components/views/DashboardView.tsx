import { Activity, CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentExecutions } from '@/components/dashboard/RecentExecutions';
import { DeviceStatusPanel } from '@/components/dashboard/DeviceStatus';
import { ExecutionResult } from '@/types/automation';
import { useDashboardStats } from '@/hooks/useApi';

interface DashboardViewProps {
  onViewResult: (result: ExecutionResult) => void;
}

export function DashboardView({ onViewResult }: DashboardViewProps) {
   const { data: stats, isLoading, error } = useDashboardStats(30);
 
   // Format duration for display
   const formatDuration = (seconds: number) => {
     if (seconds < 60) return `${seconds.toFixed(1)}s`;
     return `${(seconds / 60).toFixed(1)}m`;
   };
 
  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-card p-5 animate-pulse">
                <div className="flex items-center justify-center h-24">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              </div>
            ))}
          </>
        ) : error ? (
          <div className="col-span-4 glass-card p-5 text-center text-muted-foreground">
            <p>Failed to load dashboard stats. Is the backend running?</p>
          </div>
        ) : (
          <>
            <StatsCard
              title="Total Executions"
              value={stats?.total_executions ?? 0}
              subtitle="Last 30 days"
              icon={Activity}
              trend={stats ? { 
                value: Math.abs(stats.executions_trend), 
                isPositive: stats.executions_trend >= 0 
              } : undefined}
              variant="primary"
            />
            <StatsCard
              title="Pass Rate"
              value={`${stats?.pass_rate ?? 0}%`}
              subtitle="Last 30 days"
              icon={CheckCircle2}
              trend={stats ? { 
                value: Math.abs(stats.pass_rate_trend), 
                isPositive: stats.pass_rate_trend >= 0 
              } : undefined}
              variant="success"
            />
            <StatsCard
              title="Failed Tests"
              value={stats?.failed_tests ?? 0}
              subtitle="Requires attention"
              icon={XCircle}
              trend={stats ? { 
                value: Math.abs(stats.failed_tests_trend), 
                isPositive: stats.failed_tests_trend <= 0 
              } : undefined}
              variant="destructive"
            />
            <StatsCard
              title="Avg Duration"
              value={formatDuration(stats?.avg_duration ?? 0)}
              subtitle="Per test case"
              icon={Clock}
              trend={stats ? { 
                value: Math.abs(stats.duration_trend), 
                isPositive: stats.duration_trend <= 0 
              } : undefined}
              variant="warning"
            />
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <RecentExecutions onViewResult={onViewResult} />
        </div>
        <div>
          <DeviceStatusPanel />
        </div>
      </div>
    </div>
  );
}
